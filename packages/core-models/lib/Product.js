import { FAVORITE_PRODUCTS } from '../config/constants'
import uniqBy from 'lodash/uniqBy'
import reject from 'lodash/reject'
import map from 'lodash/map'

const { localStorage } = window

export default class Product {
  /**
   * get favorite products from local storage
   */
  static getFavoriteProducts () {
    return JSON.parse(localStorage.getItem(FAVORITE_PRODUCTS)) || []
  }

  /**
   * get favorite product ids from local storage
   */
  static getFavoriteProductIds () {
    return map(Product.getFavoriteProducts(), 'product_id')
  }

  /**
   * set favorite products data (replace)
   * @param {Object[]} favoriteProducts
   */
  static setFavoriteProducts (favoriteProducts) {
    localStorage.setItem(FAVORITE_PRODUCTS, JSON.stringify(favoriteProducts))
  }

  /**
   * save productId to list of favorit product in local storage
   * @param {object} product
   */
  static like (product) {
    let favoriteProducts = Product.getFavoriteProducts()
    favoriteProducts = uniqBy([ ...favoriteProducts, { ...product, favorite: true } ], 'product_id')
    Product.setFavoriteProducts(favoriteProducts)
  }

  /**
   * remove productId from list of favorit product in local storage
   * @param {string} productId
   */
  static unlike (productId) {
    let favoriteProducts = Product.getFavoriteProducts()
    favoriteProducts = reject(favoriteProducts, { product_id: productId })
    Product.setFavoriteProducts(favoriteProducts)
  }
}
