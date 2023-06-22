import { configure } from '@storybook/react'

// load stories from `src` directory, with `stories.js` suffix
const reqWeb = require.context('../web', true, /\.stories\.js$/)
const reqPackages = require.context('../packages', true, /\.stories\.js$/)

function loadStories() {
  reqWeb.keys().forEach(reqWeb);
  reqPackages.keys().forEach(reqPackages);
}

configure(loadStories, module)
