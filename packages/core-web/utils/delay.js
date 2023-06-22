import { createCancelablePromise } from './async'
/**
 * `setTimeout` with promise
 * created for async await
 * @param {number} delay
 */

export default (delay) => createCancelablePromise(() => new Promise(resolve => setTimeout(resolve, delay)))
