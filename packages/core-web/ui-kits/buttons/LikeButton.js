import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Like from '@yesplz/core-web/ui-kits/icons/Like'
import './like-button.css'

export default class LikeButton extends PureComponent {
  render () {
    const { active, onClick } = this.props

    return (
      <div className={classNames('LikeButton', { active })}>
        <button onClick={onClick}>
          <Like isLiked={active} />
        </button>
      </div>
    )
  }
}

LikeButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func
}

LikeButton.defaultProps = {
  active: false
}
