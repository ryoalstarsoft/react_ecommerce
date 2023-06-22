import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { FILTER_OCCASIONS, FILTER_TYPES, FILTER_SALES, FILTER_PRICES } from '@yesplz/core-web/config/constants'
import { setSecondaryFilter } from '@yesplz/core-redux/ducks/filters'
import history from '@yesplz/core-web/config/history'

import useProductsFilterState from '../filters/useProductsFilterState'
import ProductsFilterOverlay, { FilterLabel } from '../filters/ProductsFilterOverlay'
import FilterGroup from '@yesplz/core-web/modules/filters/FilterGroup'

const FavoriteProductsFilter = ({ isVisible, defaultColType, secondaryFilters, activeCategory, onSubmit, onClose }) => {
  const {
    colType,
    filters,
    changeColType,
    changeFilters,
    clearFilter
  } = useProductsFilterState(activeCategory, defaultColType)

  useEffect(() => {
    changeFilters({
      ...secondaryFilters,
      types: [activeCategory]
    })
  }, [secondaryFilters])

  const handleFilterChange = (name, values) => {
    changeFilters({
      ...filters,
      [name]: values
    })
  }

  const handleSubmit = () => {
    onSubmit({
      colType,
      filters
    })
  }

  return (
    <ProductsFilterOverlay
      title='Filters'
      isVisible={isVisible}
      colType={colType}
      onColTypeChange={changeColType}
      onClearFilter={clearFilter}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <FilterLabel label='Occasions'>
        <FilterGroup
          name='occasions'
          options={[
            {
              name: 'all',
              label: 'All Occasions'
            },
            ...FILTER_OCCASIONS
          ]}
          values={filters['occasions']}
          onChange={handleFilterChange}
        />
      </FilterLabel>

      <FilterLabel label='Types'>
        <FilterGroup
          name='types'
          options={FILTER_TYPES}
          values={filters['types']}
          type='radio'
          onChange={handleFilterChange}
        />
      </FilterLabel>

      <FilterLabel label='Sales'>
        <FilterGroup
          name='sale'
          options={[
            {
              name: 'all',
              label: 'All Sales'
            },
            ...FILTER_SALES
          ]}
          values={filters['sale']}
          onChange={handleFilterChange}
        />
      </FilterLabel>

      <FilterLabel label='Prices'>
        <FilterGroup
          name='price'
          options={FILTER_PRICES}
          values={filters['price']}
          onChange={handleFilterChange}
        />
      </FilterLabel>
    </ProductsFilterOverlay>
  )
}

FavoriteProductsFilter.propTypes = {
  isVisible: PropTypes.bool,
  secondaryFilters: PropTypes.shape({}),
  activeCategory: PropTypes.string,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  defaultColType: PropTypes.string
}

FavoriteProductsFilter.defaultProps = {
  defaultColType: 'single',
  isVisible: false,
  secondaryFilters: {},
  redirectPreset: null,
  onSubmit: (productListConfig) => { console.debug('Unhandled `onSubmit` prop in `ProductsFilter`', productListConfig) },
  onClose: () => { console.debug('Unhandled `onClose` prop in `ProductsFilter`') }
}

const mapStateToProps = (state) => ({
  secondaryFilters: state.filters.secondary
})

const mapDispatchToProps = (dispatch, props) => ({
  onSubmit (productListConfig) {
    // set secondary filters
    dispatch(setSecondaryFilter(productListConfig.filters))

    // redirect to chosen category
    history.push(`/favorites/items?listingView=${productListConfig.colType}`)

    if (props.onSubmit) {
      props.onSubmit(productListConfig)
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteProductsFilter)
