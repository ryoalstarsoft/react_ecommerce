import React, { PureComponent } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './SidebarMenuGroup.scss'

class SidebarMenuGroup extends PureComponent {
  static propTypes = {
    eventKey: PropTypes.string.isRequired,
    activeKey: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired
  }

  render () {
    const { eventKey, activeKey, children } = this.props

    return (
      <PerfectScrollbar className={classNames('SidebarMenuGroup', { 'is-active': eventKey === activeKey })}>
        {children}
      </PerfectScrollbar>
    )
  }
}

export default SidebarMenuGroup
