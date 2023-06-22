import React, { Component } from 'react'
import { FlatBanner } from '@yesplz/core-web/ui-kits/banners'

export default class NotFound extends Component {
  render () {
    return (
      <FlatBanner style={styles.banner}>
        <h2>Oops! The page you are looking for is not available.</h2>
      </FlatBanner>
    )
  }
}

const styles = {
  banner: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  }
}
