import React from 'react'
import ProductsPage from '@yesplz/core-web/modules/products/ProductsPage'
import { renderBreadcrumbs } from '../../config/routesHelpers'
import './presets-routes.css'

export const PresetProductsRoute = router => {
  const { presetName } = router.match.params
  return (
    <ProductsPage
      key='preset-products-page'
      match={router.match}
      className='PresetProducts'
      productBasePath={`/preset-products/${presetName}`}
      renderExtraItem={renderBreadcrumbs([
        { name: 'Editor\'s Pick', uri: '/' },
        { name: presetName }
      ], { style: styles.breadcrumbs })}
    />
  )
}

const styles = {
  breadcrumbs: {
    fontSize: 24,
    margin: '-10px -5px 10px',
    padding: '50px 10px 44px'
  }
}
