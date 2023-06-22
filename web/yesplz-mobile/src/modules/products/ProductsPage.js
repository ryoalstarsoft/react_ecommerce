import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import omit from 'lodash/omit'

// Redux
import { fetchPresets } from '@yesplz/core-redux/ducks/products'

import classNames from 'classnames'
import queryString from 'query-string'
import includes from 'lodash/includes'
import findKey from 'lodash/findKey'

import history from '@yesplz/core-web/config/history'
import { CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS, CATEGORIES_LABELS } from '@yesplz/core-web/config/constants'
import { withTrackingProvider } from '@yesplz/core-web/hoc'
import MobilePicker from '@yesplz/core-web/ui-kits/selects/MobilePicker'
import { PageTitle } from '@yesplz/core-web/ui-kits/misc'

import { Products, ProductsFilter } from './index'
import ProductsVisualFilter from '../filters/ProductsVisualFilter'
import { NotFound } from '../base'
import { formatPresetName, parsePresetName } from '@yesplz/core-web/utils/index'
import { setFilter } from '@yesplz/core-redux/ducks/filters'
import './ProductsPage.scss'

const ProductsTitle = ({ title }) => (
  <div className='ProductsTitle'>
    <h3>{title}</h3>
  </div>
)
ProductsTitle.propTypes = {
  title: PropTypes.string.isRequired
}

class ProductsPage extends PureComponent {
  static propTypes = {
    match: PropTypes.object,
    location: PropTypes.object,
    presets: PropTypes.array,
    fetchPresets: PropTypes.func.isRequired,
    expanded: PropTypes.bool,
    setFilter: PropTypes.func.isRequired,
    favoritePresets: PropTypes.array
  }

  static defaultProps = {
    presets: []
  }

