import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import map from 'lodash/map'
import ProductListHorizontal from '@yesplz/core-web/modules/products/ProductListHorizontal'
import { getProducts } from '@yesplz/core-redux/ducks/products'
import { mapProductFavorites, updateProductFavorite } from '@yesplz/core-redux/ducks/helpers'
import { GroupTitle } from '@yesplz/core-web/ui-kits/misc'

class StatefulCategorizedProducts extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    filters: PropTypes.object,
    favoriteProducts: PropTypes.array,
    onProductLike: PropTypes.func,
    onProductPresetClick: PropTypes.func
  }

  static defaultProps = {
    filters: {},
    limitPerPage: 10,
    favoriteProducts: [],
    onProductPresetClick () { }
  }

  constructor (props) {
    super(props)
    this.state = {
      products: [],
      nextOffset: 0,
      totalCount: 0
    }
    this.fetchProducts = this.fetchProducts.bind(this)
    this.toggleLike = this.toggleLike.bind(this)
  }

  componentDidMount () {
    const { favoriteProducts } = this.props
    this.syncProductLike(favoriteProducts)
  }

  componentDidUpdate (prevProps, prevState) {
    const { favoriteProducts } = this.props
    const { products } = this.state

    if (!isEqual(prevProps.favoriteProducts, favoriteProducts) || !isEqual(prevState.products, products)) {
      this.syncProductLike(favoriteProducts)
    }
  }

  syncProductLike (favoriteProducts) {
    const { products } = this.state
    const favoriteProductIds = map(favoriteProducts, 'product_id')

    this.setState({
      products: mapProductFavorites(favoriteProductIds, products)
    })
  }

  async fetchProducts (category, limitPerPage) {
    const { filters } = this.props
    const { products, nextOffset } = this.state

    try {
      const response = await getProducts(category, {
        offset: nextOffset,
        limit_per_pid: 1,
        ...filters
      }, limitPerPage)

      this.setState({
        products: [...products, ...response.products],
        nextOffset: nextOffset + limitPerPage
      })
    } catch (error) {
      console.error('Error!', error)
    }
  }

  toggleLike (product, favorite) {
    const { onProductLike } = this.props
    const { products } = this.state

    onProductLike(product, favorite)

    this.setState({
      products: updateProductFavorite(product.product_id, favorite, products)
    })
  }

  render () {
    const { title, category, onProductPresetClick } = this.props
    const { products } = this.state

    return (
      <React.Fragment>
        <GroupTitle onClickTitle={onProductPresetClick}>{title}</GroupTitle>
        <ProductListHorizontal
          title={title}
          category={category}
          limitPerPage={20}
          products={products}
          onInit={this.fetchProducts}
          onFetchNext={this.fetchProducts}
          onToggleLike={this.toggleLike}
        />
      </React.Fragment>
    )
  }
}

export default StatefulCategorizedProducts
