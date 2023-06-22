import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Slider from 'react-slick'
import ReactImageMagnify from 'react-image-magnify'

import { BASE_IMG_PATH } from '@yesplz/core-web/config/constants'
import { Button, LikeButton } from '@yesplz/core-web/ui-kits/buttons'
import { withProductLike } from '../../hoc'
import { WideSlider } from '@yesplz/core-web/ui-kits/sliders'
import { IS_MOBILE } from '../../config/constants'

import ARROW_TOP from '../../assets/images/arrow-top.png'
import ARROW_DOWN from '../../assets/images/arrow-down.png'

import './product.css'

const MAX_IMAGES_THUMBNAIL = 4

class Product extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    imgSrc: PropTypes.string.isRequired,
    extraImgs: PropTypes.array,
    currency: PropTypes.string,
    favorite: PropTypes.bool,
    description: PropTypes.string,
    extraInfo: PropTypes.string,
    link: PropTypes.string,
    retailer: PropTypes.string,
    sizes: PropTypes.array,
    rawData: PropTypes.object,
    showArrows: PropTypes.bool,
    showDots: PropTypes.bool,
    tracker: PropTypes.object,
    toggleProductLike: PropTypes.func.isRequired
  }

  static defaultProps = {
    currency: '$',
    product: {},
    extraImgs: [],
    sizes: [],
    showArrows: false,
    showDots: false
  }

  constructor (props) {
    super(props)
    this.state = {
      thumbnailPosition: 0,
      imageThumbnailSelected: props.extraImgs[0] ? props.extraImgs[0] : null,
      imagesThumbnail: props.extraImgs.slice(0, MAX_IMAGES_THUMBNAIL)
    }
  }

  componentDidMount () {
    const { tracker, id, brand } = this.props

    tracker.registerTrackLinks('#BuyNow', 'Buy Now Button', { product_id: id, brand: brand })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      imageThumbnailSelected: nextProps.extraImgs[0] ? nextProps.extraImgs[0] : null
    })
  }

  get sliderSettings () {
    const { showArrows, showDots } = this.props
    return {
      dots: showDots,
      arrows: showArrows,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    }
  }

  get toggleLike () {
    const { rawData, favorite, toggleProductLike } = this.props
    return (e) => {
      e.preventDefault()
      toggleProductLike(rawData, !favorite)
    }
  }

  get isStrollEndThumbnail () {
    return this.state.thumbnailPosition === this.props.extraImgs.length - MAX_IMAGES_THUMBNAIL
  }

  // eslint-disable-next-line camelcase
  renderSizes = (allSizes, sizes) => (
    <ul className='Product-sizes'>
      {allSizes && allSizes.map(size => (
        <li key={size} className={classNames({
          'size-available': sizes.indexOf(size) > -1
        })}>{size}</li>
      ))}
    </ul>
  )

  handleClickThumbail = imgSrc => () => {
    this.setState({
      imageThumbnailSelected: imgSrc
    })
  }

  handleScrollThumbnail = () => {
    const { thumbnailPosition } = this.state
    this.setState({
      thumbnailPosition: thumbnailPosition + (this.isStrollEndThumbnail ? -1 : 1)
    })
  }

  render () {
    const { imageThumbnailSelected, thumbnailPosition } = this.state

    const {
      id,
      name,
      description,
      brand,
      imgSrc,
      extraImgs,
      price,
      originalPrice,
      currency,
      favorite,
      link,
      sizes,
      // eslint-disable-next-line react/prop-types
      all_sizes: allSizes
    } = this.props

    // sale is available if original price is different with price
    const isSale = originalPrice && originalPrice !== price
    const isOutOfStock = price === 0
    const sliderChildren = [
      imgSrc && (
        <div key={imgSrc} className='Product-imageWrapper'>
          <div key='primary-slide' style={{ backgroundImage: `url(${BASE_IMG_PATH}/${imgSrc})` }} className='Product-image' />
        </div>
      ),
      ...renderExtraImages(extraImgs, name)
    ]

    let ProductMobile = (
      <React.Fragment>
        <div className='Product-images'>
          <div className='LikeButton-wrapper'>
            <LikeButton active={favorite} onClick={this.toggleLike} />
          </div>
          {
            IS_MOBILE ? (
              <Slider {...this.sliderSettings}>
                {sliderChildren}
              </Slider>
            ) : (
              <WideSlider>
                {sliderChildren}
              </WideSlider>
            )
          }
        </div>
        <div className='Product-detail'>
          <h3 dangerouslySetInnerHTML={{ __html: brand }} />
          {
            !isOutOfStock && (
              <div className='Product-pricing'>
                {isSale && <div className='Product-original-price'>{currency}{originalPrice}</div>}
                <div className={classNames('Product-price', { sale: isSale })}>{currency}{price}</div>
              </div>
            )
          }

          <h4 dangerouslySetInnerHTML={{ __html: name }} />

          {/* {retailer && <p className='Product-retailer'>from {retailer}</p>} */}

          <p dangerouslySetInnerHTML={{ __html: description }} className='Product-description' />

          {/* {!isOutOfStock && <p>Available Sizes:</p>} */}

          {
            this.renderSizes(allSizes, sizes)
          }

          <h4 className={'Sizes-message'}>YOU WILL SEE IF YOUR SIZE IS AVAILABLE WHEN <a href=''>SIGN IN</a></h4>

        </div>
        <div className='Product-footer'>
          {isOutOfStock ? <p className='Product-out-of-stock'>Out of Stock</p> : <Button id='BuyNow' to={link}>Buy Now</Button>}
        </div>
      </React.Fragment>
    )

    let ProductDesktop = (
      <div className='ProductDetail-container'>
        <div className='ProductDetail-images'>
          <div className='Image-list-view'>
            {
              extraImgs.slice(thumbnailPosition, thumbnailPosition + MAX_IMAGES_THUMBNAIL).map((imgSrc, index) => {
                const BtnStrollPosition = this.isStrollEndThumbnail ? 0 : MAX_IMAGES_THUMBNAIL - 1
                return (
                  <div
                    key={index}
                    onClick={this.handleClickThumbail(imgSrc)}
                    className={classNames('Image-item', { actived: imageThumbnailSelected === imgSrc })}
                  >
                    <img src={`${BASE_IMG_PATH}/${imgSrc}`} alt='imgSrc' />
                    {
                      extraImgs.length && index === BtnStrollPosition &&
                      <button onClick={this.handleScrollThumbnail} className='BtnScrollThumbnail'>
                        {
                          this.isStrollEndThumbnail
                            ? <img src={ARROW_DOWN} alt='arrow-top' />
                            : <img src={ARROW_TOP} alt='arrow-down' />
                        }
                      </button>
                    }
                  </div>
                )
              })
            }
          </div>
          <div className='Image-main-view'>
            <div className='LikeButton-wrapper'>
              <LikeButton active={favorite} onClick={this.toggleLike} />
            </div>
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: 'Wristwatch by Ted Baker London',
                  isFluidWidth: true,
                  // height: 570,
                  src: `${BASE_IMG_PATH}/${imageThumbnailSelected}`
                },
                largeImage: {
                  src: `${BASE_IMG_PATH}/${imageThumbnailSelected}`,
                  width: 1200,
                  height: 1800
                }
              }}
            />
          </div>
        </div>
        <div className='ProductDetail-info'>
          <div className='Product-detail'>
            <div>
              <h3 dangerouslySetInnerHTML={{ __html: brand }} />
              <h4 dangerouslySetInnerHTML={{ __html: name }} />
              {
                !isOutOfStock && (
                  <div className='Product-pricing'>
                    {isSale && <div className='Product-original-price'>{currency}{originalPrice}</div>}
                    <div className={classNames('Product-price', { sale: isSale })}>{currency}{price}</div>
                  </div>
                )
              }
              <p dangerouslySetInnerHTML={{ __html: description }} className='Product-description' />
              {
                this.renderSizes(allSizes, sizes)
              }
              <h5 className={'Sizes-message'}>YOU WILL SEE IF YOUR SIZE IS AVAILABLE WHEN <a href=''>SIGN IN</a></h5>
            </div>
            <div className='Product-footer'>
              {isOutOfStock ? <p className='Product-out-of-stock'>Out of Stock</p> : <Button id='BuyNow' to={link}>BUY</Button>}
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div id={id} className='Product'>
        <div className='container-wide'>
          {
            IS_MOBILE ? ProductMobile : ProductDesktop
          }
        </div>
      </div>
    )
  }
}

export default withProductLike()(Product)

const renderExtraImages = (imgs = []) => (
  imgs.map((imgSrc, index) => (
    <div key={index} className='Product-imageWrapper'>
      <div key={imgSrc} style={{ backgroundImage: `url(${BASE_IMG_PATH}/${imgSrc})` }} className='Product-image' />
    </div>
  ))
)