  constructor (props) {
    super(props)
    this.state = {
      categorySwitchOpened: false,
      valueGroups: {
        category: CATEGORIES_LABELS[props.match.params.category || CATEGORY_TOPS]
      },
      isFilterVisible: false,
      useTwoColumnsView: false
    }
    this.handleTitleClick = this.handleTitleClick.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handleCategoryPick = this.handleCategoryPick.bind(this)
    this.handleClosePicker = this.handleClosePicker.bind(this)
    this.handleFilterButtonClick = this.handleFilterButtonClick.bind(this)
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this)
    this.handleCloseFilter = this.handleCloseFilter.bind(this)
  }

  get qsValues () {
    const { location } = this.props
    const qsValues = queryString.parse(location.search)
    return qsValues
  }

  get currentCategory () {
    const { match } = this.props
    return match.params.category || CATEGORY_TOPS
  }

  get optionGroups () {
    if (this.qsValues.preset) {
      return {
        preset: this.props.presets.map(preset => preset.name)
      }
    }
    return {
      category: [
        'Tops',
        'Pants',
        'Shoes'
      ]
    }
  }

  get listingView () {
    const { location } = this.props
    const qsValues = queryString.parse(location.search)

    return qsValues.listingView
  }

  get productTitle () {
    const { location } = this.props
    const qsValues = queryString.parse(location.search)
    if (!qsValues.page) return null
    switch (qsValues.page) {
      case 'new': {
        return 'ALL NEW ARRIVALS'
      }

      case 'editorspick': {
        return `ALL ${parsePresetName(qsValues.preset)}`
      }

      default: return null
    }
  }

  get lastTitle () {
    const { location } = this.props
    const qsValues = queryString.parse(location.search)
    if (!qsValues.page) return null
    switch (qsValues.page) {
      case 'new': {
        return 'NEW ARRIVALS'
      }

      case 'editorspick': {
        return `${parsePresetName(qsValues.preset)}`
      }

      default: return null
    }
  }

  get customFilters () {
    const { location, presets } = this.props
    const qsValues = queryString.parse(location.search)
    let options = {
      new: qsValues.page === 'new' ? 1 : 0,
      preset: qsValues.preset ? qsValues.preset : null

    }
    if (qsValues.preset) {
      let presetExtra = presets.find(preset => formatPresetName(preset.name) === qsValues.preset)
      options = {
        ...options,
        ...(presetExtra ? omit(presetExtra, ['name', 'category']) : {})
      }
    }
    return options
  }

  componentDidMount () {
    this.setState({
      useTwoColumnsView: this.listingView === 'double'
    })
    if (this.props.match.params.presetKey) {
      this.setPresetFavoriteFilter(this.props.favoritePresets)
    } else {
      if (this.qsValues.preset) {
        this.props.fetchPresets(this.currentCategory)
      }
    }
  }

  setPresetFavoriteFilter = (favoritePresets = []) => {
    if (favoritePresets.length > 0) {
      const fp = favoritePresets.filter(fp => fp.key === this.props.match.params.presetKey)
      if (fp.length > 0) {
        this.props.setFilter(this.currentCategory, omit({...fp[0]}, ['key', 'name', 'favorite']))
        this.props.fetchPresets(this.currentCategory)
      }
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.location !== this.props.location) {
      console.log('update')
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({
        useTwoColumnsView: this.listingView === 'double'
      })
    }
    if (nextProps.favoritePresets.length !== this.props.favoritePresets.length) {
      if (this.props.match.params.presetKey) {
        this.setPresetFavoriteFilter(nextProps.favoritePresets)
      }
    }
  }

  // Update the value in response to user picking event
  handleCategoryChange (name, value) {
    this.setState(({ valueGroups }) => ({
      valueGroups: {
        ...valueGroups,
        [name]: value
      }
    }))
  }

  handleTitleClick () {
    const { categorySwitchOpened } = this.state
    this.setState({
      categorySwitchOpened: !categorySwitchOpened
    })
  }

  handleCategoryPick () {
    // const { search } = this.props.location
    const { valueGroups } = this.state
    const categoryKey = findKey(CATEGORIES_LABELS, label => label === valueGroups.category)
    history.push(`/products/${categoryKey}`)
    // if (this.qsValues.preset) {
    //   const qsValues = { ...this.qsValues }
    //   qsValues.preset = formatPresetName(valueGroups.preset)
    //   history.push(`/products/${categoryKey}/list?${queryString.stringify(qsValues)}`)
    // } else {
    //   history.push(`/products/${categoryKey}/list${search || ''}`)
    // }
    this.handleClosePicker()
  }

  handleClosePicker () {
    this.setState({
      categorySwitchOpened: false
    })
  }

  handleFilterButtonClick () {
    this.setState({
      isFilterVisible: true
    })
  }

  handleSubmitFilter (productListConfig) {
    this.setState({
      useTwoColumnsView: productListConfig.colType === 'double'
    })
    this.handleCloseFilter()
  }

  onColTypeChange = (col) => {
    this.setState({
      useTwoColumnsView: col === 'double'
    })
  }

  handleCloseFilter () {
    this.setState({
      isFilterVisible: false
    })
  }

  render () {
    const { valueGroups, categorySwitchOpened, isFilterVisible, useTwoColumnsView } = this.state

    if (!includes([CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS], this.currentCategory)) {
      return <NotFound />
    }

    return (
      <div
        id='MainScroll'
        key={this.currentCategory}
        className='ProductsPage'
        // style={{ overflow: 'hidden' }}
      >
        <div className='container'>
          {
            !this.props.expanded && (
              !this.lastTitle ? (
                <PageTitle
                  className={classNames('ProductsPage-title', { 'is-opened': categorySwitchOpened })}
                  showSwitch
                  onFilterClick={this.handleFilterButtonClick}
                  onTitleClick={this.handleTitleClick}
                >
                  {this.props.match.params.presetKey ? this.props.match.params.presetKey : this.qsValues.preset ? parsePresetName(this.qsValues.preset) : CATEGORIES_LABELS[this.currentCategory]}
                </PageTitle>
              ) : (
                <PageTitle
                  className={classNames('ProductsPage-title', { 'is-opened': categorySwitchOpened })}
                  showSwitch
                  onFilterClick={this.handleFilterButtonClick}
                  isLastTitle={this.lastTitle !== null}
                >
                  {this.lastTitle}
                </PageTitle>
              )
            )
          }

          {/* {
            this.productTitle &&
            <ProductsTitle title={this.productTitle.toUpperCase()} />
          } */}
          <Products
            customFilters={this.customFilters}
            category={this.currentCategory}
            limitPerPage={20}
            useTwoColumnsView={useTwoColumnsView}
            location={this.props.location}
          />
        </div>
        <MobilePicker
          isVisible={categorySwitchOpened}
          optionGroups={this.optionGroups}
          valueGroups={valueGroups}
          onChange={this.handleCategoryChange}
          onPick={this.handleCategoryPick}
          onClose={this.handleClosePicker}
        />
        <ProductsFilter
          defaultColType={this.listingView}
          activeCategory={this.currentCategory}
          isVisible={isFilterVisible}
          onSubmit={this.handleSubmitFilter}
          onClose={this.handleCloseFilter}
        />
        <ProductsVisualFilter onColTypeChange={this.onColTypeChange} defaultColType={this.listingView} hidden={isFilterVisible} activeCategory={this.currentCategory} />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  presets: state.products[props.match.params.category].presets,
  expanded: state.filters.expanded,
  favoritePresets: state.filters.favoritePresets
})

export default compose(
  connect(mapStateToProps, { fetchPresets, setFilter }),
  withTrackingProvider()
)(ProductsPage)
