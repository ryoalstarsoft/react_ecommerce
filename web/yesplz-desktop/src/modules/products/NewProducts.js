import React from 'react'
import PropTypes from 'prop-types'
import ProductListHorizontal from '@yesplz/core-web/modules/products/ProductListHorizontal'
import ProductListVertical from '@yesplz/core-web/modules/products/ProductListVertical'
import withProductsFetcher from './withProductsFetcher'

const categoryFilters = {
  wtop: {
    sizes: [5, 6]
  },
  wshoes: {
    sizes: 'regular'
  },
  wpants: {}
}

export const EnhancedProductListVertical = withProductsFetcher(ProductListVertical)
export const EnhancedProductListHorizontal = withProductsFetcher(ProductListHorizontal)

const NewProducts = ({ isVertical, ...otherProps }) => {
  const newProductsFilters = {
    sale: 30,
    prices: ['-50', '50-100'],
    new: 1,
    ...categoryFilters[otherProps.category]
  }

  if (otherProps.presetName) {
    newProductsFilters.preset = otherProps.presetName
  }

  if (isVertical) {
    return <EnhancedProductListVertical {...otherProps} filters={newProductsFilters} />
  }

  return <EnhancedProductListHorizontal {...otherProps} filters={newProductsFilters} />
}

NewProducts.propTypes = {
  isVertical: PropTypes.bool
}

NewProducts.defaultProps = {
  isVertical: false
}

export default NewProducts
