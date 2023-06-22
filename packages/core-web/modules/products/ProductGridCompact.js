import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { BASE_IMG_PATH } from '@yesplz/core-web/config/constants'
import { LikeButton } from '@yesplz/core-web/ui-kits/buttons'
import './product-grid-compact.css'

export default class ProductGridCompact extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    showOriginalPrice: PropTypes.bool,
    imgSrc: PropTypes.string.isRequired,
    extraInfo: PropTypes.string,
    currency: PropTypes.string,
    className: PropTypes.string,
    favorite: PropTypes.bool,
    rawData: PropTypes.object,
    onToggleLike: PropTypes.func,
    style: PropTypes.object
  }

  static defaultProps = {
    currency: '$',
    active: false,
    favorite: false,
    showOriginalPrice: false,
    className: '',
    onToggleLike: (data, favorite) => { console.debug('ProductGridCompact - favorite', data) }
  }

  constructor (props) {
    super(props)
    this.state = {
      liked: false
    }
  }

  get toggleLike () {
    const { rawData, favorite, onToggleLike } = this.props
    return (e) => {
      e.preventDefault()
      onToggleLike(rawData, !favorite)
    }
  }

  render () {
    const { id, name, brand, imgSrc, price, originalPrice, showOriginalPrice, currency, className, favorite, style, extraInfo, category } = this.props

    // sale is available if original price is different with price
    const isSale = originalPrice && originalPrice !== price
    return (
      <Link to={`/products/${category}/${id}`} className={`ProductGridCompact ${className}`} style={style} title={`${name} - ${brand}${extraInfo}`}>
        <div className='ProductGridCompact-thumbnail'>
          <LikeButton active={favorite} onClick={this.toggleLike} />
          {
            imgSrc ? (
              <img src={`${BASE_IMG_PATH}/${imgSrc}`} alt={name} className='img-responsive' />
            ) : (
              <div className='ProductGridCompact-noImage' />
            )
          }
        </div>
        <div className='ProductGridCompact-detail'>
          <h4 dangerouslySetInnerHTML={{ __html: brand }} />
          <h5 dangerouslySetInnerHTML={{ __html: name }} />
          <div className='ProductGridCompact-price-tag'>
            <div className={classNames('ProductGridCompact-price', { sale: isSale })}>
              {currency}{price}
            </div>
            {isSale && showOriginalPrice && <div className='ProductGridCompact-original-price'>{currency}{originalPrice}</div>}
          </div>
        </div>
      </Link>
    )
  }
}
