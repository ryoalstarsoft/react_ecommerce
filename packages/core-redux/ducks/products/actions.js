import axios from 'axios'
import omit from 'lodash/omit'
import { PRODUCT_COUNT_PER_PAGE } from '@yesplz/core-web/config/constants'
import { Product, Preset, VisualFilter } from '@yesplz/core-models'
import { getProducts, getRecommendedProducts, getProductsPresets } from './api'

// Actions Types
export const SET_PRODUCTS = 'products/SET_PRODUCTS'
export const APPEND_PRODUCTS = 'products/APPEND_PRODUCTS'
export const ENABLE_INITIAL_FETCH = 'products/ENABLE_INITIAL_FETCH'
export const SET_FAVORITE_PRODUCTS = 'products/SET_FAVORITE_PRODUCTS'
export const SET_RECOMMENDED_PRODUCTS = 'products/SET_RECOMMENDED_PRODUCTS'
export const APPEND_RECOMMENDED_PRODUCTS = 'products/APPEND_RECOMMENDED_PRODUCTS'
export const SET_ACTIVE_CATEGORY = 'products/SET_ACTIVE_CATEGORY'
export const SET_PRESETS = 'products/SET_PRESETS'
export const SET_PRESETS_ALL_CATEGORIES = 'products/SET_PRESETS_ALL_CATEGORIES'

const formatPresetsCategoriesData = presets => {
  return presets.reduce((acc, cur) => ({
    ...acc,
    [cur.category]: [
      ...(acc[cur.category] ? acc[cur.category] : []),
      {
        ...cur
      }
    ]
  }), {})
}

// Actions creator
export function setProducts (category, products = [], totalCount = 0, favoriteProductIds = [], countPerPage) {
  return { type: SET_PRODUCTS, payload: { category, products, totalCount, favoriteProductIds, countPerPage } }
}

export function appendProducts (category, products = [], favoriteProductIds = [], countPerPage) {
  return { type: APPEND_PRODUCTS, payload: { category, products, favoriteProductIds, countPerPage } }
}

export function setPresets (category, presets = []) {
  return { type: SET_PRESETS, payload: { category, presets } }
}

export function setPresetsAllCategories (presets) {
  return { type: SET_PRESETS_ALL_CATEGORIES, payload: presets }
}

export function enableInitialFetch () {
  return { type: ENABLE_INITIAL_FETCH }
}

export function setRecommendedProducts (products = [], countPerPage, favoriteProductIds = []) {
  return { type: SET_RECOMMENDED_PRODUCTS, payload: { products, countPerPage, favoriteProductIds } }
}

export function appendRecommendedProducts (products = [], countPerPage, favoriteProductIds = []) {
  return { type: APPEND_RECOMMENDED_PRODUCTS, payload: { products, countPerPage, favoriteProductIds } }
}

export function setActiveCategory (activeCategory) {
  return { type: SET_ACTIVE_CATEGORY, payload: { activeCategory } }
}

// Side effects, only as applicable

/**
 * fetch product list
 * @param {string} category
 * @param {Object} customFilters
 * @param {string} limitPerPage
 * @param {boolean} initialFetch
 */
export function fetchProducts (
  category, customFilters, limitPerPage = PRODUCT_COUNT_PER_PAGE, initialFetch = false
) {
  return async (dispatch, getState) => {
    try {
      const { products, filters } = getState()
      const activeCategory = category || products.activeCategory
      const currentFilters = { ...(customFilters || filters[activeCategory].data), ...filters.secondary }

      // on initial fetch, set page should always start from 0
      const nextOffset = initialFetch ? 0 : products[activeCategory].nextOffset

      const response = await getProducts(activeCategory, {
        offset: nextOffset,
        limit_per_pid: 1,
        ...omit(currentFilters, 'offset', 'limit') // use page and count per page defined from the system
      }, limitPerPage)

      const favoriteProductIds = Product.getFavoriteProductIds()

      // if not initial fetch, append the product
      if (initialFetch) {
        dispatch(setProducts(activeCategory, response.products, response.total_cnt, favoriteProductIds, limitPerPage))
      } else {
        dispatch(appendProducts(activeCategory, response.products, favoriteProductIds, limitPerPage))
      }

      return response
    } catch (e) {
      console.error('Error!', e)
    }
  }
}

/**
 * calculate and get recommended products based on current filter, favorite presets and favorite products
 * @param {number} countPerPage number of products to be fetched
 * @param {string} category
 * @param {boolean} initialFetch
 */
export function fetchRecommendedProducts (countPerPage, category, initialFetch = false) {
  return async (dispatch, getState) => {
    try {
      const { products } = getState()

      const currentFilter = VisualFilter.getFilters()
      const favoritePresets = Preset.getFavoritePresets().map(preset => omit(preset, ['name', 'favorite']))
      const favoriteProductIds = Product.getFavoriteProductIds()

      const nextOffset = initialFetch ? 0 : products.recommended.nextOffset
      const data = {
        offset: nextOffset,
        limit: countPerPage,
        [category]: {
          favorites: favoriteProductIds,
          visualfilters: [currentFilter, ...favoritePresets]
        }
      }

      console.debug('initialFetch', initialFetch)
      const response = await getRecommendedProducts(data, category)

      if (initialFetch) {
        dispatch(setRecommendedProducts(response.products, countPerPage, favoriteProductIds))
      } else {
        dispatch(appendRecommendedProducts(response.products, countPerPage, favoriteProductIds))
      }

      return response.data
    } catch (e) {
      console.error('Error!', e)
    }
  }
}

/**
 * fetch presets by category
 * @param {string} category
 */
export function fetchPresets (category) {
  return async dispatch => {
    try {
      const data = await getProductsPresets(category)
      dispatch(setPresets(category, data))
    } catch (e) {
      console.error('Error!', e)
    }
  }
}

export function fetchAllPresets () {
  return async dispatch => {
    try {
      const data = await getProductsPresets()
      dispatch(setPresetsAllCategories(
        formatPresetsCategoriesData(data)
      ))
    } catch (e) {
      console.error('Error!', e)
    }
  }
}

/**
 * sync favorite products data from local storage to store
 * @param {boolean} syncRemote sync local data with latest backend data
 */
export function syncFavoriteProducts (syncRemote = false) {
  return async (dispatch, getState) => {
    const { products } = getState()
    let favoriteProducts = []
    if (syncRemote) {
      // get favorite product ids and sync the data from backend
      // const productIds = Product.getFavoriteProductIds()
      const productslist = products.favoriteList
      const favoriteProductsPromises = productslist.map(async (product) => {
        let finalProductId = product.product_id

        // check whether it contains xx_xxx_xxxx format
        // if not, add `ns_` prefix
        const isNewFormat = /^.+?(_).+?(_).+?$/.test(product.product_id)
        if (!isNewFormat) {
          finalProductId = `ns_${product.product_id}`
        }

        const response = await axios.get(`/categories/${product.category}/${finalProductId}`)
        return {
          ...response.data.products[0],
          favorite: true
        }
      })

      favoriteProducts = await Promise.all(favoriteProductsPromises)

      // update data to local storage
      Product.setFavoriteProducts(favoriteProducts)
    } else {
      favoriteProducts = Product.getFavoriteProducts()
    }

    // update store data
    dispatch({ type: SET_FAVORITE_PRODUCTS, payload: { favoriteProducts } })
  }
}
