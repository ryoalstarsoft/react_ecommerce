import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
// import { loadSvgSource } from '@yesplz/core-web/utils/svgHelpers'
import initializeAxios from '@yesplz/core-web/utils/initializeAxios'

initializeAxios()

ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker()
// load visual filter sources
// loadSvgSource('#svg-filters', `${process.env.PUBLIC_URL}/svg/highlight.svg`)
