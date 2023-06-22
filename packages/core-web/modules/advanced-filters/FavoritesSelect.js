import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import find from 'lodash/find'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import isEqual from 'lodash/isEqual'

import VisualFilterBagde from '../../ui-kits/visual-filters/VisualFilterBagde'
import { ThumbnailPicker, ThumbnailPickerOption } from '../../ui-kits/selects'
import { presetsSelector } from './selectors'

const omittedKeys = ['category', 'key', 'name', 'favorite']

const FavoritesSelect = ({ name, value, category, presets, onChange }) => {
  // chosen filter key
  const [ filterKey, changeFilterKey ] = useState()

  useEffect(() => {
    // define initial state when initial render, when it exist
    const defaultFilters = find(presets, filters => {
      const omittedFilters = omit(filters, omittedKeys)
      const filterKeys = Object.keys(omittedFilters)

      // get the same field existed, and compare
      return isEqual(omittedFilters, pick(value, filterKeys))
    })

    // when default filters value found, use the name as filterKey
    if (defaultFilters) {
      changeFilterKey(defaultFilters.key)
    } else {
      changeFilterKey()
    }
  }, [JSON.stringify(value)])

  const handleChange = (_, itemValue) => {
    // update filterKey
    changeFilterKey(itemValue)

    // update value
    const selectedFilters = omit(find(presets, { key: itemValue }), omittedKeys)
    onChange(name, selectedFilters)
  }

  return (
    <ThumbnailPicker name={name} value={filterKey} onChange={handleChange}>
      {
        presets.map((preset, index) => (
          <ThumbnailPickerOption
            key={preset.key}
            label={preset.builtIn ? preset.name : `${preset.name} ${index + 1}`}
            value={preset.key}>
            <VisualFilterBagde
              id={`vf-${preset.key}`}
              category={category}
              filter={omit(preset, omittedKeys)}
            />
          </ThumbnailPickerOption>
        ))
      }
    </ThumbnailPicker>
  )
}

FavoritesSelect.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object,
  category: PropTypes.string.isRequired,
  presets: PropTypes.array.isRequired,
  onChange: PropTypes.func
}

FavoritesSelect.defaultProps = {
  onChange: (name, value) => {}
}

const mapStateToProps = (state, props) => ({
  presets: presetsSelector(state, props)
})

export default connect(mapStateToProps)(FavoritesSelect)
