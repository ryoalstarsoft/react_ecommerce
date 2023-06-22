import React, { Component } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import withTrackingProvider from '@yesplz/core-web/hoc/withTrackingProvider'
import { syncFavoriteProducts, enableInitialFetch } from '@yesplz/core-redux/ducks/products'
import { syncFilter, syncFavoritePresets, likePreset, unlikePreset, setFilter } from '@yesplz/core-redux/ducks/filters'
import { ProductList, ProductGridCompact } from '@yesplz/core-web/modules/products'
// import Presets from 'modules/presets/Presets'
import MenuNavigation from '../menus/MenuNavigation'
import FavoriteProductsFilter from './FavoriteProductsFilter'
import { ListView } from '@yesplz/core-web/modules/filters'
import classnames from 'classnames'
import EmptyContent from '../../ui-kits/empties'
import './favorites.scss'
import Transition from '@yesplz/core-web/ui-kits/transitions/Transition'
import AdvancedPreset from '@yesplz/core-web/modules/presets/AdvancedPreset'
import camelCase from 'lodash/camelCase'
import history from '@yesplz/core-web/config/history'
import { formatPresetName } from '@yesplz/core-web/utils/index'
import { withTrackingConsumer } from '@yesplz/core-web/hoc'

class Favorites extends Component {
  static propTypes = {
    favoriteType: PropTypes.string,
    products: PropTypes.array,
    presets: PropTypes.array,
    nextOffset: PropTypes.number,
    match: PropTypes.object,
    history: PropTypes.object,
    syncFilter: PropTypes.func.isRequired,
    syncFavoritePresets: PropTypes.func.isRequired,
    syncFavoriteProducts: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    likePreset: PropTypes.func.isRequired,
    enableInitialFetch: PropTypes.func.isRequired,
    unlikePreset: PropTypes.func.isRequired,
    tracker: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      defaultColType: true,
      filters: {},
      filterPresets: {}
    }
  }

  componentDidMount () {
    const { syncFilter, syncFavoritePresets, syncFavoriteProducts } = this.props

    syncFilter()
    syncFavoritePresets()
    syncFavoriteProducts(true) // sync backend
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

  handleClickMenuNavigation = item => {
    const { key } = item
    this.props.history.push(`/favorites/${key}`)
  }

  handleSubmitFilter = (filters) => {
    this.setState({ filters })
  }

  handleSubmitFilterPreset = (filterPresets) => {
    this.setState({ filterPresets })
  }

  onColTypeChange = data => {
    this.setState({
      defaultColType: data === 'single'
    })
  }

  getProducts = () => {
    const { products } = this.props
    const { filters } = this.state
    let productsRes = [...products]
    if (filters && filters.types && filters.types.length > 0) {
      productsRes = productsRes.filter(product => filters.types.indexOf(product.category) > -1)
    }
    if (filters && filters.price && filters.price.length > 0) {

    }
    return productsRes
  }

  getPresets = () => {
    const { presets } = this.props
    const { filterPresets } = this.state
    let presetRes = [...presets]
    if (filterPresets && filterPresets.types && filterPresets.types.length > 0) {
      presetRes = presetRes.filter(preset => filterPresets.types.indexOf(preset.category) > -1)
    }
    return presetRes
  }

  get togglePresetLike () {
    const { likePreset, unlikePreset, tracker } = this.props
    return (preset, favorite) => {
      if (favorite) {
        likePreset(preset, tracker)
      } else {
        unlikePreset(preset, tracker)
      }
    }
  }

  get handlePresetClick () {
    const { setFilter, enableInitialFetch, tracker } = this.props
    return (filters, presetName, category) => {
      setFilter(category, filters)
      // make products fetched from beginning
      enableInitialFetch()
      // redirect to preset's products page
      history.push(`/preset-products/${category}/${formatPresetName(presetName)}`)
      // track preset click
      tracker.track('Preset Choose', { name: presetName })
    }
  }

  onClickGroupTitle = (preset) => () => {
    this.props.history.push(
      `/products/${preset.category}/list?listingView=single&page=editorspick&preset=${formatPresetName(preset.name)}`
    )
  }

  render () {
    const { nextOffset, favoriteType } = this.props
    const products = this.getProducts()
    const showFits = favoriteType === 'styles'
    const presets = this.getPresets()
    return (
      <div className='FavoriteContent'>
        <div className='left-menu'>
          <MenuNavigation
            menu={this.menuNavigationOptions}
            onClickMenuItem={this.handleClickMenuNavigation}
          // YFilter={<FilterIcon countFilters={countFilters(filters)} onClick={this.handleFilterButtonClick} />}
          />
          <div className='content-menu'>
            {
              favoriteType === 'items' && <FavoriteProductsFilter onSubmit={this.handleSubmitFilter} />
            }
            {
              favoriteType === 'styles' && <FavoriteProductsFilter onSubmit={this.handleSubmitFilterPreset} customField={['types']} />
            }
          </div>
        </div>
        <div className='Favorites'>
          <div className='title'>
            <h3>FAVORITES</h3>
            {!showFits && (
              <div className='GridView'>
                <ListView colType={this.state.defaultColType ? 'single' : 'double'} onChange={this.onColTypeChange} />
              </div>
            )}
          </div>
          {
            showFits ? (
              presets && presets.length > 0 ? (
                // <Presets
                //   presets={presets}
                //   presetBaseURI='/preset-products'
                //   style={styles.presets}
                //   match={match}
                //   show />
                <div className='content-preset'>
                  <Transition show transition='fadeInUp'>
                    {
                      presets.map((preset, index) => {
                        return (
                          <AdvancedPreset
                            key={index}
                            // id={`${camelCase(preset.name)}${index}`}
                            id={`${camelCase(preset.key)}`}
                            preset={preset}
                            onClick={this.handlePresetClick}
                            onClickGroupTitle={this.onClickGroupTitle(preset)}
                            onToggleLike={this.togglePresetLike}
                            presetMatchesCount={4}
                            useMinimalPreset
                            activeCategory={preset.category}
                            hidePreset={false}
                            titleBellowPreset
                            defaultViewBoxSvg={[0, 0, 304, 214]}
                          />
                        )
                      })
                    }
                  </Transition>
                </div>

              ) : (
                <EmptyContent page='favorite-styles' />
              )
            ) : (
              products && products.length > 0 ? (
                <div className={classnames('ProductsPage-ProductList', {
                  ColTypeDouble: !this.state.defaultColType
                })}>
                  <ProductList
                    id='MainScroll'
                    products={products}
                    nextOffset={nextOffset}
                    // extraItem={tabNav}
                    className='Favorites-products'
                    showOriginalPrice
                    combined
                    show>
                    {props => <ProductGridCompact {...props} />}
                  </ProductList>
                </div>
              ) : (
                <EmptyContent page='favorite-items' />
              )
            )
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  favoriteType: props.match.params.favoriteType,
  products: state.products.favoriteList,
  presets: state.filters.favoritePresets,
  nextOffset: state.products.nextOffset
})

export default compose(
  connect(
    mapStateToProps,
    {
      syncFilter,
      syncFavoritePresets,
      syncFavoriteProducts,
      likePreset,
      unlikePreset,
      setFilter,
      enableInitialFetch
    }
  ),
  withTrackingProvider('Favorites'),
  withTrackingConsumer()
)(Favorites)

const styles = {
  tabs: {
    marginTop: 10,
    marginBottom: 25
  },
  fitsTabs: {
    marginTop: 10,
    marginRight: 5,
    marginBottom: 25,
    marginLeft: 5
  },
  presets: {
    height: '100%'
  }
}
