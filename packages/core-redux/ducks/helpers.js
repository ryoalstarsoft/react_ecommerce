import findIndex from 'lodash/findIndex'
import includes from 'lodash/includes'

/**
 * update favorite of a product in product list
 * @param {string} productId
 * @param {boolean} favorite
 * @param {Object[]} products
 * @return {Object[]} products
 */
export function updateProductFavorite (productId, favorite = false, products = []) {
  const productIndex = findIndex(products, { product_id: productId })
  // if products is empty or product not found, return back the products
  if (products.length === 0 || productIndex === -1) {
    return products
  }

  const newProductData = { ...products[productIndex], favorite }
  return updateListByIndex(products, productIndex, newProductData)
}

/**
 * map favorite product ids to product list
 * @param {string[]} favoriteProductIds
 * @param {Object[]} products
 * @return {Object[]} products
 */
export function mapProductFavorites (favoriteProductIds, products = []) {
  // if products is empty or products not found, return back the products
  if (products.length === 0) {
    return products
  }

  return products.map((product) => ({
    ...product,
    favorite: includes(favoriteProductIds, product.product_id)
  }))
}

/**
 * update favorite of a preset in presets list
 * @param {string} presetName
 * @param {boolean} favorite
 * @param {Object[]} presets
 * @return {Object[]} presets
 */
export function updatePresetFavorite (presetName, favorite = false, presets = []) {
  const productIndex = findIndex(presets, { name: presetName })
  // if presets is empty or presets not found, return back the presets
  if (presets.length === 0 || productIndex === -1) {
    return presets
  }

  const newProductData = { ...presets[productIndex], favorite }
  return updateListByIndex(presets, productIndex, newProductData)
}

/**
 * map favorite presets to presets list
 * @param {string[]} favoritePresets
 * @param {Object[]} presets
 * @return {Object[]} presets
 */
export function mapPresetFavorites (favoritePresets, presets = []) {
  // if no presets available, return back the presets
  if (presets.length === 0) {
    return presets
  }

  return presets.map((preset) => ({
    ...preset,
    favorite: includes(favoritePresets, preset.name)
  }))
}

/**
 * update list by given index
 * @param {Object[]} list
 * @param {number} objectIndex
 * @param {Object} object
 */
export function updateListByIndex (list, objectIndex, object) {
  return [ ...list.slice(0, objectIndex), object, ...list.slice(objectIndex + 1) ]
}
