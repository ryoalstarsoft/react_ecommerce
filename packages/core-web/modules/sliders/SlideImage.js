import React, { PureComponent } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import isObject from 'lodash/isObject'
import delay from '@yesplz/core-web/utils/delay'
import './SlideImage.scss'

const { Image } = window

class SlideImage extends PureComponent {
  static propTypes = {
    imageSources: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string,
        srcset: PropTypes.string
      }))
    ]),
    duration: PropTypes.number, // duration for each image displayed
    infinite: PropTypes.bool,
    repeatedTimes: PropTypes.number,
    noAnimation: PropTypes.bool,
    beforeStart: PropTypes.func, // before starting the image animation
    onFinish: PropTypes.func // when touched the end of the image
  }

  static defaultProps = {
    imageSources: [],
    duration: 1000,
    infinite: false,
    repeatedTimes: 1,
    noAnimation: false,
    beforeStart: () => {},
    onFinish: () => {}
  }

  constructor (props) {
    super(props)
    this.state = {
      imageIndex: 0
    }
    this.repeatedTimes = props.repeatedTimes
    this.imageRef = React.createRef()
    this.delayPromise = null
  }

  async componentDidMount () {
    const { imageSources, beforeStart } = this.props
    beforeStart()

    this.imageRef.current.onload = () => {
      this.startAnimation()
    }

    // load the rest of the images in background
    imageSources.slice(1).forEach(imageSrc => {
      var tempImg = new Image()
      tempImg.src = isObject(imageSrc) ? imageSrc.src : imageSrc
    })
  }

  componentWillUnmount () {
    // cancel delayed update
    if (this.delayPromise) {
      this.delayPromise.cancel()
    }
  }

  async startAnimation () {
    const { imageSources, duration } = this.props

    // start animation
    for (let x = 0; x < imageSources.slice(1).length; x++) {
      // add delay / duration for each image
      await (this.delayPromise = delay(duration))

      const { imageIndex } = this.state
      this.setState({
        imageIndex: imageIndex + 1
      }, () => {
        this.handleFinish()
      })
    }
  }

  async handleFinish (index) {
    const { imageSources, duration, infinite, onFinish } = this.props
    const { imageIndex } = this.state

    if (imageIndex === imageSources.length - 1) {
      this.repeatedTimes = this.repeatedTimes - 1

      await (this.delayPromise = delay(duration))

      if (infinite) {
        // reset index
        this.setState({
          imageIndex: 0
        })
        // restart image cycle
        this.startAnimation()
      } else if (this.repeatedTimes > 0) {
        // reset index
        this.setState({
          imageIndex: 0
        })
        // restart image cycle
        this.startAnimation()
      }

      // trigger onFinish after animation ended
      if (this.repeatedTimes === 0) {
        onFinish()
      }
    }
  }

  render () {
    const { imageSources, noAnimation } = this.props
    const { imageIndex } = this.state

    const imageSource = imageSources[imageIndex]
    const sourceIsObject = isObject(imageSource)
    const imgSrc = sourceIsObject ? imageSource.src : imageSource
    const imgSet = sourceIsObject ? imageSource.srcset : null

    return (
      <div className={classNames('SlideImage has-multiple-images', { 'no-animation': noAnimation })}>
        <ReactCSSTransitionGroup
          transitionName='fade'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          <img
            src={imgSrc}
            srcSet={imgSet}
            key={imageIndex}
            alt='Yesplz Tutorial'
            ref={this.imageRef}
          />
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default SlideImage
