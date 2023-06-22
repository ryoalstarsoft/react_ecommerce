import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Product, ProductPlaceholder, ProductList } from '@yesplz/core-web/modules/products'
import { fetchProduct, fetchRelatedProducts, resetProduct, setScrollBellowTheFold } from '@yesplz/core-redux/ducks/product'
import history from '@yesplz/core-web/config/history'
import { SectionTitle } from '../../ui-kits/misc'
import { withTrackingProvider } from '../../hoc'
import { CATEGORIES_LABELS } from '../../config/constants'

// Redux
import { fetchPresets, setActiveCategory } from '@yesplz/core-redux/ducks/products'

import './product-page.css'

// eslint-disable-next-line react/prop-types
const BackToLabel = ({ label, to }) => (
  <div className='BackToLabel' >
    <Link to={to || '#'}>{label}</Link>
  </div>
)

class ProductPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    isProductFetched: PropTypes.bool,
    isRelatedProductsFetched: PropTypes.bool,
    productId: PropTypes.string.isRequired,
    product: PropTypes.object.isRequired,
    relatedProducts: PropTypes.array.isRequired,
    totalCount: PropTypes.number.isRequired,
    nextOffset: PropTypes.number,
    scrollBellowTheFold: PropTypes.bool,
    showArrows: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string,
    renderExtraItem: PropTypes.func,
    fetchProduct: PropTypes.func.isRequired,
    fetchRelatedProducts: PropTypes.func.isRequired,
    resetProduct: PropTypes.func.isRequired,
    setScrollBellowTheFold: PropTypes.func.isRequired,
    setActiveCategory: PropTypes.func.isRequired
  }

  static defaultProps = {
    renderExtraItem: () => (null)
  }

  componentDidMount () {
    console.log(this.props)
    const { productId, setActiveCategory, fetchProduct, fetchRelatedProducts } = this.props

    setActiveCategory(this.activeCategory)
    // fetch product and related product data
    this.productRequest = fetchProduct(productId)
    this.relatedsRequest = fetchRelatedProducts(productId)
    this.scrollInToView()
    // this.props.fetchPresets(this.currentCategory)
  }

  componentDidUpdate (prevProps) {
    const { productId, fetchProduct, fetchRelatedProducts, resetProduct } = this.props
    // if productId changed, fetch new product and related product data
    if (prevProps.productId !== this.props.productId) {
      resetProduct()
      this.productRequest = fetchProduct(productId)
      this.relatedsRequest = fetchRelatedProducts(productId)
      // set main scroll top to 0
      // const scrollWrapper = document.getElementById('MainScroll')
      // if (scrollWrapper) {
      //   scrollWrapper.scrollTop = 0
      // }
      this.scrollInToView()
    }
  }

  componentWillUnmount () {
    const { resetProduct } = this.props
    // cancel requests
    this.productRequest.cancel()
    this.relatedsRequest.cancel()

    // reset store data
    resetProduct()
  }

  get activeCategory () {
    return this.props.match.params.category
  }

  /**
   * only applicable on next fetch, if available
   */
  get handleFetchNext () {
    const { productId, relatedProducts, fetchRelatedProducts, totalCount } = this.props
    return (next) => {
      if (relatedProducts.length < totalCount) {
        // fetch next related products
        this.relatedsRequest = fetchRelatedProducts(productId)
        this.relatedsRequest.then(() => {
          next()
        })
      } else {
        next()
      }
    }
  }

  get handleScrollBellowTheFold () {
    const { scrollBellowTheFold, setScrollBellowTheFold } = this.props
    return (scrollState) => {
      // boolean can only be compared by casting it to string (js)
      if (scrollState.toString() !== scrollBellowTheFold.toString()) {
        history.push('#')
        setScrollBellowTheFold(scrollState)
      }
    }
  }

  scrollInToView = () => {
    if (process.env.REACT_APP_IS_MOBILE === 'true') {
      // setTimeout(() => {
      //   let idElement = process.env.REACT_APP_IS_MOBILE === 'true' ? 'Base-mobile' : 'ProductPage-desktop'
      //   ReactDOM.findDOMNode(document.getElementById(idElement)).scrollIntoView(0, 0)
      // }, 200)
    }
  }

  render () {
    const { product, relatedProducts, isProductFetched, isRelatedProductsFetched, nextOffset, renderExtraItem, showArrows, className } = this.props
    let productBox = <ProductPlaceholder />

    if (isProductFetched) {
      productBox = (
        <div className='ProductPage-top-wrapper'>
          {renderExtraItem(this)}
          <Product
            id={product.product_id}
            name={product.name}
            brand={product.brand}
            price={product.price}
            originalPrice={product.original_price}
            imgSrc={product.front_img}
            extraImgs={product.extra_imgs}
            description={product.description}
            favorite={product.favorite}
            link={product.src_url}
            retailer={product.retailer}
            sizes={product.sizes}
            all_sizes={product.all_sizes}
            extraInfo={product.extra_info}
            rawData={product}
            showArrows={showArrows}
            showDots
          />
          {
            process.env.REACT_APP_IS_MOBILE === 'true'
              ? <SectionTitle
                title='You Might Also Like'
                style={{ marginTop: 15, marginBottom: 15 }}
              /> : <div className='SectionTitle container'><div className='title'>You Might Also Like</div></div>
          }
        </div>
      )
    }

    const productName = CATEGORIES_LABELS[product.category]

    return (
      <div id={this.props.id} className={`ProductPage ${className}`}>
        <ProductList
          id='MainScroll'
          show={isRelatedProductsFetched}
          products={relatedProducts}
          nextOffset={nextOffset}
          onFetch={this.handleFetchNext}
          onScrollBellowTheFold={this.handleScrollBellowTheFold}
          extraItem={productBox}
          useButton
          className='ProductPage-products'
        />
        <BackToLabel to={`/products/${product.category}`} label={`Back to ${productName ? productName.toUpperCase() : '...'}`} />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  presets: state.products[props.match.params.category].presets,
  product: state.product.data,
  productId: props.match.params.productId,
  isProductFetched: state.product.fetched,
  isRelatedProductsFetched: state.product.relatedProductsFetched,
  relatedProducts: state.product.relatedProducts,
  totalCount: state.product.totalCount,
  nextOffset: state.product.nextOffset,
  scrollBellowTheFold: state.product.scrollBellowTheFold
})

const mapPropsToTrackingProps = (props) => ({
  product_id: props.match.params.productId,
  preset: props.match.params.presetName
})

export default compose(
  connect(
    mapStateToProps,
    {
      fetchProduct,
      fetchRelatedProducts,
      resetProduct,
      setScrollBellowTheFold,
      fetchPresets,
      setActiveCategory
    }
  ),
  withTrackingProvider('Product Detail', mapPropsToTrackingProps)
)(ProductPage)
