import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store from './config/store'
import history from '@yesplz/core-web/config/history'
import routes from './config/routes'
import ScrollToTop from './ScrollToTop'

// import global styles
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '@yesplz/core-web/assets/css/animations.css'
import '@yesplz/core-web/assets/css/reset.css'
import './assets/css/overrides.css'
import './app.css'

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ScrollToTop>{routes}</ScrollToTop>
    </ConnectedRouter>
  </Provider>
)

export default App
