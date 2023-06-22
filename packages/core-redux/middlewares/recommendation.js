import includes from 'lodash/includes'
import { fetchRecommendedProducts } from '@yesplz/core-redux/ducks/products'
import { LIKE_PRODUCT, UNLIKE_PRODUCT } from '@yesplz/core-redux/ducks/product'
import { LIKE_PRESET, UNLIKE_PRESET } from '@yesplz/core-redux/ducks/filters'

export const makeRecommendationMiddleware = productCount => store => next => action => {
  const { type, payload } = action
  const { router } = store.getState()
  // when products is liked / unlike, re-fetch the recommended products
  if (router.location.pathname !== '/' && includes([LIKE_PRODUCT, UNLIKE_PRODUCT, LIKE_PRESET, UNLIKE_PRESET], type)) {
    store.dispatch(fetchRecommendedProducts(productCount, payload.category))
  }

  return next(action)
}

const middleware = makeRecommendationMiddleware(3)

export default middleware
