import axios from 'axios'
import { CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS, FILTERS } from '@yesplz/core-web/config/constants'
import { Preset, VisualFilter } from '@yesplz/core-models'
import { getCatCfg } from '@yesplz/core-models/lib/VFCatCfg'
import { updatePresetFavorite, mapPresetFavorites } from './helpers'
import reduce from 'lodash/reduce'

const { localStorage } = window
const isDev = process.env.NODE_ENV === 'development'

// Actions
const SET_FILTER = 'filters/SET_FILTER'
const SYNC_FILTER = 'filters/SYNC_FILTER'
const SET_SECONDARY_FILTER = 'filters/SET_SECONDARY_FILTER'
const SET_PRESETS = 'filters/SET_PRESETS'
const SET_FAVORITE_PRESETS = 'filters/SET_FAVORITE_PRESETS'
export const LIKE_PRESET = 'filters/LIKE_PRESET'
export const UNLIKE_PRESET = 'filters/UNLIKE_PRESET'
const SET_LAST_BODY_PART = 'filters/SET_LAST_BODY_PART'
const TOOGLE_VISUAL_FILTER = 'filters/TOOGLE_VISUAL_FILTER'
const SET_ONBOARDING = 'filters/SET_ONBOARDING'

const defaultState = {
  // visual filters
  [CATEGORY_TOPS]: {
    data: {
      ...getCatCfg(CATEGORY_TOPS).propDefaultVal,
      sale: 0,
      color: ''
    }
  },
  [CATEGORY_SHOES]: {
    data: {
      ...getCatCfg(CATEGORY_SHOES).propDefaultVal,
      sale: 0,
      color: ''
    }
  },
  [CATEGORY_PANTS]: {
    data: {
      ...getCatCfg(CATEGORY_PANTS).propDefaultVal,
      sale: 0,
      color: ''
    }
  },
  // secondary filters such as ocasions, prices, sales, etc
  secondary: {},
  // stuff filters such as ...
  stuff: {
  },
  lastBodyPart: VisualFilter.getLastBodyPart(),
  presets: [],
  favoritePresets: [],
  presetsFetched: false,
  expanded: false,
  onboarding: VisualFilter.shouldShowOnboarding()
}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_FILTER:
      if (!payload.filters) {
        return state
      }
      return { ...state, [payload.category]: { data: payload.filters } }
    case SYNC_FILTER:
      if (!payload.filters) {
        return state
      }
      return {
        ...state,
        ...reduce(payload.filters, (acc, filters, category) => ({
          ...acc,
          [category]: {
            data: filters
          }
        }), {})
      }
    case SET_SECONDARY_FILTER:
      return { ...state, secondary: payload.filters }
    case SET_PRESETS:
      return {
        ...state,
        presets: mapPresetFavorites(payload.favoritePresetNames, payload.presets),
        presetsFetched: true
      }
    case SET_LAST_BODY_PART:
      return {
        ...state,
        lastBodyPart: payload.lastBodyPart
      }
    case LIKE_PRESET:
      return {
        ...state,
        presets: updatePresetFavorite(payload.presetName, true, state.presets)
      }
    case UNLIKE_PRESET:
      return {
        ...state,
        presets: updatePresetFavorite(payload.presetName, false, state.presets)
      }
    case SET_FAVORITE_PRESETS:
      return {
        ...state,
        favoritePresets: payload.favoritePresets
      }
    case TOOGLE_VISUAL_FILTER:
      return {
        ...state,
        expanded: payload.expanded
      }
    case SET_ONBOARDING:
      return {
        ...state,
        onboarding: payload.onboarding
      }
    default: return state
  }
}

// Actions creator
export function setFilter (category, filters) {
  const prevSavedFilters = JSON.parse(localStorage.getItem(FILTERS))
  // save to local storage
  localStorage.setItem(FILTERS, JSON.stringify({
    ...prevSavedFilters,
    [category]: filters
  }))

  return { type: SET_FILTER, payload: { category, filters } }
}

export function setSecondaryFilter (filters) {
  return { type: SET_SECONDARY_FILTER, payload: { filters } }
}

export function setPresets (presets, favoritePresetNames) {
  return { type: SET_PRESETS, payload: { presets, favoritePresetNames } }
}

export function setLastBodyPart (lastBodyPart) {
  // set to localStorage
  VisualFilter.saveLastBodyPart(lastBodyPart)
  return { type: SET_LAST_BODY_PART, payload: { lastBodyPart } }
}

/**
 * sync filters data from local storage to store
 */
export function syncFilter () {
  const filters = JSON.parse(localStorage.getItem(FILTERS))
  return { type: SYNC_FILTER, payload: { filters } }
}

/**
 * sync favorite presets data from local storage to store
 */
export function syncFavoritePresets () {
  const favoritePresets = Preset.getFavoritePresets()
  return { type: SET_FAVORITE_PRESETS, payload: { favoritePresets } }
}

export function toggleVisualFilter (expanded = true) {
  return { type: TOOGLE_VISUAL_FILTER, payload: { expanded } }
}

export function setOnboarding (onboarding = true) {
  return { type: SET_ONBOARDING, payload: { onboarding } }
}

/**
 * get list of presets available
 */
export function fetchPresets (category, filters) {
  return async dispatch => {
    try {
      let url = '/allcategories/editorspicks'

      if (category) {
        url = `/categories/${category}/editorspicks`
      }

      const response = await axios.get(url, {
        params: {
          ...filters || {}
        }
      })

      const favoritePresetNames = Preset.getFavoritePresetNames()
      dispatch(setPresets(response.data, favoritePresetNames))

      return response
    } catch (e) {
      console.log('Error!', e)
    }
  }
}

export function likePreset (preset, tracker = {}) {
  return (dispatch) => {
    Preset.like(preset)
    // sync presets from local storage, temporary solutions before api ready
    dispatch(syncFavoritePresets())

    dispatch({
      type: LIKE_PRESET,
      payload: { presetName: preset.name },
      meta: {
        mixpanel: {
          event: 'Like Preset',
          props: {
            ...tracker.defaultProperties,
            name: preset.name
          }
        }
      }
    })
  }
}

export function unlikePreset (preset, tracker = {}) {
  return (dispatch) => {
    Preset.unlike(preset)

    // sync presets from local storage, temporary solutions before api ready
    dispatch(syncFavoritePresets())

    dispatch({
      type: UNLIKE_PRESET,
      payload: { presetName: preset.name },
      meta: {
        mixpanel: {
          event: 'Unlike Preset',
          props: {
            ...tracker.defaultProperties,
            name: preset.name
          }
        }
      }
    })
  }
}

export function saveFilterAsPreset (preset, name) {
  return dispatch => {
    Preset.savePreset(preset, name)
    // sync presets from local storage, temporary solutions before api ready
    dispatch(syncFavoritePresets())

    dispatch({
      type: LIKE_PRESET,
      payload: { presetName: preset.name },
      meta: {
        mixpanel: {
          event: 'Like Preset',
          props: {
            dev: isDev,
            name: 'Custom Preset',
            preset: preset
          }
        }
      }
    })
  }
}

export function deleteFilterFromPreset (preset, name) {
  return dispatch => {
    Preset.removePreset(preset, name)
    // sync presets from local storage, temporary solutions before api ready
    dispatch(syncFavoritePresets())

    dispatch({
      type: UNLIKE_PRESET,
      payload: { presetName: name },
      meta: {
        mixpanel: {
          event: 'Unlike Preset',
          props: {
            dev: isDev,
            name: name
          }
        }
      }
    })
  }
}
