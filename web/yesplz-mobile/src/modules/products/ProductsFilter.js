import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import memoize from 'lodash/memoize'

import { FILTER_OCCASIONS, FILTER_SALES, FILTER_PRICES, SIZES } from '@yesplz/core-web/config/constants'
import { setSecondaryFilter } from '@yesplz/core-redux/ducks/filters'
import history from '@yesplz/core-web/config/history'

import useProductsFilterState from '../filters/useProductsFilterState'
import ProductsFilterOverlay, { FilterLabel } from '../filters/ProductsFilterOverlay'
import FilterGroup from '../filters/FilterGroup'

const ProductsFilter = ({ isVisible, defaultColType, secondaryFilters, activeCategory, onSubmit, onClose }) => {
  const {
    colType,
    filters,
    changeColType,
    changeFilters,
    clearFilter
  } = useProductsFilterState(activeCategory, defaultColType)

  const filterSizes = getFilterSizes(activeCategory)

  useEffect(() => {
    changeFilters({
      ...secondaryFilters
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

      <FilterLabel label='Sizes'>
        <FilterGroup
          name='sizes'
          options={filterSizes}
          values={filters['sizes']}
          onChange={handleFilterChange}
        />
      </FilterLabel>
    </ProductsFilterOverlay>
  )
}

const getFilterSizes = memoize((category) => (
  [
    ...SIZES[category].ids.map(id => ({ name: id, label: id })),
    /**
     * @todo: let's keep "My Sizes" disabled for now until api finished
     */
    {
      name: 'mysizes',
      label: 'My Sizes',
      disabled: true,
      fallbackURL: `/profile/sizes/${category}/regular`
    }
  ]
))

ProductsFilter.propTypes = {
  isVisible: PropTypes.bool,
  secondaryFilters: PropTypes.shape({}),
  activeCategory: PropTypes.string,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  defaultColType: PropTypes.string
}

ProductsFilter.defaultProps = {
  defaultColType: 'single',
  isVisible: false,
  secondaryFilters: {},
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
    history.push(`/products/${props.activeCategory}/list?listingView=${productListConfig.colType}`)

    if (props.onSubmit) {
      props.onSubmit(productListConfig)
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductsFilter)
