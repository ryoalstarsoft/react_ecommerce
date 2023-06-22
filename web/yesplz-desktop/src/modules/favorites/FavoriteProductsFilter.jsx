import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { FILTER_OCCASIONS, FILTER_TYPES, FILTER_SALES, FILTER_PRICES } from '@yesplz/core-web/config/constants'
import { setSecondaryFilter } from '@yesplz/core-redux/ducks/filters'
import history from '@yesplz/core-web/config/history'
import FilterGroup from '@yesplz/core-web/modules/filters/FilterGroup'
import FilterLabel from '@yesplz/core-web/modules/filters/FilterLabel'

const FavoriteProductsFilter = ({ secondaryFilters, activeCategory, onSubmit, customField }) => {
  const {
    filters,
    changeFilters,
    clearFilter
  } = useProductsFilterState(activeCategory)

  useEffect(() => {
    onSubmit(filters)
  }, [filters])

  const handleFilterChange = async (name, values) => {
    await changeFilters({
      ...filters,
      [name]: values
    })
  }

  //   const handleSubmit = () => {
  //     onSubmit({
  //       filters
  //     })
  //   }

  return (
    <div>
      {
        (customField.length < 1 || customField.indexOf('occasions') > -1) && (
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
        )
      }

      {
        (customField.length < 1 || customField.indexOf('types') > -1) && (
          <FilterLabel label='Types'>
            <FilterGroup
              name='types'
              options={FILTER_TYPES}
              values={filters['types']}
              type='radio'
              onChange={handleFilterChange}
            />
          </FilterLabel>
        )
      }

      {
        (customField.length < 1 || customField.indexOf('sale') > -1) && (
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
        )
      }

      {
        (customField.length < 1 || customField.indexOf('price') > -1) && (
          <FilterLabel label='Prices'>
            <FilterGroup
              name='price'
              options={FILTER_PRICES}
              values={filters['price']}
              onChange={handleFilterChange}
            />
          </FilterLabel>
        )
      }
    </div>
  )
}

FavoriteProductsFilter.propTypes = {
  secondaryFilters: PropTypes.shape({}),
  activeCategory: PropTypes.string,
  onSubmit: PropTypes.func,
  customField: PropTypes.array
}

FavoriteProductsFilter.defaultProps = {
  defaultColType: 'single',
  isVisible: false,
  customField: [],
  secondaryFilters: {},
  redirectPreset: null,
  onSubmit: (productListConfig) => { console.debug('Unhandled `onSubmit` prop in `ProductsFilter`', productListConfig) },
  onClose: () => { console.debug('Unhandled `onClose` prop in `ProductsFilter`') }
}

const mapStateToProps = (state) => ({
  secondaryFilters: state.filters.secondary
})

const mapDispatchToProps = (dispatch, props) => ({
  onSubmit(productListConfig) {
    // set secondary filters
    dispatch(setSecondaryFilter(productListConfig.filters))
    if (props.onSubmit) {
      props.onSubmit(productListConfig)
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteProductsFilter)

/**
 * state for products filter
 * @param {string} category
 * @param {string} defaultColType
 * @param {Object} defaultFilters
 */
export function useProductsFilterState(category, defaultFilters = {}) {
  const [filters, changeFilters] = useState(defaultFilters)

  const clearFilter = () => {
    changeFilters({
      types: [category]
    })
  }

  return {
    filters,
    changeFilters,
    clearFilter
  }
}
