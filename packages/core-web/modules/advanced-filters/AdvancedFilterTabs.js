import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import './AdvancedFilterTabs.scss'

const AdvancedFilterTabs = ({ tabs, children, style }) => {
  const [ activeTab, setActiveTab ] = useState(tabs[0].key)

  const activeChild = React.Children.toArray(children).find(child => child.props.tabKey === activeTab)

  return (
    <div className='AdvancedFilterTabs' style={style}>
      <PerfectScrollbar option={{ handlers: scrollbarHandlers }}>
        <ul className='AdvancedFilterTabs-header'>
          {
            tabs.map(tab => (
              <li
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                }}
                className={classNames({ 'is-active': tab.key === activeTab })}
              >
                {tab.label}
              </li>
            ))
          }
        </ul>
      </PerfectScrollbar>
      <div className='AdvancedFilterTabs-content'>
        <PerfectScrollbar option={{ handlers: scrollbarHandlers }}>
          {activeChild}
        </PerfectScrollbar>
      </div>
    </div>
  )
}

AdvancedFilterTabs.propTypes = {
  tabs: PropTypes.array,
  children: PropTypes.any,
  style: PropTypes.object
}

AdvancedFilterTabs.defaultProps = {
  tabs: []
}

// tab content
export const TabItem = ({ tabKey, children, style }) => (
  <div key={tabKey} className='AdvancedFilterTabs-item' style={style}>
    {children}
  </div>
)

TabItem.propTypes = {
  tabKey: PropTypes.string.isRequired,
  children: PropTypes.any,
  style: PropTypes.object
}

const scrollbarHandlers = ['click-rail', 'drag-thumb', 'keyboard', 'touch']

export default AdvancedFilterTabs
