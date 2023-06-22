import React from 'react'
import PropTypes from 'prop-types'

export default class SliderNav extends React.Component {
  static propTypes = {
    slideIndex: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    const { slideIndex, onClick } = this.props
    onClick(slideIndex)
  }

  render () {
    const { icon } = this.props

    return (
      <button onClick={this.handleClick}>
        <img src={icon} />
      </button>
    )
  }
}
