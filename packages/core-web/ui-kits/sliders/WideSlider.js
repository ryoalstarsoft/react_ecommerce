import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Carousel from 'nuka-carousel'
import flatten from 'lodash/flatten'
import debounce from 'lodash/debounce'
import SliderNav from './SliderNav'
import LeftArrowSvg from './carousel-arrow-left.svg'
import RightArrowSvg from './carousel-arrow-right.svg'
import './WideSlider.scss'

class WideSlider extends Component {
  static propTypes = {
    children: PropTypes.any,
    transitionSpeed: PropTypes.number
  }

  static defaultProps = {
    transitionSpeed: 500
  }

  constructor (props) {
    super(props)
    this.state = {
      slideIndex: 2
    }
    this.handlePreviousSlide = debounce(this.handlePreviousSlide.bind(this), props.transitionSpeed, { leading: true, trailing: false })
    this.handleNextSlide = debounce(this.handleNextSlide.bind(this), props.transitionSpeed, { leading: true, trailing: false })
    this.goToSlide = debounce(this.goToSlide.bind(this), props.transitionSpeed, { leading: true, trailing: false })
  }

  handlePreviousSlide (slideIndex) {
    if (slideIndex > 0) {
      this.setState({
        slideIndex: slideIndex - 1
      })
    }
  }

  handleNextSlide (slideIndex) {
    const { children } = this.props

    if (slideIndex < flatten(children).length - 1) {
      this.setState({
        slideIndex: slideIndex + 1
      })
    }
  }

  goToSlide (slideIndex) {
    this.setState({ slideIndex })
  }

  manageChildren () {
    const { children } = this.props
    const { slideIndex } = this.state

    return React.Children.map(children, (child, index) => (
      React.cloneElement(child, {
        className: child.props.className + ' ' + getItemClass(slideIndex, index),
        onClick: () => {
          this.goToSlide(index)
        }
      })
    ))
  }

  render () {
    const { transitionSpeed } = this.props
    const { slideIndex } = this.state
    const managedChildren = this.manageChildren()

    return (
      <Carousel
        slideIndex={slideIndex}
        speed={transitionSpeed}
        renderCenterLeftControls={({ currentSlide }) => (
          <SliderNav icon={LeftArrowSvg} slideIndex={currentSlide} onClick={this.handlePreviousSlide} />
        )}
        renderCenterRightControls={({ currentSlide }) => (
          <SliderNav icon={RightArrowSvg} slideIndex={currentSlide} onClick={this.handleNextSlide} />
        )}
        className='WideSlider'
        {...sliderSettings}
      >
        {managedChildren}
      </Carousel>
    )
  }
}

const getItemClass = (slideIndex, currentIndex) => {
  if (slideIndex === currentIndex) {
    return 'is-center'
  } else if (slideIndex - 1 === currentIndex) {
    return 'is-center-left'
  } else if (slideIndex + 1 === currentIndex) {
    return 'is-center-right'
  } else {
    return ''
  }
}

const sliderSettings = {
  slidesToShow: 5,
  slidesToScroll: 1,
  cellAlign: 'center',
  framePadding: '20px'
}

export default WideSlider
