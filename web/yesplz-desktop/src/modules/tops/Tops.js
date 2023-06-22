import React, { Component } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { fetchProducts } from '@yesplz/core-redux/ducks/products'
import { syncFilter } from '@yesplz/core-redux/ducks/filters'
import withTrackingProvider from '@yesplz/core-web/hoc/withTrackingProvider'
import { ProductList } from '@yesplz/core-web/modules/products'
// import { SectionTitle } from '@yesplz/core-web/ui-kits/misc'
import { VisualFilter } from '../visual-filter'
import './tops.css'

class Tops extends Component {
  static propTypes = {
    products: PropTypes.array,
    totalCount: PropTypes.number,
    isProductsFetched: PropTypes.bool,
    onboarding: PropTypes.bool,
    nextOffset: PropTypes.number,
    syncFilter: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    isProductsFetched: false
  }

  componentDidMount () {
    const { isProductsFetched, syncFilter, fetchProducts } = this.props

    // don't need to do initial fetch if products is fetched already
    if (!isProductsFetched) {
      // make sure the filter is synced with localStorage data
      syncFilter()
      fetchProducts(undefined, undefined, undefined, true)
    }
  }

  /**
   * only applicable on next fetch, if available
   */
  get handleFetch () {
    const { products, totalCount, fetchProducts } = this.props
    return (next) => {
      if (products.length < totalCount) {
        fetchProducts().then(() => {
          next()
        })
      } else {
        next()
      }
    }
  }

  render () {
    const { products, isProductsFetched, nextOffset, onboarding } = this.props

    return (
      <div className={classNames('Tops', { onboarding })}>
        <div className='container-wide'>
          <div className='Tops-content'>
            <VisualFilter />
            <ProductList
              id='MainScroll'
              show={isProductsFetched}
              products={products}
              nextOffset={nextOffset}
              showOriginalPrice
              className='Tops-products'
              onFetch={this.handleFetch}
              closeMatchingMessage='Our next best suggestion.'
              style={{ paddingTop: 15 }}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const activeCategory = state.products.activeCategory
  return {
    filters: state.filters[activeCategory].data,
    products: state.products[activeCategory].data,
    totalCount: state.products[activeCategory].totalCount,
    isProductsFetched: state.products[activeCategory].fetched,
    nextOffset: state.products[activeCategory].nextOffset,
    onboarding: state.filters.onboarding
  }
}

export default compose(
  connect(mapStateToProps, { fetchProducts, syncFilter }),
  withTrackingProvider('Products Search')
)(Tops)
