/**
 * Tabs navigation for react-router's `NavLink`
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isNil from 'lodash/isNil'
import './tabs.css'

export default class Tabs extends Component {
  render () {
    const { children, kind, style } = this.props

    return (
      <div className={`Tabs ${kind}`} style={style}>
        {manageChildren(children)}
      </div>
    )
  }
}

/**
 * define `activeClassName` to children
 * @param {Object[]} children
 * @returns {Object[]} managed children
 */
const manageChildren = (children) => (
  React.Children.map(children, (element) => {
    if (isNil(element)) {
      return null
    }
    return React.cloneElement(element, { activeClassName: 'active' })
  })
)

Tabs.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.any),
    PropTypes.element
  ]),
  kind: PropTypes.oneOf(['default', 'capsule']),
  style: PropTypes.object
}

Tabs.defaultProps = {
  kind: 'default'
}
