import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import times from 'lodash/times'
import includes from 'lodash/includes'

import VisualFilterBagde from '../../ui-kits/visual-filters/VisualFilterBagde'
import { ThumbnailPicker, ThumbnailPickerOption } from '../../ui-kits/selects'
import { CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS } from '../../config/constants'

const StylesSelectItem = ({ name, value, bodyPartKey, category, config, onChange }) => {
  const [ bodyPartValue, changeBodyPartValue ] = useState()
  const max = config.propMaxVal[bodyPartKey]

  useEffect(() => {
    changeBodyPartValue(value[bodyPartKey])
  }, [value[bodyPartKey]])

  const handleChange = (_, itemValue) => {
    changeBodyPartValue(itemValue)

    onChange(name, {
      ...value,
      [bodyPartKey]: itemValue
    })
  }

  return (
    <ThumbnailPicker name={name} value={bodyPartValue} onChange={handleChange}>
      <ThumbnailPickerOption
        key={`vf-${bodyPartKey}-${0}`}
        label='None'
        value={0}>
        <VisualFilterBagde
          id={`vf-${bodyPartKey}-${0}`}
          category={category}
          defaultBodyPart={bodyPartKey}
          filter={{
            ...getDefaultFilters(category, bodyPartKey),
            [bodyPartKey]: 0
          }}
        />
      </ThumbnailPickerOption>
      {times(max, index => {
        const itemValue = index + 1
        return (
          <ThumbnailPickerOption
            key={`vf-${bodyPartKey}-${itemValue}`}
            label={`${bodyPartKey}${itemValue}`}
            value={itemValue}>
            <VisualFilterBagde
              id={`vf-${bodyPartKey}-${itemValue}`}
              category={category}
              filter={{
                ...getDefaultFilters(category, bodyPartKey, itemValue),
                [bodyPartKey]: itemValue
              }}
              defaultBodyPart={bodyPartKey}
            />
          </ThumbnailPickerOption>
        )
      })}
    </ThumbnailPicker>
  )
}

StylesSelectItem.propTypes = {
  name: PropTypes.string,
  value: PropTypes.object,
  bodyPartKey: PropTypes.string,
  category: PropTypes.string,
  config: PropTypes.object,
  onChange: PropTypes.func
}

const getDefaultFilters = (category, bodyPart, bodyPartValue) => {
  switch (category) {
    case CATEGORY_TOPS:
      return {
        coretype: bodyPart === 'top_length' ? 3 : 0,
        neckline: 0,
        shoulder: 0,
        sleeve_length: 0,
        top_length: 0
      }
    case CATEGORY_SHOES:
      return {
        toes: 0,
        covers: 0,
        counters: 0,
        bottoms: 0,
        shafts: 0
      }
    case CATEGORY_PANTS:
      return {
        rise: 0,
        thigh: includes(['knee', 'ankle'], bodyPart) ? 1 : 0,
        knee: bodyPart === 'ankle' ? (
          bodyPartValue === 0 || bodyPartValue === 3 ? 2 : 1
        ) : 0,
        ankle: 0
      }
    default:
      return {}
  }
}

export default StylesSelectItem
