import React from 'react'
import TrackingContext from './TrackingContext'

/**
 * wrap component with context consumer, pass the tracker prop
 */
const withTrackingConsumer = () => WrappedComponent => props => (
  <TrackingContext.Consumer>
    {({ tracker }) => (
      <WrappedComponent {...props} tracker={tracker} />
    )}
  </TrackingContext.Consumer>
)

export default withTrackingConsumer
