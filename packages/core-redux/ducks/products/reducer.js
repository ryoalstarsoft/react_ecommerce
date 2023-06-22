import uniqBy from 'lodash/uniqBy'
import {
  CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS,
  PRODUCT_COUNT_PER_PAGE, PRD_CATEGORY
} from '@yesplz/core-web/config/constants'
import { LIKE_PRODUCT, UNLIKE_PRODUCT } from '../product'
import {
  SET_PRODUCTS, APPEND_PRODUCTS, ENABLE_INITIAL_FETCH, SET_RECOMMENDED_PRODUCTS, APPEND_RECOMMENDED_PRODUCTS,
  SET_ACTIVE_CATEGORY, SET_FAVORITE_PRODUCTS, SET_PRESETS, SET_PRESETS_ALL_CATEGORIES
} from './actions'
import { mapProductFavorites, updateProductFavorite } from '../helpers'

const defaultState = {
  [CATEGORY_TOPS]: {
    data: [],
    presets: [],
    nextOffset: 0,
    totalCount: 0,
    fetched: false,
    willBeEmptyList: false
  },
  [CATEGORY_SHOES]: {
    data: [],
    presets: [],
    nextOffset: 0,
    totalCount: 0,
    fetched: false,
    willBeEmptyList: false
  },
  [CATEGORY_PANTS]: {
    data: [],
    presets: [],
    nextOffset: 0,
    totalCount: 0,
    fetched: false,
    willBeEmptyList: false
  },
  presetsCategory: {
    [CATEGORY_TOPS]: [],
    [CATEGORY_SHOES]: [],
    [CATEGORY_PANTS]: []
  },
  favoriteList: [],
  recommended: {
    data: [],
    nextOffset: 0,
    totalCount: 0
  },
  activeCategory: PRD_CATEGORY
}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  const { type, payload = {} } = action
  const category = payload.category || state.activeCategory
  switch (type) {
    case SET_PRODUCTS:
      let updatedState = {}
      const list = mapProductFavorites(payload.favoriteProductIds, payload.products)

      // if list is updated with new set of data (filters change) and the date is empty,
      // don't update it directly, but instead, set `willBeEmptyList` flag to true.
      // we need this to warn user about empty result from current filters,
      // but still keeping the previous data set in the background.
      if (state.fetched && list.length === 0) {
        updatedState = {
          willBeEmptyList: true
        }
      } else {
        updatedState = {
          [category]: {
            data: list,
            presets: state[category].presets,
            willBeEmptyList: list.length === 0,
            fetched: true,
            totalCount: payload.totalCount,
            nextOffset: payload.countPerPage || PRODUCT_COUNT_PER_PAGE
          }
        }
      }

      return {
        ...state,
        ...updatedState
      }
    case APPEND_PRODUCTS:
      let newProductList = mapProductFavorites(payload.favoriteProductIds, payload.products)
      return {
        ...state,
        [category]: {
          ...state[category],
          data: uniqBy([...state[category].data, ...newProductList], 'product_id'),
          nextOffset: state[category].nextOffset + (payload.countPerPage || PRODUCT_COUNT_PER_PAGE)
        }
      }

    case SET_PRESETS:
      return {
        ...state,
        [category]: {
          ...state[category],
          presets: payload.presets
        }
      }

    case SET_PRESETS_ALL_CATEGORIES:
      return {
        ...state,
        presetsCategory: {
          ...state.presetsCategory,
          ...payload
        }
      }

    case LIKE_PRODUCT:
      return {
        ...state,
        [category]: {
          ...state[category],
          data: updateProductFavorite(payload.productId, true, state[category].data)
        },
        recommended: {
          ...state.recommended,
          data: updateProductFavorite(payload.productId, true, state.recommended.data)
        }
      }

    case UNLIKE_PRODUCT:
      return {
        ...state,
        [category]: {
          ...state[category],
          data: updateProductFavorite(payload.productId, false, state[category].data)
        },
        recommended: {
          ...state.recommended,
          data: updateProductFavorite(payload.productId, false, state.recommended.data)
        }
      }

    case ENABLE_INITIAL_FETCH:
      return {
        ...state,
        [category]: {
          ...state[category],
          fetched: false,
          nextOffset: 0
        }
      }

    case SET_FAVORITE_PRODUCTS:
      return { ...state, favoriteList: payload.favoriteProducts }

    case SET_RECOMMENDED_PRODUCTS:
      return {
        ...state,
        recommended: {
          ...state.recommended,
          data: mapProductFavorites(payload.favoriteProductIds, payload.products),
          nextOffset: (payload.countPerPage || PRODUCT_COUNT_PER_PAGE)
        }
      }

    case APPEND_RECOMMENDED_PRODUCTS:
      return {
        ...state,
        recommended: {
          ...state.recommended,
          data: [
            ...state.recommended.data,
            ...mapProductFavorites(payload.favoriteProductIds, payload.products)
          ],
          nextOffset: state.recommended.nextOffset + (payload.countPerPage || PRODUCT_COUNT_PER_PAGE)
        }
      }

    case SET_ACTIVE_CATEGORY:
      return {
        ...state,
        activeCategory: payload.activeCategory
      }
    default: return state
  }
}
