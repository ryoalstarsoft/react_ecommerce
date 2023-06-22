import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './MenuButton.scss'

const MenuButton = ({ closeMode, onClick }) => (
  <div
    className={classNames('MenuButton', { 'MenuButton--close': closeMode })}
    onClick={onClick}>
    <div className='MenuButton-inner' />
  </div>
)

MenuButton.propTypes = {
  closeMode: PropTypes.bool,
  onClick: PropTypes.func
}

MenuButton.defaultProps = {
  closeMode: false,
  onClick: () => {}
}

export default MenuButton
