import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import CheckSvg from '../../assets/svg/check.svg'
import CheckDarkSvg from '../../assets/svg/check-dark.svg'
import './ColorButton.scss'

export default class ColorButton extends Component {
  get handleClick () {
    const { name, onClick } = this.props
    return () => {
      onClick(name)
    }
  }

  render () {
    const { name, color, active, invert } = this.props
    return (
      <button
        onClick={this.handleClick}
        className={classNames('ColorButton', { [name]: name, active })}
      >
        <div className='ColorButton-color' style={{ backgroundColor: color, backgroundImage: color }} />
        {
          active && (
            <div className='ColorButton-mask' style={{ backgroundColor: invert ? null : color, backgroundImage: color }}>
              <img src={invert ? CheckDarkSvg : CheckSvg} />
            </div>
          )
        }
      </button>
    )
  }
}

ColorButton.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  active: PropTypes.bool,
  invert: PropTypes.bool,
  onClick: PropTypes.func
}

ColorButton.defaultProps = {
  active: false,
  invert: false,
  onClick: (name) => { console.debug('ColorButton - clicked', name) }
}
