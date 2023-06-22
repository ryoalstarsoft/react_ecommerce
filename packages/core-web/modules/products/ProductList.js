import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import ProductGrid from './ProductGrid'
import Transition from '@yesplz/core-web/ui-kits/transitions/Transition'
import { ScrollFetcher } from '@yesplz/core-web/ui-kits/fetchers'
import { DotLoader } from '@yesplz/core-web/ui-kits/loaders'
import ProductsNotFound from './ProductsNotFound'
import { PRODUCT_COUNT_PER_PAGE } from '@yesplz/core-web/config/constants'
import { withProductLike } from '../../hoc'
import { matchingProductsSelector, closeMatchingProductsSelector } from './selectors'
import './product-list.css'

const childRenderer = (props) => {
  return (
    <ProductGrid
      {...props}
      productBasePath={props.productBasePath ? props.productBasePath : `/products/${props.category}`}
    />
  )
}

childRenderer.propTypes = {
  productBasePath: PropTypes.any,
  category: PropTypes.any
}

class ProductList extends Component {
  static propTypes = {
    id: PropTypes.string,
    products: PropTypes.array,
    nextOffset: PropTypes.number,
    show: PropTypes.bool,
    children: PropTypes.func,
    className: PropTypes.string,
    extraItem: PropTypes.element,
    willBeEmptyList: PropTypes.bool,
    showOriginalPrice: PropTypes.bool,
    showHighResImage: PropTypes.bool,
    combined: PropTypes.bool,
    useButton: PropTypes.bool,
    productBasePath: PropTypes.string,
    closeMatchingMessage: PropTypes.string,
    onFetch: PropTypes.func.isRequired,
    toggleProductLike: PropTypes.func.isRequired,
    onScrollBellowTheFold: PropTypes.func.isRequired,
    onScrollChange: PropTypes.func.isRequired,
    onTouchMove: PropTypes.func,
    style: PropTypes.object,
    loaderStyle: PropTypes.object
  }

  static defaultProps = {
    products: [],
    nextOffset: 0,
    willBeEmptyList: false,
    show: false,
    combined: false, // when activated, it won't separate matching and close matching.
    useButton: false,
    children: childRenderer,
    extraItem: undefined,
    showOriginalPrice: false,
    showHighResImage: false,
    closeMatchingMessage: 'The next close matching',
    style: {},
    onFetch: (next) => { next() },
    onScrollBellowTheFold: (scrollState) => {},
    onScrollChange: (scrollTop) => {}
  }

  constructor (props) {
    super(props)
    this.state = {
      useMinimumAnimation: false,
      matchingProducts: [],
      closeMatchingProducts: []
    }
  }

  componentDidUpdate (prevProps) {
    // use minimum animation on second load, e.g: using filter, etc
    if (!this.state.useMinimumAnimation && this.props.show) {
      this.setState({
        useMinimumAnimation: true
      })
    }
    // ReactDOM.findDOMNode(this).scrollIntoView()
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    // if result is not combined, then separate the matching and close matching products
    if (nextProps.show && !nextProps.combined) {
      return {
        matchingProducts: matchingProductsSelector(nextProps.products),
        closeMatchingProducts: closeMatchingProductsSelector(nextProps.products)
      }
    }
    return null
  }

  shouldComponentUpdate (nextProps, nextState) {
    // don't rerender on `useMinimumAnimation` update
    return !isEqual(this.props, nextProps) || !isEqual(this.state.matchingProducts, nextState.matchingProducts)
  }

  get handleScroll () {
    const { onScrollBellowTheFold, onScrollChange } = this.props
    return (top) => {
      onScrollChange(top)
      // check whether scroll position is going under the fold
      if (top > window.innerHeight) {
        onScrollBellowTheFold(true)
      } else {
        onScrollBellowTheFold(false)
      }
    }
  }

  get productListOptions () {
    const {
      nextOffset,
      showOriginalPrice,
      showHighResImage,
      toggleProductLike,
      productBasePath
    } = this.props
    const { useMinimumAnimation } = this.state

    // get loaded products count
    const prevOffset = (nextOffset - PRODUCT_COUNT_PER_PAGE)
    const loadedProductsCount = PRODUCT_COUNT_PER_PAGE * (prevOffset < 0 ? 0 : prevOffset)

    return {
      showOriginalPrice,
      showHighResImage,
      toggleProductLike,
      useMinimumAnimation,
      loadedProductsCount,
      productBasePath
    }
  }

  render () {
    const {
      id,
      products,
      show,
      children,
      className,
      extraItem,
      onFetch,
      onTouchMove,
      willBeEmptyList,
      style,
      loaderStyle,
      combined,
      useButton,
      closeMatchingMessage
    } = this.props
    const { useMinimumAnimation, matchingProducts, closeMatchingProducts } = this.state

    // get products
    // when `combined` is `true`, product list should render all products without separating the score
    let productList = null

    if (combined) {
      productList = renderProducts(products, children, this.productListOptions)
    } else {
      productList = (
        <React.Fragment>
          {renderProducts(matchingProducts, children, this.productListOptions)}
          {closeMatchingProducts.length > 0 ? <h4 className='animated fadeIn ProductList-subtitle'>{closeMatchingMessage}</h4> : <div style={{ display: 'none' }} />}
          {renderProducts(closeMatchingProducts, children, this.productListOptions)}
        </React.Fragment>
      )
    }

    return (
      <ScrollFetcher
        id={id}
        onFetch={onFetch}
        onScroll={this.handleScroll}
        onTouchMove={onTouchMove}
        className={className}
        useButton={useButton}
        style={{ ...styles.wrapper, overflowY: willBeEmptyList ? 'hidden' : 'scroll', ...style }}
        disableInitalFetch
      >
        {willBeEmptyList && <ProductsNotFound style={styles.notFound} />}
        {extraItem}
        <div className='container'>
          <div className='ProductList-wrapper'>
            {!show && <DotLoader visible style={loaderStyle || styles.loader} />}
            <Transition show={show} transition={useMinimumAnimation ? 'fadeIn' : 'fadeInUp'}>
              {productList}
            </Transition>
          </div>
        </div>
      </ScrollFetcher>
    )
  }
}

export default withProductLike()(ProductList)

const renderProducts = (
  products,
  children,
  {
    showOriginalPrice,
    showHighResImage,
    toggleProductLike,
    useMinimumAnimation,
    loadedProductsCount,
    productBasePath
  }
) => (
  products.map((product, index) => {
    const props = {
      key: product.product_id,
      id: product.product_id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.original_price,
      extraInfo: product.extra_info,
      category: product.category,
      showOriginalPrice: showOriginalPrice,
      favorite: product.favorite,
      imgSrc: showHighResImage ? product.front_img : product.front_img_sm,
      rawData: product,
      onToggleLike: toggleProductLike,
      productBasePath: productBasePath,
      style: {
        // `ProducGrid` need be showed directly in each page
        animationDelay: `${useMinimumAnimation ? 0 : 50 * (index - loadedProductsCount)}ms`
      }
    }
    return children(props)
  })
)

const styles = {
  wrapper: {
    position: 'relative'
  },
  loader: {
    position: 'absolute',
    margin: 'auto',
    top: 10,
    right: 0,
    bottom: 0,
    left: 0,
    width: 100,
    height: 30
  },
  notFound: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3
  }
}
