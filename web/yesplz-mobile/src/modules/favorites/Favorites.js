import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import queryString from 'query-string'
import classnames from 'classnames'

import { CATEGORY_TOPS, FILTER_PRICES } from '@yesplz/core-web/config/constants'
import { syncFavoriteProducts } from '@yesplz/core-redux/ducks/products'
import { syncFilter, syncFavoritePresets } from '@yesplz/core-redux/ducks/filters'
import { withTrackingProvider } from '@yesplz/core-web/hoc'
import { ProductList } from '@yesplz/core-web/modules/products'
import { Presets } from '@yesplz/core-web/modules/presets'
import { TitleHeader } from '@yesplz/core-web/ui-kits/title-headers'
import { FilterIcon } from '@yesplz/core-web/ui-kits/icons'

import MenuNavigation from '../menus/MenuNavigation'
import FavoriteProductsFilter from './FavoriteProductsFilter'
import EmptyContent from '../../ui-kits/empties'

// utils
import { countFilters, getPercentSale } from '../../utils'

import './favorites.scss'

const getNameFilterPrice = price => {
  const filterPrice = FILTER_PRICES
    .find(filterPrice =>
      price >= filterPrice.range[0] && (filterPrice.range[1] ? price <= filterPrice.range[1] : true))
  return filterPrice ? filterPrice.name : null
}

class Favorites extends Component {
  static propTypes = {
    favoriteType: PropTypes.string,
    products: PropTypes.array,
    presets: PropTypes.array,
    nextOffset: PropTypes.number,
    syncFilter: PropTypes.func.isRequired,
    syncFavoritePresets: PropTypes.func.isRequired,
    syncFavoriteProducts: PropTypes.func.isRequired,
    history: PropTypes.any,
    match: PropTypes.object,
    location: PropTypes.object,
    filters: PropTypes.array
  }

  constructor (props) {
    super(props)

    this.state = {
      useTwoColumnsView: false,
      isFilterVisible: false
    }
  }

  componentDidMount () {
    const { syncFilter, syncFavoritePresets, syncFavoriteProducts } = this.props

    syncFilter()
    syncFavoritePresets()
    syncFavoriteProducts(true) // sync backend
  }

  get currentCategory () {
    const { match } = this.props
    return match.params.category || CATEGORY_TOPS
  }

  get listingView () {
    const { location } = this.props
    const qsValues = queryString.parse(location.search)

    return qsValues.listingView
  }

  get productsSorted () {
    const { products } = this.props
    let {
      types,
      sale,
      prices
    } = this.props.filters

    return products
      .filter(product => types ? !!~types.indexOf(product.category) : true)
      // sort sales
      .filter(product => sale ? !!~sale.indexOf(getPercentSale(product.original_price, product.price)) : true)
      // sort prices
      .filter(product => prices ? !!~prices.indexOf(getNameFilterPrice(product.price)) : true)
  }

  handleClickMenuNavigation = item => {
    const { key } = item
    this.props.history.push(`/favorites/${key}`)
  }

  handleFilterButtonClick = () => {
    this.setState({
      isFilterVisible: true
    })
  }

  handleSubmitFilter = (productListConfig) => {
    this.setState({
      useTwoColumnsView: productListConfig.colType === 'double'
    })
    this.handleCloseFilter()
  }

  handleCloseFilter = () => {
    this.setState({
      isFilterVisible: false
    })
  }

  get menuNavigationOptions () {
    return [
      {
        title: 'ITEMS',
        isActived: true,
        key: 'items'
      },
      {
        title: 'STYLES',
        isActived: false,
        key: 'styles'
      }
    ].map(item => ({
      ...item,
      isActived: this.props.favoriteType === item.key
    }))
  }

  render () {
    const { presets, nextOffset, favoriteType, filters } = this.props
    const { isFilterVisible, useTwoColumnsView } = this.state

    const showFits = favoriteType === 'styles'
    return (
      <div className='Favorites'>
        {/* <div className='container'> */}
        <TitleHeader title='Favorites'>
          <span className='title'>Favorites</span>
        </TitleHeader>
        {/* </div> */}
        <div className='container'>
          <MenuNavigation
            menu={this.menuNavigationOptions}
            onClickMenuItem={this.handleClickMenuNavigation}
            YFilter={<FilterIcon countFilters={countFilters(filters)} onClick={this.handleFilterButtonClick} />}
          />
        </div>
        {
          favoriteType === 'items' && this.productsSorted.length > 0 &&
          <ProductList
            id='MainScroll'
            products={this.productsSorted}
            nextOffset={nextOffset}
            // extraItem={banner}
            className={classnames('Favorites-products', {
              twoColumns: useTwoColumnsView
            })}
            show
            combined
          />
        }
        {
          favoriteType === 'items' && this.productsSorted.length === 0 &&
          <div className='container'>
            <EmptyContent page='favorite-items' />
          </div>
        }
        {
          showFits && presets.length > 0 &&
          // eslint-disable-next-line react/jsx-no-undef
          <Presets
            presets={presets}
            style={styles.presets}
            show
          />
        }
        {
          showFits && presets.length === 0 &&
          <div className='container'>
            <EmptyContent page='favorite-styles' />
          </div>
        }
        <FavoriteProductsFilter
          defaultColType={this.listingView}
          activeCategory={this.currentCategory}
          isVisible={isFilterVisible}
          onSubmit={this.handleSubmitFilter}
          onClose={this.handleCloseFilter}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  favoriteType: props.match.params.favoriteType,
  products: state.products.favoriteList,
  presets: state.filters.favoritePresets,
  nextOffset: state.products.nextOffset,
  filters: state.filters.secondary
})

export default compose(
  connect(
    mapStateToProps,
    {
      syncFilter,
      syncFavoritePresets,
      syncFavoriteProducts
    }
  ),
  withTrackingProvider('Favorites')
)(Favorites)

const styles = {
  tabs: {
    marginTop: 10,
    marginBottom: 20
  },
  fitsTabs: {
    marginTop: 20,
    marginBottom: 20
  },
  presets: {
    height: '100%'
  }
}
