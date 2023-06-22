import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import history from '@yesplz/core-web/config/history'
import store from './config/store'
import routes from './config/routes'
import ScrollToTop from './ScrollToTop'

// import global styles
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '@yesplz/core-web/assets/css/animations.css'
import '@yesplz/core-web/assets/css/reset.css'
import './assets/styles/overrides.scss'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './App.scss'

const App = () => (
  <Provider store={store}>
    <ConnectedRouter updateLocation={() => { console.log('update location') }} history={history}>
      <ScrollToTop>{routes}</ScrollToTop>
    </ConnectedRouter>
  </Provider>
)

export default App
