import { createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash/isEqual'

export default createSelectorCreator(
  defaultMemoize,
  isEqual
)
