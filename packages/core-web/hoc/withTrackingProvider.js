import React, { Component } from 'react'
import { Tracker } from '@yesplz/core-models'
import TrackingContext from './TrackingContext'
import isFunction from 'lodash/isFunction'

/**
 * wrap component with tracking properties through context provider
 * @param {string} pageName
 * @param {(Object|function)} trackingProps can be a mapper function or object
 */
const withTrackingProvider = (pageName, trackingProps) => WrappedComponent => {
  return class extends Component {
    constructor (props) {
      super(props)
      this.state = {
        tracker: new Tracker(
          pageName,
          isFunction(trackingProps) ? trackingProps(this.props) : trackingProps
        )
      }
    }

    render () {
      return (
        <TrackingContext.Provider value={this.state}>
          <WrappedComponent {...this.props} />
        </TrackingContext.Provider>
      )
    }
  }
}

export default withTrackingProvider
