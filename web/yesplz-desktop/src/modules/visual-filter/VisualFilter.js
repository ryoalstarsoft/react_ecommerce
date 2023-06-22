import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { FilterPanel } from '@yesplz/core-web/modules/filters'
import { fetchProducts } from '@yesplz/core-redux/ducks/products'
import { setFilter, syncFilter, syncFavoritePresets, saveFilterAsPreset, deleteFilterFromPreset, setLastBodyPart, setOnboarding } from '@yesplz/core-redux/ducks/filters'
import { CUSTOM_PRESET_NAME } from '@yesplz/core-web/config/constants'
import { isFilterSavedSelector } from '@yesplz/core-web/modules/filters/selectors'
import './visual-filter.css'

class VisualFilter extends Component {
  static propTypes = {
    filters: PropTypes.object,
    isFilterSaved: PropTypes.bool,
    lastBodyPart: PropTypes.string,
    router: PropTypes.object,
    title: PropTypes.string,
    activeCategory: PropTypes.string,
    setFilter: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    syncFilter: PropTypes.func.isRequired,
    syncFavoritePresets: PropTypes.func.isRequired,
    saveFilterAsPreset: PropTypes.func.isRequired,
    deleteFilterFromPreset: PropTypes.func.isRequired,
    setLastBodyPart: PropTypes.func.isRequired,
    setOnboarding: PropTypes.func.isRequired
  }

  componentDidMount () {
    const { syncFilter, syncFavoritePresets } = this.props
    syncFilter()
    syncFavoritePresets()
  }

  get handleFilterChange () {
    const { activeCategory, fetchProducts, setFilter } = this.props
    return (filters) => {
      // set filter to store
      setFilter(activeCategory, filters)
      // fetch products based selected filter
      fetchProducts(undefined, undefined, undefined, true)
      // set wrapper scrolltop to 0
      const scrollWrapper = document.getElementById('MainScroll')
      if (scrollWrapper) {
        scrollWrapper.scrollTop = 0
      }
    }
  }

  get isProductDetailPage () {
    const { router } = this.props
    return /^\/products\//.test(router.location.pathname)
  }

  get handleFilterLike () {
    const { activeCategory, saveFilterAsPreset, deleteFilterFromPreset } = this.props
    return (filters, favorite) => {
      const filtersWithCategory = {
        ...filters,
        category: activeCategory
      }

      if (favorite) {
        saveFilterAsPreset(filtersWithCategory, CUSTOM_PRESET_NAME)
      } else {
        deleteFilterFromPreset(filtersWithCategory, CUSTOM_PRESET_NAME)
      }
    }
  }

  get handleBodyPartChange () {
    const { setLastBodyPart } = this.props
    return (bodyPart) => {
      setLastBodyPart(bodyPart)
    }
  }

  get handleFinishOnboarding () {
    const { setOnboarding } = this.props
    return () => {
      setOnboarding(false)
    }
  }

  render () {
    const { activeCategory, filters, isFilterSaved, lastBodyPart, title } = this.props

    return (
      <div className='VisualFilter'>
        {title && <h2>{title}</h2>}
        <FilterPanel
          category={activeCategory}
          favorite={isFilterSaved}
          filters={filters}
          lastBodyPart={lastBodyPart}
          onFilterChange={this.handleFilterChange}
          onFilterLike={this.handleFilterLike}
          closable={Boolean(false)}
          onBodyPartChange={this.handleBodyPartChange}
          onFinishedOnboarding={this.handleFinishOnboarding}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const activeCategory = props.match.params.category || state.products.activeCategory

  return {
    activeCategory,
    filters: state.filters[activeCategory].data,
    isFilterSaved: isFilterSavedSelector(state, {
      category: state.products.activeCategory,
      customPresetName: CUSTOM_PRESET_NAME
    }),
    lastBodyPart: state.filters.lastBodyPart,
    router: state.router
  }
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    {
      fetchProducts,
      syncFilter,
      syncFavoritePresets,
      setFilter,
      saveFilterAsPreset,
      deleteFilterFromPreset,
      setLastBodyPart,
      setOnboarding
    }
  )
)(VisualFilter)
