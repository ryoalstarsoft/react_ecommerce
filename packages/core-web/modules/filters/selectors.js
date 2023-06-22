import { createSelector } from 'reselect'
import filter from 'lodash/filter'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'

const getFavoritePresets = state => state.filters.favoritePresets
const getFilters = (state, props) => state.filters[props.category].data
const getCustomPresetName = (_, props) => props.customPresetName

/**
 * get custom presets list
 */
export const customPresetsSelector = createSelector(
  [getFavoritePresets, getCustomPresetName],
  (favoritePresets, customPresetName) => (
    filter(favoritePresets, { name: customPresetName })
  )
)

/**
 * check whether current filter is saved (favorite)
 * saved filter will be stored as favorite preset
 */
export const isFilterSavedSelector = createSelector(
  [getFilters, customPresetsSelector],
  (filters, customPresets) => {
    if (isEmpty(customPresets)) {
      return null
    }
    // find custom preset by filter settings
    const customPreset = find(omit(customPresets, ['name', 'favorite', 'key']), { ...omit(filters, ['favorite', 'key']) })

    return !isEmpty(customPreset)
  }
)
