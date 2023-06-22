import React from 'react'
import { Route, Switch } from 'react-router'
// pages
import { Faq } from '@yesplz/core-web/modules/faq'
import { Tutorial } from '../modules/tutorials'

import { Base, NotFound } from '../modules/base'
import { Home } from '../modules/home'
import { Favorites } from '../modules/favorites'
import { ProductsLandingPage, ProductsPage, ProductsPresetLandingPage } from '../modules/products'
import { renderSingleProductPage } from '../modules/products/productRoutes'
// import { renderPresetProductsPage, renderSinglePresetProductPage } from 'modules/presets/presetRoutes'
import { Sizes } from '../modules/sizes'

const createRoutes = () => (
  <Switch>
    <Route path='/' component={BasePlatform} />
  </Switch>
)

// nested routes components
const BasePlatform = (props) => (
  <Base {...props}>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/tutorial' component={Tutorial} />
      <Route exact path='/products/:category?' component={ProductsLandingPage} />
      <Route exact path='/products/:category/list' component={ProductsPage} />
      <Route exact path='/products/:category/:productId' render={renderSingleProductPage} />

      {/* Routes for preset products */}
      <Route exact path='/preset-products/:category/:presetName' component={ProductsPresetLandingPage} />
      {/* <Route exact path='/preset-products/:presetName' render={renderPresetProductsPage} /> */}
      {/* <Route exact path='/preset-products/:presetName/:productId' render={renderSinglePresetProductPage} /> */}

      <Route exact path='/favorites/:favoriteType' component={Favorites} />
      <Route exact path='/favorites/:favoriteType/:category/:presetKey' component={ProductsPage} />
      <Route exact path='/profile/sizes/:category/:sizeKey' component={Sizes} />

      <Route exact path='/faq' component={Faq} />
      <Route component={NotFound} />
    </Switch>
  </Base>
)

export default createRoutes()
