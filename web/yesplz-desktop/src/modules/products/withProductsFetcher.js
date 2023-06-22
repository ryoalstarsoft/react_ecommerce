import { connect } from 'react-redux'
import { compose } from 'redux'
import withProductLike from '@yesplz/core-web/hoc/withProductLike'
import { fetchProducts } from '@yesplz/core-redux/ducks/products'

const mapStateToProps = (state, props) => {
  const currentCategoryProducts = state.products[props.category]
  const currentCategoryFilters = state.filters[props.category]

  return {
    products: currentCategoryProducts.data,
    filters: {
      ...currentCategoryFilters.data,
      ...state.filters.secondary,
      ...state.filters.stuff
    },
    maxCount: currentCategoryProducts.limitPerPage
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  onInit (category, limitPerPage, customFilters) {
    dispatch(fetchProducts(category, { ...props.filters, ...customFilters }, limitPerPage, true))
  },
  onFilter (category, filters, limitPerPage) {
    dispatch(fetchProducts(category, filters, limitPerPage, true))
  },
  onFetchNext (category, limitPerPage, customFilters) {
    return dispatch(fetchProducts(category, { ...props.filters, ...customFilters }, limitPerPage))
  },
  onToggleLike (data, favorite) {
    props.toggleProductLike(data, favorite)
  }
})

/**
 * enhance component with products fetcher
 * @param {Object} customFilters
 */
export default function withProductsFetcher (WrappedComponent) {
  return compose(
    withProductLike(),
    connect(mapStateToProps, mapDispatchToProps)
  )(WrappedComponent)
}
