import React from 'react'
import ProductPage from '@yesplz/core-web/modules/products/ProductPage'
import { renderBreadcrumbs } from '../../config/routesHelpers'
import './single-product-routes.css'
import './ProductPage-desktop.scss'

export const SingleProductRoute = router => (
  <ProductPage
    match={router.match}
    renderExtraItem={renderBreadcrumbs([
      { name: 'Find', uri: '/' },
      { name: 'Product Detail' }
    ], { style: styles.breadcrumbs })}
    className='ProductPage-desktop'
    showArrows
  />
)

export const SinglePresetProductRoute = router => {
  // const { presetName } = router.match.params
  return (
    <ProductPage
      match={router.match}
      // renderExtraItem={renderBreadcrumbs([
      //   { name: 'Editor\'s Pick', uri: '/' },
      //   { name: presetName, uri: `/preset-products/${presetName}` },
      //   { name: 'Detail' }
      // ], { style: styles.breadcrumbs })}
      id='ProductPage-desktop'
      className='ProductPage-desktop'
      showArrows
    />
  )
}

const styles = {
  breadcrumbs: {
    fontSize: 24,
    background: 'white',
    margin: '-10px -5px 8px'
  }
}
