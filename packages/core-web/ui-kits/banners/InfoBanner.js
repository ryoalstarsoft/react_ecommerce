import React from 'react'
import PropTypes from 'prop-types'
import FlatBanner from './FlatBanner'
import './info-banner.css'

const InfoBanner = (props) => (
  <FlatBanner {...props} className={`InfoBanner ${props.className}`} />
)

InfoBanner.propTypes = {
  className: PropTypes.string
}

export default InfoBanner
