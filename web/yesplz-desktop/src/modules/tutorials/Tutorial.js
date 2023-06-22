import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Carousel from 'nuka-carousel'
import TutorialItem from './TutorialItem'
import { SlideImage, SliderDots } from '@yesplz/core-web/modules/sliders'

// image sources
import TutorialImage1 from './images/yesplz-tutorial-1.svg'
import TutorialImage2a from './images/yesplz-tutorial-2a.svg'
import TutorialImage2b from './images/yesplz-tutorial-2b.svg'
import TutorialImage2c from './images/yesplz-tutorial-2c.svg'
import TutorialImage3a from './images/yesplz-tutorial-3a.svg'
import TutorialImage3b from './images/yesplz-tutorial-3b.svg'
import TutorialImage3c from './images/yesplz-tutorial-3c.svg'

import './Tutorial.scss'

class Tutorial extends PureComponent {
  static propTypes = {
    onFinish: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      currentSlide: 0,
      preventNext: false
    }
    this.handleSlideNext = this.handleSlideNext.bind(this)
    this.handleSlideTo = this.handleSlideTo.bind(this)
    this.disableNext = this.disableNext.bind(this)
    this.allowNext = this.allowNext.bind(this)
  }

  handleSlideNext () {
    const { currentSlide } = this.state
    this.setState({ currentSlide: currentSlide + 1 })
  }

  handleSlideTo (slideIndex) {
    this.setState({ currentSlide: slideIndex })
  }

  disableNext () {
    this.setState({
      preventNext: true
    })
  }

  allowNext () {
    this.setState({
      preventNext: false
    })
  }

  render () {
    const { onFinish } = this.props
    const { currentSlide, preventNext } = this.state

    const sliderDots = (
      <SliderDots
        currentSlide={currentSlide}
        slideCount={3}
        goToSlide={this.handleSlideTo}
        style={{ margin: '70px auto' }}
      />
    )

    return (
      <div className='Tutorial'>
        <div className='container'>
          <Carousel
            slideIndex={currentSlide}
            renderCenterLeftControls={noop}
            renderCenterRightControls={noop}
            renderBottomCenterControls={noop}
          >
            <TutorialItem
              title='Hello.'
              subtitle='meet your smart filter'
              image={(
                <SlideImage
                  imageSources={[
                    TutorialImage1
                  ]}
                />
              )}
              content={(
                <React.Fragment>
                  {sliderDots}
                  <button className='TutorialItem-primaryButton' onClick={onFinish}>Skip</button>
                  <button className='TutorialItem-secondaryButton' onClick={this.handleSlideNext}>OK</button>
                </React.Fragment>
              )}
            />
            <TutorialItem
              title='Click'
              subtitle='the smart filter button.'
              image={currentSlide === 1 ? (
                <SlideImage
                  imageSources={[
                    TutorialImage2a,
                    TutorialImage2b,
                    TutorialImage2c
                  ]}
                  repeatedTimes={2}
                  beforeStart={this.disableNext}
                  onFinish={this.allowNext}
                />
              ) : null}
              content={(
                <React.Fragment>
                  {sliderDots}
                  <button
                    className='TutorialItem-primaryButton'
                    disabled={preventNext}
                    onClick={this.handleSlideNext}>
                    Next
                  </button>
                </React.Fragment>
              )}
            />
            <TutorialItem
              title='Tap'
              subtitle='any parts you want to customize. We bring the matching items. '
              image={currentSlide === 2 ? (
                <SlideImage
                  imageSources={[
                    TutorialImage3a,
                    TutorialImage3b,
                    TutorialImage3c
                  ]}
                  repeatedTimes={2}
                  beforeStart={this.disableNext}
                  onFinish={this.allowNext}
                />
              ) : null}
              content={(
                <React.Fragment>
                  {sliderDots}
                  <button
                    className='TutorialItem-primaryButton'
                    disabled={preventNext}
                    onClick={onFinish}>
                    Finish
                  </button>
                </React.Fragment>
              )}
            />
          </Carousel>
        </div>
      </div>
    )
  }
}

const noop = () => null

export default Tutorial
