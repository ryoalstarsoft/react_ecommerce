import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import camelCase from 'lodash/camelCase'
import isNil from 'lodash/isNil'
import classNames from 'classnames'
import history from '@yesplz/core-web/config/history'
import { fetchPresets, setFilter, likePreset, unlikePreset, syncFilter } from '@yesplz/core-redux/ducks/filters'
import { fetchProducts, enableInitialFetch } from '@yesplz/core-redux/ducks/products'
import Transition from '@yesplz/core-web/ui-kits/transitions/Transition'
import { DotLoader } from '@yesplz/core-web/ui-kits/loaders'
import { CloseButton } from '@yesplz/core-web/ui-kits/buttons'
import Preset from '@yesplz/core-web/modules/presets/Preset'
import { ProductList } from '@yesplz/core-web/modules/products'
import './presets.css'

// Shown as fits
export class Presets extends Component {
  static propTypes = {
    // presets
    presets: PropTypes.array,
    isPresetsFetched: PropTypes.bool,
    activePresetName: PropTypes.string,
    presetBaseURI: PropTypes.string,
    // products
    products: PropTypes.array,
    totalCount: PropTypes.number,
    isProductsFetched: PropTypes.bool,
    nextOffset: PropTypes.number,
    activeCategory: PropTypes.string,
    // misc
    extraItem: PropTypes.element,
    style: PropTypes.object,
    // actions
    fetchPresets: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    likePreset: PropTypes.func.isRequired,
    unlikePreset: PropTypes.func.isRequired,
    syncFilter: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    enableInitialFetch: PropTypes.func.isRequired
  }

  static defaultProps = {
    presets: [],
    isPresetsFetched: false,
    presetBaseURI: '/presets'
  }

  constructor (props) {
    super(props)
    this.state = {
      splitView: false,
      scrollUpdated: false
    }
  }

  componentDidMount () {
    const { fetchPresets, activePresetName, syncFilter, fetchProducts, isPresetsFetched } = this.props
    // don't need to do initial fetch if presets is fetched already
    if (!isPresetsFetched) {
      fetchPresets()
    }

    // make sure the filter is synced with localStorage data
    syncFilter()

    // if active preset name exist, fetch product with new data
    if (!isNil(activePresetName)) {
      fetchProducts(undefined, undefined, undefined, true)
    }
  }

  componentWillUnmount () {
    if (this.scrollTopTimeout) {
      clearTimeout(this.scrollTopTimeout)
    }
  }

  componentDidUpdate () {
    const { scrollUpdated } = this.state
    // set scroll position to active preset. Only run once.
    if (!scrollUpdated && this.activePreset) {
      this.moveScrollToPreset(this.activePreset, 100)
      // set scroll updated flag
      this.setState({
        scrollUpdated: true
      })
    }
  }

  /**
   * will move presets scroll position to active preset
   * @param {Object} preset preset element
   * @param {number} offsetTop relative top position to the scroll wrapper
   */
  moveScrollToPreset (preset, offsetTop = 0) {
    // get active preset top position
    const activePresetId = preset.props.id
    const activePresetTop = document.getElementById(activePresetId).getBoundingClientRect().top
    // get presets wrapper top position
    const presetsWrapperTop = this.presetList.getBoundingClientRect().top

    // move scroll to active preset position
    this.scrollWrapperTo(activePresetTop - presetsWrapperTop - offsetTop)
  }

  get handlePresetClick () {
    const { presetBaseURI, setFilter, fetchProducts, enableInitialFetch, activePresetName } = this.props
    return (filters, filterName, category) => {
      setFilter(category, filters)
      // fetch products from the beginning after filter applied
      enableInitialFetch()
      fetchProducts(undefined, undefined, undefined, true)

      // if user click on active preset, close the split view
      if (activePresetName === filterName) {
        history.push(presetBaseURI)
      } else {
        // enable split view to show product list
        history.push(`${presetBaseURI}/${filterName}`)
      }
    }
  }

