import React, { PureComponent } from 'react'
import Slider from 'react-slick'
import PropTypes from 'prop-types'
import { Placeholder } from '@yesplz/core-web/ui-kits/misc'

class SlideFetcher extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    onFetch: PropTypes.func
  }

  static defaultProps = {
    onFetch: () => new Promise()
  }

  constructor (props) {
    super(props)
    this.fetching = false
    this.handleAfterChange = this.handleAfterChange.bind(this)
  }

  get sliderSettings () {
    return {
      dots: false,
      arrows: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    }
  }

  async handleAfterChange (currentIndex) {
    const { children, onFetch } = this.props

    if (currentIndex >= children.length - 1 && !this.fetching) {
      this.fetching = true
      await onFetch()
      this.fetching = false
    }
  }

  render () {
    const { children } = this.props

    return (
      <Slider
        {...this.sliderSettings}
        afterChange={this.handleAfterChange}
        className='SlideFetcher'>
        {children}
        <div key='ProductPlaceholder'>
          <Placeholder style={{ width: 231, height: 341 }} />
        </div>
      </Slider>
    )
  }
}

export default SlideFetcher
