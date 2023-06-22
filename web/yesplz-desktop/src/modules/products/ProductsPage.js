import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

// libs
import PropTypes from 'prop-types'
import classnames from 'classnames'
import queryString from 'query-string'
import omit from 'lodash/omit'

// core web
import { SectionTitle } from '@yesplz/core-web/ui-kits/misc'
import { ProductList } from '@yesplz/core-web/modules/products'
import { ListView } from '@yesplz/core-web/modules/filters'

// core redux
import { fetchProducts, fetchPresets } from '@yesplz/core-redux/ducks/products'
import { fetchPresets as fetchPresetsEditorPicks } from '@yesplz/core-redux/ducks/filters'

// HOC
import withTrackingProvider from '@yesplz/core-web/hoc/withTrackingProvider'

// constants
import {
  // CATEGORIES_LABELS,
  // CATEGORY_PANTS,
  // CATEGORY_SHOES,
  CATEGORY_TOPS
} from '@yesplz/core-web/config/constants'

// utils
import { formatPresetName, parsePresetName } from '@yesplz/core-web/utils/index'

import './ProductsPage.scss'

class ProductsPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      defaultColType: true
    }
  }

  componentDidMount () {
    this.handleFetchProducts()
    this.handleFetchPresets()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.presets.length !== this.props.presets.length) {
      this.handleFetchProducts(this.props)
    }
  }

  handleFetchProducts = () => {
    const { fetchProducts } = this.props
    fetchProducts(this.currentCategory, this.customFilters, 100, true)
  }

  handleFetchPresets = () => {
    if (this.qsValues.preset) {
      const { fetchPresetsEditorPicks, fetchPresets } = this.props
      if (this.qsValues.page === 'editorspick') {
        fetchPresetsEditorPicks(this.currentCategory)
      } else {
        fetchPresets(this.currentCategory)
      }
    }
  }

  get qsValues () {
    const { location } = this.props
    const qsValues = queryString.parse(location.search)
    return qsValues
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

  get currentCategory () {
    const { match } = this.props
    return match.params.category || CATEGORY_TOPS
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

  get handleFetch () {
    const { products, totalCount, fetchProducts } = this.props
    return (next) => {
      if (products.length < totalCount) {
        fetchProducts(this.currentCategory, this.customFilters).then(() => {
          next()
        })
      } else {
        next()
      }
    }
  }

  onColTypeChange = data => {
    this.setState({
      defaultColType: data === 'single'
    })
  }

  render () {
    const {
      products, nextOffset
    } = this.props

    return (
      <div id='MainScroll' className='ProductsPage'>
        <div className='ProductFilters'>
          ProductFilters
        </div>
        <div className='Desktop-section'>
          <div className='container-wide'>
            <div className='ProductsPage-HeaderBar'>
              <SectionTitle
                title={this.productTitle}
                small
              />
              <div className='GridView'>
                <ListView colType={this.state.defaultColType ? 'single' : 'double'} onChange={this.onColTypeChange} />
              </div>
            </div>
          </div>
          <div className={classnames('ProductsPage-ProductList', {
            ColTypeDouble: !this.state.defaultColType
          })}>
            <ProductList
              className='ProductsPage-products'
              products={products}
              nextOffset={nextOffset}
              style={{ overflow: 'hidden' }}
              showOriginalPrice
              // showHighResImage
              show
              combined
              useButton
              onFetch={this.handleFetch}
            />
          </div>
        </div>
      </div>
    )
  }
}

ProductsPage.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  products: PropTypes.array.isRequired,
  presets: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  fetchPresets: PropTypes.func.isRequired,
  fetchPresetsEditorPicks: PropTypes.func.isRequired,
  totalCount: PropTypes.number,
  nextOffset: PropTypes.number

}
ProductsPage.defaultProps = {
}

const mapStateToProps = (state, props) => {
  const { location } = props
  const qsValues = queryString.parse(location.search)
  const activeCategory = props.match.params.category
  return {
    presets: qsValues.page === 'editorspick' ? state.filters.presets : state.products[activeCategory].presets,
    products: state.products[activeCategory].data,
    totalCount: state.products[activeCategory].totalCount,
    nextOffset: state.products[activeCategory].nextOffset
  }
}

export default compose(
  connect(mapStateToProps, {
    fetchProducts,
    fetchPresets,
    fetchPresetsEditorPicks
  }),
  withTrackingProvider('ProductsPage')
)(ProductsPage)
