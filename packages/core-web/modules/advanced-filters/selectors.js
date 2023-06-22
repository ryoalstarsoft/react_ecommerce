import filter from 'lodash/filter'
import camelCase from 'lodash/camelCase'
import createDeepEqualSelector from '@yesplz/core-web/utils/createDeepEqualSelector'

const getPresets = (state, props) => state.products[props.category || 'wtop'].presets
const getCustomPresets = state => state.filters.favoritePresets
const getCategoryFromProps = (_, props) => props.category

export const presetsSelector = createDeepEqualSelector(
  [getCustomPresets, getPresets, getCategoryFromProps],
  (customPresets, presets, category) => {
    return [
      ...filter(customPresets, { category: category }),
      ...presets.map(preset => ({
        ...preset,
        key: camelCase(preset.name),
        builtIn: true
      }))
    ]
  }
)
