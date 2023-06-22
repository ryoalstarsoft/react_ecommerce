import React, { useState } from 'react'
import PropTypes from 'prop-types'
import SidebarMenuItem from './SidebarMenuItem'

const TopsFilterMenu = ({ onFilterChange }) => {
  const [ activeKey, changeActiveKey ] = useState('all')

  const handleChange = category => {
    changeActiveKey(category)
    onFilterChange('tops', category)
  }

  return (
    <React.Fragment>
      <SidebarMenuItem
        eventKey='all'
        activeKey={activeKey}
        onClick={handleChange}
        className='is-primary'>
        All Tops
      </SidebarMenuItem>
      {/* category menu */}
      <SidebarMenuItem
        eventKey='tanks'
        activeKey={activeKey}
        onClick={handleChange}>
        Tanks
      </SidebarMenuItem>
      <SidebarMenuItem
        eventKey='t-shirts'
        activeKey={activeKey}
        onClick={handleChange}>
        T-Shirts
      </SidebarMenuItem>
      <SidebarMenuItem
        eventKey='blouses'
        activeKey={activeKey}
        onClick={handleChange}>
        Blouses
      </SidebarMenuItem>
      <SidebarMenuItem
        eventKey='tunics'
        activeKey={activeKey}
        onClick={handleChange}>
        Tunics
      </SidebarMenuItem>
      <SidebarMenuItem
        eventKey='max'
        activeKey={activeKey}
        onClick={handleChange}>
        Max
      </SidebarMenuItem>
    </React.Fragment>
  )
}

TopsFilterMenu.propTypes = {
  onFilterChange: PropTypes.func
}

TopsFilterMenu.defaultProps = {
  onFilterChange: (category, filterKey) => {}
}

export default TopsFilterMenu
