/**
 * allow action creator with side effect (promise) to be cancelled
 * the idea is to prevent updating store if action is cancelled
 * this will only apply while using `thunk` middleware
 * @param {Object} action Promise
 */
export function createCancelableAsyncAction (action) {
  return (...promiseArgs) => dispatch => (
    createCancelablePromise(requestStatus => dispatch(action(...promiseArgs, requestStatus)))
  )
}

/**
 * fake promise to reject promise before original promise finished
 * @param {*} makeOriginalPromise function to produce original promise
 */
export function createCancelablePromise (makeOriginalPromise) {
  let cancelPromise
  let racedPromise
  // mutated request status
  let requestStatus = {
    isCancelled: false
  }

  // fake promise to reject promise before original promise finished
  const cancelableRequest = new Promise((resolve, reject) => {
    cancelPromise = (reason) => {
      reject(reason || 'promise cancelled')
      // mutate request status, change cancelled to true
      requestStatus.isCancelled = true
      return racedPromise
    }
  })

  // get the first finished promise
  racedPromise = Promise.race([
    makeOriginalPromise(requestStatus),
    cancelableRequest
  ])
  racedPromise.cancel = cancelPromise

  return racedPromise
}
