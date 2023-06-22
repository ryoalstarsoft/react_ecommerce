import React from 'react'
import PropTypes from 'prop-types'
import FilterGroup from './FilterGroup'
import './FilterLabel.scss'

const FilterLabel = ({ label, children }) => (
  <React.Fragment>
    <h4 className='FilterLabel'>{label}</h4>
    {children}
  </React.Fragment>
)

FilterLabel.propTypes = {
  label: PropTypes.string,
  children: (propValue, key, componentName, location, propFullName) => {
    if (propValue[key].type !== FilterGroup) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      )
    }
  }
}

export default FilterLabel
