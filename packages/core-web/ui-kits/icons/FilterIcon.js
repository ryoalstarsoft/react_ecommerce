import React from 'react'
import PropTypes from 'prop-types'
import FilterSvg from './filter.svg'
import './FilterIcon.scss'

const FilterIcon = ({ onClick, countFilters }) => {
  return (
    <div className='FilterIcon' onClick={onClick}>
      <img src={FilterSvg} />
      <div className='CountFilters' >{countFilters}</div>
    </div>
  )
}

FilterIcon.propTypes = {
  onClick: PropTypes.func,
  countFilters: PropTypes.number
}

FilterIcon.defaultProps = {
  onClick () {},
  countFilters: 0
}

export default FilterIcon
