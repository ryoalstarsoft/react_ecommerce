import { applyMiddleware, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import MixpanelMiddleware from 'redux-mixpanel-middleware'
import { composeWithDevTools } from 'redux-devtools-extension'
import history from '@yesplz/core-web/config/history'
import * as reducers from '@yesplz/core-redux/ducks'
import { makeRecommendationMiddleware } from '@yesplz/core-redux/middlewares/recommendation'

const mixpanelMiddleware = new MixpanelMiddleware(window.mixpanel)

const rootReducer = combineReducers({
  router: connectRouter(history),
  ...reducers
})

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
      thunk, // add dispatch to action creators
      makeRecommendationMiddleware(90),
      mixpanelMiddleware
    )
  )
)

export default store
