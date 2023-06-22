import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import './Button.scss'

export default class Button extends Component {
  isExternal (url) {
    return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url)
  }

  render () {
    const { to, children, kind, className, ...otherProps } = this.props

    const buttonProps = {
      className: classNames(`YesplzButton YesplzButton--${kind}`, { [className]: className })
    }

    // if `to` not is defined, then we will use button as the component
    if (!to) {
      return (
        <button {...buttonProps} {...otherProps}>
          {children}
        </button>
      )
    }

    // if `to` is defined, check wheter the url is external or internal
    // if external, use `<a />`, else use `react-router-dom <Link />`

    if (this.isExternal(to)) {
      return (
        <a href={to} {...buttonProps} {...otherProps} target='_blank'>{children}</a>
      )
    } else {
      return (
        <Link to={to} {...buttonProps} {...otherProps}>{children}</Link>
      )
    }
  }
}

Button.propTypes = {
  to: PropTypes.string,
  children: PropTypes.any.isRequired,
  kind: PropTypes.oneOf(['primary', 'secondary', 'rounded']),
  className: PropTypes.string
}

Button.defaultProps = {
  kind: 'primary'
}
