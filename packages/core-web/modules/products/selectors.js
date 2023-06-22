import { createSelectorCreator, defaultMemoize } from 'reselect'
import filter from 'lodash/filter'
import isEqual from 'lodash/isEqual'

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

// filter matching products, score is 97 or above
const getMatchingProducts = products => (
  filter(products, product => product.score >= 97)
)

export const matchingProductsSelector = createDeepEqualSelector(
  products => products,
  getMatchingProducts
)

// close matching products, score bellow 97
const getCloseMatchingProducts = (products) => (
  filter(products, product => product.score < 97)
)

export const closeMatchingProductsSelector = createDeepEqualSelector(
  products => products,
  getCloseMatchingProducts
)
