import React, { Component } from 'react'
import { InfoBanner } from '@yesplz/core-web/ui-kits/banners'

export default class TopsInfoBanner extends Component {
  render () {
    return (
      <InfoBanner style={styles.infoBanner}>
        <h2>Fit Searches</h2>
        <p>choose your fits</p>
      </InfoBanner>
    )
  }
}

const styles = {
  infoBanner: {
    marginTop: -10,
    marginBottom: 8
  },
  smallVisualFilterButton: {
    display: 'inline-block',
    width: 40,
    height: 40,
    paddingTop: 5,
    marginLeft: 7,
    marginTop: -10,
    position: 'static',
    verticalAlign: 'top'
  }
}
