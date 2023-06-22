import React from 'react'
import { renderBreadcrumbs } from '../../config/routesHelpers'
import { ProductPage } from '@yesplz/core-web/modules/products'
import ProductsVisualFilter from '../filters/ProductsVisualFilter'

import './product-routes.scss'

export const renderSingleProductPage = router => (
  <React.Fragment>
    <ProductPage
      match={router.match}
      renderExtraItem={renderBreadcrumbs([
        { name: 'YesPlz', uri: '/' },
        { name: 'Product Detail' }
      ])}
      className='ProductPage-mobile'
    />
    <ProductsVisualFilter activeCategory={router.match.params.category} />
  </React.Fragment>

)
