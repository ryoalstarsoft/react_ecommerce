import React from 'react'
import PropTypes from 'prop-types'

const ArrowLine = ({ direction, color, width, height, onClick }) => {
  const svgProps = {
    width,
    height,
    viewBox: '0 0 40 40',
    version: '1.1',
    xmlns: 'http://www.w3.org/2000/svg',
    xmlnsXlink: 'http://www.w3.org/1999/xlink',
    onClick: onClick
  }

  if (direction === 'left') {
    return (
      <svg {...svgProps}>
        <g id='icons/arrow-40-left' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
          <g>
            <rect id='Rectangle' x='0' y='0' width='40' height='40' />
            <polygon id='Path' stroke={color} strokeWidth='0.3' fill={color} points='32 18.6481771 32 20.3513115 13.9122216 20.3513115 13.9122216 24 8 19.5 13.9122216 15 13.9122216 18.6481771' />
          </g>
        </g>
      </svg>
    )
  }

  return (
    <svg {...svgProps}>
      <g id='icons/arrow-40' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
        <g>
          <rect id='Rectangle' x='0' y='0' width='40' height='40' />
          <polygon id='Path' stroke={color} strokeWidth='0.3' fill={color} transform='translate(20.000000, 19.500000) scale(-1, 1) rotate(-180.000000) translate(-20.000000, -19.500000) ' points='8 20.3518229 26.0877784 20.3518229 26.0877784 24 32 19.5 26.0877784 15 26.0877784 18.6486885 8 18.6486885' />
        </g>
      </g>
    </svg>
  )
}

ArrowLine.propTypes = {
  direction: PropTypes.oneOf(['left', 'right']),
  color: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  onClick: PropTypes.func
}

ArrowLine.defaultProps = {
  direction: 'right',
  color: '#000',
  width: '40px',
  height: '40px',
  onClick () {}
}

export default ArrowLine
