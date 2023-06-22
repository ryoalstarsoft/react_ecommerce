import { useState } from 'react'

/**
 * state for products filter
 * @param {string} category
 * @param {string} defaultColType
 * @param {Object} defaultFilters
 */
export default function useProductsFilterState (category, defaultColType, defaultFilters = {}) {
  const [colType, changeColType] = useState(defaultColType)
  const [filters, changeFilters] = useState(defaultFilters)

  const clearFilter = () => {
    changeFilters({
      types: [category]
    })
  }

  return {
    colType,
    filters,

    changeColType,
    changeFilters,
    clearFilter
  }
}
