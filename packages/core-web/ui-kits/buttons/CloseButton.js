import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import closeSvgSrc from '../../assets/svg/close.svg'
import './close-button.css'

export default class CloseButton extends PureComponent {
  render () {
    const { onClick, style, className } = this.props
    return (
      <div onClick={onClick} className={classNames('CloseButton', { [className]: className })} style={style}>
        <img src={closeSvgSrc} alt='Close' />
      </div>
    )
  }
}

CloseButton.propTypes = {
  onClick: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string
}
