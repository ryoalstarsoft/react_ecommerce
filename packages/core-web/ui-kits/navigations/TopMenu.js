import React from 'react'
import PropTypes from 'prop-types'
import './top-menu.css'

const TopMenu = ({ children, className, style, ...otherProps }) => (
  <div className={`TopMenu ${className}`} style={style} {...otherProps}>
    <div className='container'>
      {children}
    </div>
  </div>
)

TopMenu.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.object
}

TopMenu.defaultProps = {
  className: ''
}

export default TopMenu
