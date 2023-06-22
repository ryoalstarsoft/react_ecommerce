import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import isNil from 'lodash/isNil'
import { BASE_IMG_PATH } from '@yesplz/core-web/config/constants'
import { LikeButton } from '@yesplz/core-web/ui-kits/buttons'
import './product-grid.css'

export default class ProductGrid extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    showOriginalPrice: PropTypes.bool,
    imgSrc: PropTypes.string.isRequired,
    currency: PropTypes.string,
    category: PropTypes.string,
    className: PropTypes.string,
    extraInfo: PropTypes.string,
    favorite: PropTypes.bool,
    productBasePath: PropTypes.string,
    rawData: PropTypes.object,
    disableLike: PropTypes.bool,
    onToggleLike: PropTypes.func,
    style: PropTypes.object
  }

  static defaultProps = {
    currency: '$',
    active: false,
    favorite: false,
    showOriginalPrice: false,
    disableLike: false,
    className: '',
    category: '',
    productBasePath: '/products',
    onToggleLike: (data, favorite) => { console.debug('ProductGrid - favorite', data) }
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
    const {
      id, name, brand, imgSrc, price, originalPrice, currency, className, category,
      favorite, showOriginalPrice, productBasePath, disableLike, style, extraInfo } = this.props
    // sale is available if original price is different with price
    const isSale = !isNil(originalPrice) && originalPrice !== price
    const isOutOfStock = +price === 0
    const categoryClassName = category ? `is-${category}` : ''

    return (
      <Link to={`${productBasePath}/${id}`} className={`ProductGrid ${className}`} style={style} title={`${name} - ${brand}${extraInfo}`}>
        {!disableLike && <LikeButton active={favorite} onClick={this.toggleLike} />}
        <div className={`ProductGrid-thumbnail ${categoryClassName}`} style={{ backgroundImage: imgSrc ? `url(${BASE_IMG_PATH}/${imgSrc})` : '' }}>
          {
            !imgSrc && (
              <div className='ProductGrid-noImage' />
            )
          }
        </div>
        <div className='ProductGrid-detail'>
          <h5 dangerouslySetInnerHTML={{ __html: brand }} />
          {isSale && showOriginalPrice && <div className='ProductGrid-originalPrice'>{currency}{originalPrice}</div>}
          <div className={classNames('ProductGrid-price', { sale: isSale })}>
            {
              !isOutOfStock ? `${currency}${price}` : 'Out of Stock'
            }
          </div>
        </div>
      </Link>
    )
  }
}
