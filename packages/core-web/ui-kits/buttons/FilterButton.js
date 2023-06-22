import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './filter-button.css'

export default class FilterButton extends PureComponent {
  get handleClick () {
    const { name, value, onClick } = this.props
    return () => {
      onClick && onClick(value, name)
    }
  }

  render () {
    const { iconSrc, children, iconStyle, className, active, style } = this.props

    return (
      <div className={classNames('FilterButton', { [className]: className, active })} onClick={this.handleClick} style={style}>
        <div className='FilterButton-icon' style={iconStyle}>
          {iconSrc && <img src={iconSrc} alt={children} />}
        </div>
        <h5>{children}</h5>
      </div>
    )
  }
}

FilterButton.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any,
  active: PropTypes.bool,
  iconSrc: PropTypes.string,
  iconStyle: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object
}

FilterButton.defaultProps = {
  active: false
}
