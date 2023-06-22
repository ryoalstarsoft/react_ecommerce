import React from 'react'
import PropTypes from 'prop-types'
import FilterSvg from './filter.svg'
import './PageTitle.scss'

const PageTitle = ({ children, showSwitch, className, onTitleClick, onFilterClick, isLastTitle }) => (
  <div className={`PageTitle ${className} ${isLastTitle ? 'PageTitle--last-title' : ''}`}>
    <h2 onClick={onTitleClick}>{children}</h2>
    {showSwitch && (
      <div className='PageTitle-filterButton' onClick={onFilterClick}>
        <img src={FilterSvg} />
      </div>
    )}
  </div>
)

PageTitle.propTypes = {
  children: PropTypes.any.isRequired,
  showSwitch: PropTypes.bool,
  isLastTitle: PropTypes.bool,
  className: PropTypes.string,
  onTitleClick: PropTypes.func,
  onFilterClick: PropTypes.func
}

PageTitle.defaultProps = {
  showSwitch: false,
  isLastTitle: false
}

export default PageTitle
