import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './flat-banner.css'

export default class FlatBanner extends Component {
  render () {
    const { children, className, style } = this.props

    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }
}

FlatBanner.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.object
}

FlatBanner.defaultProps = {
  className: 'FlatBanner'
}
