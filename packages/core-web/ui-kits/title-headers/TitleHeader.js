import React from 'react'
import PropTypes from 'prop-types'
import './TitleHeader.css'

function TitleHeader (props) {
  return (
    <div className={'TitleHeader ' + props.className}>
      {props.children}
    </div>
  )
}

TitleHeader.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
}

TitleHeader.defaultProps = {
  className: ''
}

export default TitleHeader
