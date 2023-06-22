import React from 'react'
import { renderBreadcrumbs } from 'config/routesHelpers'
import { ProductsPage, ProductPage } from '@yesplz/core-web/modules/products'
import './preset-routes.scss'

export const renderSinglePresetProductPage = router => {
  const { presetName } = router.match.params
  return (
    <ProductPage
      match={router.match}
      renderExtraItem={renderBreadcrumbs([
        { name: 'Editor\'s Pick', uri: '/' },
        { name: presetName, uri: `/preset-products/${presetName}` },
        { name: 'Detail' }
      ])}
      className='PresetProductPage-mobile'
    />
  )
}

export const renderPresetProductsPage = router => {
  const { presetName } = router.match.params
  return (
    <ProductsPage
      key='preset-products-page'
      match={router.match}
      productBasePath={`/preset-products/${presetName}`}
      renderExtraItem={renderBreadcrumbs([
        { name: 'Editor\'s Pick', uri: '/' },
        { name: presetName }
      ])}
      className='PresetProductListPage-mobile'
    />
  )
}
