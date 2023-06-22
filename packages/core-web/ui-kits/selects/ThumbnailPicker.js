import React from 'react'
import PropTypes from 'prop-types'
import isNil from 'lodash/isNil'
import includes from 'lodash/includes'
import without from 'lodash/without'
import './ThumbnailPicker.scss'

const ThumbnailPicker = ({ children, name, value, values, canUnselect, style, selectedStyle, onChange }) => {
  const isMulti = !isNil(values)

  const managedChildren = React.Children.map(children, child => {
    if (isNil(child)) {
      return null
    }

    return React.cloneElement(child, {
      isActive: isMulti ? includes(values, child.props.value) : value === child.props.value,
      onClick: optionValue => {
        if (isMulti) {
          const isIncluded = includes(values, optionValue)
          let nextValues = []

          if (isIncluded) {
            nextValues = without(values, optionValue)
          } else {
            nextValues = [...without(values, child.props.selectThenRemove), optionValue]
          }

          onChange(name, nextValues)
        } else {
          onChange(name, canUnselect && value === optionValue ? null : optionValue)
        }
      }
    })
  })

  return (
    <div className={`ThumbnailPicker ThumbnailPicker--${selectedStyle}`} style={style}>
      {managedChildren}
    </div>
  )
}

ThumbnailPicker.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // use this for single value
  values: PropTypes.array, // use this for multiple values
  canUnselect: PropTypes.bool, // only works for single value, you'll be able to unselect multiple values without it
  selectedStyle: PropTypes.oneOf(['full', 'half']),
  style: PropTypes.object,
  children: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
}

ThumbnailPicker.defaultProps = {
  canUnselect: false
}

export default ThumbnailPicker