  scrollWrapperTo (scrollTop) {
    if (this.presetList) {
      this.scrollTopTimeout = setTimeout(() => {
        // this.presetList.scrollTop = scrollTop
      }, 300)
    }
  }

  get togglePresetLike () {
    const { likePreset, unlikePreset } = this.props
    return (preset, favorite) => {
      if (favorite) {
        likePreset(preset)
      } else {
        unlikePreset(preset)
      }
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

  get handleSplitViewClose () {
    const { presetBaseURI } = this.props
    return () => {
      history.push(presetBaseURI)
    }
  }

  get getPresetListRef () {
    return element => {
      this.presetList = element
    }
  }

  makeGetPresetActivePresetRef (presetName) {
    const { activePresetName } = this.props
    return element => {
      // get only active preset ref
      if (presetName.trim() === (activePresetName || '').trim()) {
        this.activePreset = element
      }
    }
  }

  render () {
    const {
      isPresetsFetched, presets, extraItem, isProductsFetched, products,
      nextOffset, activePresetName, activeCategory, style } = this.props
    const splitView = !isNil(activePresetName)

    return (
      <div id={splitView ? undefined : 'MainScroll'} className='Presets' style={style}>
        {extraItem}
        {!isPresetsFetched && <DotLoader visible style={styles.loader} />}
        {/* presets list */}
        {
          splitView && (
            <div className='PresetsInnerHead'>
              <CloseButton onClick={this.handleSplitViewClose} />
            </div>
          )
        }
        <div className={classNames('PresetsInnerWrapper', { splitView })}>
          <div className='PresetsInnerWrapper-presets' ref={this.getPresetListRef}>
            <Transition show transition='fadeInUp'>
              {
                presets.map((preset, index) => {
                  const fade = splitView && preset.name.trim() !== (activePresetName || '').trim()
                  return (
                    <Preset
                      ref={this.makeGetPresetActivePresetRef(preset.name)}
                      key={preset.key || `${preset.name} ${index}`}
                      id={`${camelCase(preset.name)}${index}`}
                      presetKey={preset.key}
                      name={preset.name}
                      coretype={preset.coretype}
                      neckline={preset.neckline}
                      shoulder={preset.shoulder}
                      sleeveLength={preset.sleeve_length}
                      topLength={preset.top_length}
                      pattern={preset.pattern}
                      solid={preset.solid}
                      details={preset.details}
                      color={preset.color}
                      favorite={preset.favorite}
                      category={preset.category}
                      onClick={this.handlePresetClick}
                      onToggleLike={this.togglePresetLike}
                      style={{ animationDelay: `${50 * index}ms`, opacity: fade ? 0.25 : 1 }}
                    />
                  )
                })
              }
            </Transition>
          </div>
          {/* products lists, only activated on splitView */}
          {
            splitView && (
              <ProductList
                id={splitView ? 'MainScroll' : undefined}
                show={isProductsFetched}
                products={products}
                nextOffset={nextOffset}
                showOriginalPrice
                className='PresetsInnerWrapper-productList'
                onFetch={this.handleFetch}
                closeMatchingMessage='Our next best suggestion.'
              />
            )
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  // presets
  presets: props.presets || state.filters.presets,
  isPresetsFetched: props.show || state.filters.presetsFetched,
  activePresetName: props.match.params.presetName,
  // products
  filters: state.filters[props.activeCategory].data,
  products: state.products.list,
  totalCount: state.products.totalCount,
  isProductsFetched: state.products.fetched,
  nextOffset: state.products.nextOffset
})

export default connect(
  mapStateToProps,
  {
    fetchPresets,
    setFilter,
    likePreset,
    unlikePreset,
    syncFilter,
    fetchProducts,
    enableInitialFetch
  }
)(Presets)

const styles = {
  loader: {
    position: 'absolute',
    margin: 'auto',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 100,
    height: 30
  }
}
