import { createSelector } from 'reselect'
import filter from 'lodash/filter'

// getters
const getProducts = (state) => (state.products.list)
const getPresets = (state) => (state.filters.presets)

// products
const getFavoriteProducts = (products) => (
  filter(products, 'favorite')
)
export const favoriteProductsSelector = createSelector(getProducts, getFavoriteProducts)

// presets
const getFavoritePresets = (products) => (
  filter(products, 'favorite')
)
export const favoritePresetsSelector = createSelector(getPresets, getFavoritePresets)
