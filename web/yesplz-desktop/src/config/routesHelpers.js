/** helper functions */
import React from 'react'
import { NavLink } from 'react-router-dom'
import TopsInfoBanner from '@yesplz/core-web/modules/tops/TopsInfoBanner'
import { BreadCrumbs } from '@yesplz/core-web/ui-kits/misc'

/**
 * render info banner for tops page
 * @param {Object} containerContext
 * @returns react element
 */
export const renderTopsInfoBanner = containerContext => (
  <TopsInfoBanner filters={containerContext.props.filters} onVisualFilterClick={containerContext.showVisualFilter} />
)

/**
 * render breadcrumbs items
 * @param {Object[]} list
 * @param {Object} otherProps
 * @returns renderItem callback
 */
export const renderBreadcrumbs = (list = [], otherProps = {}) => containerContext => {
  const breadcrumbsItems = list.map((item, index) => {
    // last item render without link
    if (index === list.length - 1) {
      return <div key={item.name} className='current'>{item.name}</div>
    }

    return <NavLink key={item.name} to={item.uri || '/'}>{item.name}</NavLink>
  })

  return (
    <BreadCrumbs style={styles.breadcrumbs} className='animated fadeInDown' {...otherProps}>
      {breadcrumbsItems}
    </BreadCrumbs>
  )
}

const styles = {
  breadcrumbs: {
    fontSize: 24,
    margin: '-10px -5px 10px',
    padding: '50px 10px 44px'
  }
}
