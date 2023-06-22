/**
 * Axios initialization
 */
import axios from 'axios'
import { BASE_API_PATH, DEBUG_PARAM } from '@yesplz/core-web/config/constants'

export default () => {
  // configure axios
  axios.defaults.baseURL = BASE_API_PATH

  // get debug param
  const urlParams = new URLSearchParams(window.location.search)
  const debugParamValue = urlParams.get(DEBUG_PARAM)

  // if debug params available, add it as default param in all request
  if (debugParamValue) {
    axios.defaults.params = { [DEBUG_PARAM]: debugParamValue }
  }
}
