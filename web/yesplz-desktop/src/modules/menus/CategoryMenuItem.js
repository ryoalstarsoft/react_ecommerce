import React from 'react'
import PropTypes from 'prop-types'

const CategoryMenuItem = ({ categoryKey, children, onClick, onMouseEnter }) => (
  <div
    className='CategoryMenu-item'
    onClick={() => onClick(categoryKey)}
    onMouseEnter={() => onMouseEnter(categoryKey)}>
    {children}
  </div>
)

CategoryMenuItem.propTypes = {
  categoryKey: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func
}

CategoryMenuItem.defaultProps = {
  onClick: () => {},
  onMouseEnter: () => {}
}

export default CategoryMenuItem
