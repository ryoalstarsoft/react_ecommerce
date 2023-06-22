const { mixpanel } = window
const isDev = process.env.NODE_ENV === 'development'

export default class Tracker {
  constructor (pageName, properties = {}) {
    this.pageName = pageName

    this.trackPage(pageName, properties)
  }

  get defaultProperties () {
    return {
      page: this.pageName,
      dev: isDev
    }
  }

  trackPage (name, properties) {
    this.track(`Page View ${name}`, properties)
  }

  track (event, properties = {}) {
    const props = {
      ...this.defaultProperties,
      ...properties
    }

    if (isDev) {
      console.debug('Track:', event, props)
    }
    if (mixpanel) {
      mixpanel.track(event, props)
    }
  }

  registerTrackLinks (selector, event, properties = {}) {
    const props = {
      ...this.defaultProperties,
      ...properties
    }

    if (isDev) {
      console.debug('Register Track links:', selector, event, props)
    }
    if (mixpanel) {
      mixpanel.track_links(selector, event, props)
    }
  }

  static track (event, props) {
    if (mixpanel) {
      mixpanel.track(event, {
        dev: isDev,
        ...props
      })
    }
  }
}
