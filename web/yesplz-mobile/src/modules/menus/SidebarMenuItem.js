import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const SidebarMenuItem = ({
  eventKey, activeKey, isActive, to, onClick, children, className
}) => {
  const commonProps = {
    onClick: () => onClick(eventKey),
    className: classNames(className, { 'is-active': isActive || eventKey === activeKey })
  }

  if (to) {
    return (
      <NavLink to={to} {...commonProps}>
        {children}
      </NavLink>
    )
  }

  return (
    <a {...commonProps}>
      {children}
    </a>
  )
}

SidebarMenuItem.propTypes = {
  eventKey: PropTypes.string.isRequired,
  activeKey: PropTypes.string,
  isActive: PropTypes.bool,
  children: PropTypes.any,
  to: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func
}

SidebarMenuItem.defaultProps = {
  isActive: false,
  onClick: () => {}
}

export default SidebarMenuItem
