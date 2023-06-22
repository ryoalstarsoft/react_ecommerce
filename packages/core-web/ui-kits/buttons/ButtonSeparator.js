import React from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
import './ButtonSeparator.scss'

const ButtonSeparator = ({ label, onClick, style }) => (
  <div className='ButtonSeparator' style={style}>
    <div className='container-wide'>
      <Button className='ButtonBordered' onClick={onClick}>{label}</Button>
    </div>
  </div>
)

ButtonSeparator.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object
}

ButtonSeparator.defaultProps = {
  onClick: () => {}
}

export default ButtonSeparator
