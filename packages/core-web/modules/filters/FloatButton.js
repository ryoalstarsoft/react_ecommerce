import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import TopIcon from '@yesplz/core-web/assets/svg/vf-button-top.svg'
import ShoesIcon from '@yesplz/core-web/assets/svg/vf-button-shoes.svg'
import PantsIcon from '@yesplz/core-web/assets/svg/vf-button-pants.svg'
import './FloatButton.scss'

export default class FloatButton extends PureComponent {
  static propTypes = {
    category: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func
  }

  getIcon () {
    const { category } = this.props
    switch (category) {
      case 'wshoes':
        return ShoesIcon
      case 'wpants':
        return PantsIcon
      default:
        return TopIcon
    }
  }

  render () {
    const { onClick, className, style } = this.props

    return (
      <button className={classNames('FloatButton', { [className]: className })} style={style} onClick={onClick}>
        <img src={this.getIcon()} alt='VisualFilterButton' />
      </button>
    )
  }
}
