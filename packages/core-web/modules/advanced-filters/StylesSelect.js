import React from 'react'
import PropTypes from 'prop-types'
import includes from 'lodash/includes'
import map from 'lodash/map'

import FilterGroupSlider, { SliderItem } from './FilterGroupSlider'
import StylesSelectItem from './StylesSelectItem'

const StylesSelect = ({ name, value, category, lastBodyPart, config, onChange, onBodyPartChange }) => {
  const currentBodyPart = includes(config.partList, lastBodyPart) ? lastBodyPart : config.partList[0]

  return (
    <FilterGroupSlider itemKeys={config.partList} activeKey={currentBodyPart} onChange={onBodyPartChange}>
      {
        map(config.partList, (bodyPartKey) => (
          <SliderItem key={bodyPartKey} eventKey={bodyPartKey}>
            <StylesSelectItem
              key={bodyPartKey}
              name={name}
              value={value}
              bodyPartKey={bodyPartKey}
              category={category}
              config={config}
              onChange={onChange}
            />
          </SliderItem>
        ))
      }
    </FilterGroupSlider>
  )
}

StylesSelect.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
  lastBodyPart: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onBodyPartChange: PropTypes.func
}

StylesSelect.defaultProps = {
  onChange: (name, value) => {},
  onBodyPartChange: (bodyPartKey) => {}
}

export default StylesSelect
