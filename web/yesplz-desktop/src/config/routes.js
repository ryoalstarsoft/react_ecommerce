import React from 'react'
import { Route, Switch } from 'react-router'
// pages
import { Base, BaseDemo, NotFound } from '../modules/base'
import { Home } from '../modules/home'
import { Favorites } from '../modules/favorites'
import { Faq } from '../modules/faq'
import Tops from '../modules/tops/Tops'
import { PresetProductsRoute } from '../modules/presets/presetsRoutes'
import { ProductsPage } from '../modules/products'

// presentationals
import { SingleProductRoute, SinglePresetProductRoute } from '../modules/products/singleProductRoutes'

const createRoutes = () => (
  <Switch>
    <Route
      path='/'
      component={
        JSON.parse(process.env.REACT_APP_RETAILER_DEMO) ? DemoPlatform : BasePlatform
      } />
  </Switch>
)

// nested routes components
const BasePlatform = (props) => (
  <Base {...props}>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/products' component={Tops} />
      <Route exact path='/products/:category/list' component={ProductsPage} />
      <Route exact path='/products/:category/:productId' render={SinglePresetProductRoute} />

      {/* <Route exact path='/products/:productId' component={SingleProductRoute} /> */}
      <Route exact path='/preset-products/:presetName' render={PresetProductsRoute} />
      {/* <Route exact path='/preset-products/:presetName/:productId' render={SinglePresetProductRoute} /> */}
      <Route exact path='/favorites/:favoriteType' component={Favorites} />
      <Route exact path='/faq' component={Faq} />
      <Route component={NotFound} />
    </Switch>
  </Base>
)

// nested routes components
const DemoPlatform = (props) => (
  <BaseDemo {...props}>
    <Switch>
      <Route exact path='/' component={Tops} />
      <Route exact path='/products/:productId' component={SingleProductRoute} />
      <Route exact path='/products/:presetName/:productId' render={SinglePresetProductRoute} />
      <Route component={NotFound} />
    </Switch>
  </BaseDemo>
)

export default createRoutes()
