import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import without from 'lodash/without'
import includes from 'lodash/includes'
import { Checkbox, Radio } from '@yesplz/core-web/ui-kits/forms'
import './FilterGroup.scss'

const FilterGroup = ({ name, values, options, type, onChange }) => {
  const optionNames = map(options, 'name')

  const isAllOptionAvailable = includes(optionNames, 'all')
  // pure means: other options except `all`
  const pureOptionsNames = without(optionNames, 'all')
  const pureValues = without(values, 'all')

  const handleCheckboxChange = (optionName, value) => {
    if (optionName === 'all') {
      if (value) {
        // check all items
        onChange(name, optionNames)
      } else {
        // uncheck all items
        onChange(name, [])
      }
    } else if (value) {
      const nextValues = [...values, optionName]
      const nextPureValues = without(nextValues, 'all')

      onChange(
        name,
        // when `all` option is unchecked and other pure values is checked, then check `all` option
        isAllOptionAvailable && nextPureValues.length === pureOptionsNames.length ? [...nextValues, 'all'] : nextValues
      )
    } else {
      onChange(name, without(without(values, optionName), 'all'))
    }
  }

  const handleRadioChange = (optionName, value) => {
    onChange(name, value ? [optionName] : [])
  }

  return (
    <div className='FilterGroup'>
      {
        options.map(option => {
          const indeterminate = option.name === 'all' && pureValues.length > 0 && pureValues.length < pureOptionsNames.length
          let fieldComponent = null

          if (type === 'radio') {
            fieldComponent = (
              <Radio
                key={option.name}
                label={option.label}
                name={option.name}
                value={values[0] === option.name}
                htmlFor={`${name}-${option.name}`}
                indeterminate={indeterminate}
                disabled={option.disabled}
                onChange={handleRadioChange}
              />
            )
          }

          fieldComponent = (
            <Checkbox
              key={option.name}
              label={option.label}
              name={option.name}
              value={includes(values, option.name)}
              htmlFor={`${name}-${option.name}`}
              indeterminate={indeterminate}
              disabled={option.disabled}
              onChange={handleCheckboxChange}
            />
          )

          // when option is disabled but has fallbackURL, wrap field with a link
          if (option.disabled && option.fallbackURL) {
            return (
              <Link key={option.name} to={option.fallbackURL} className='FilterGroup-fieldLinkWrap'>
                {fieldComponent}
              </Link>
            )
          }

          return fieldComponent
        })
      }
    </div>
  )
}

FilterGroup.propTypes = {
  name: PropTypes.string,
  values: PropTypes.array,
  options: PropTypes.array,
  type: PropTypes.oneOf(['checkbox', 'radio']),
  onChange: PropTypes.func
}

FilterGroup.defaultProps = {
  options: [],
  values: [],
  type: 'checkbox'
}

export default FilterGroup
