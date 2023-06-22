import React, { PureComponent, Fragment } from 'react'
import Carousel from 'nuka-carousel'
import { SliderDots } from '@yesplz/core-web/modules/sliders'
import history from '@yesplz/core-web/config/history'
import ArrowLine from '@yesplz/core-web/ui-kits/icons/ArrowLine'
import noop from '@yesplz/core-web/utils/noop'
import { Button } from '@yesplz/core-web/ui-kits/buttons'

// slides
import FirstSlide from './FirstSlide'
import SecondSlide from './SecondSlide'
import ThirdSlide from './ThirdSlide'

import './Tutorial.scss'

class Tutorial extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      currentSlide: 0,
      disableNext: false
    }

    this.handleSlideNext = this.handleSlideNext.bind(this)
    this.handleSlideTo = this.handleSlideTo.bind(this)
    this.handleFinish = this.handleFinish.bind(this)
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

  handleFinish () {
    history.push('/')
  }

  disableNext () {
    this.setState({
      disableNext: true
    })
  }

  allowNext () {
    this.setState({
      disableNext: false
    })
  }

  render () {
    const { currentSlide } = this.state

    return (
      <div className='Tutorial'>
        <div className='Tutorial-main'>
          <div className='container'>
            <Carousel
              slideIndex={currentSlide}
              renderCenterLeftControls={noop}
              renderCenterRightControls={noop}
              renderBottomCenterControls={noop}
              dragging={Boolean(false)}
              swiping={Boolean(false)}
            >
              <FirstSlide activeIndex={currentSlide} />
              <SecondSlide
                activeIndex={currentSlide}
                onBeforeStart={this.disableNext}
                onFinish={this.allowNext}
              />
              <ThirdSlide
                activeIndex={currentSlide}
                onBeforeStart={this.disableNext}
                onFinish={this.allowNext}
              />
            </Carousel>
            <SliderDots
              currentSlide={currentSlide}
              slideCount={3}
              goToSlide={this.handleSlideTo}
              style={{ margin: '3.69vh auto' }}
            />
          </div>
        </div>
        <div className='Tutorial-footer'>
          {
            currentSlide === 2 ? (
              <Button
                kind='secondary'
                // disabled={disableNext}
                style={styles.buttonStyle}
                onClick={this.handleFinish}>
                Explore
              </Button>
            ) : (
              <Fragment>
                <button className='Tutorial-skipButton' onClick={this.handleFinish}>
                Skip
                </button>
                <button className='Tutorial-nextButton' onClick={this.handleSlideNext}>
                  <ArrowLine color='#FFFFFF' />
                </button>
              </Fragment>
            )
          }
        </div>
      </div>
    )
  }
}

const styles = {
  buttonStyle: {
    width: 'calc(100% - 60px)',
    marginBottom: 27
  }
}

export default Tutorial
