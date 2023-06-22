import React, { useState } from 'react'
import PropTypes from 'prop-types'
import SidebarMenuItem from './SidebarMenuItem'

// constants
import {
  // CATEGORY_PANTS,
  // CATEGORY_SHOES,
  // CATEGORY_TOPS
  CATEGORIES_LABELS
} from '@yesplz/core-web/config/constants'

const TopsFilterMenu = ({ presets, onFilterChange }) => {
  const [activeKey, changeActiveKey] = useState('all')
  const activeCategory = presets[0] ? presets[0].category : ''

  const handleChange = presetName => {
    changeActiveKey(presetName)
    onFilterChange(activeCategory, presetName)
  }

  return (
    <React.Fragment>
      <SidebarMenuItem
        eventKey='all'
        activeKey={activeKey}
        onClick={handleChange}
        className='is-primary'>
        All {CATEGORIES_LABELS[activeCategory]}
      </SidebarMenuItem>
      {/* category menu */}
      {
        presets.map(preset => (
          <SidebarMenuItem
            key={preset.name}
            eventKey={preset.name}
            activeKey={activeKey}
            onClick={handleChange}>
            {preset.name}
          </SidebarMenuItem>
        ))
      }
    </React.Fragment>
  )
}

TopsFilterMenu.propTypes = {
  presets: PropTypes.array,
  onFilterChange: PropTypes.func
}

TopsFilterMenu.defaultProps = {
  presets: [],
  onFilterChange: (category, filterKey) => { }
}

export default TopsFilterMenu
