import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import times from 'lodash/times'
import './TutorialSliderDots.scss'

const TutorialSliderDots = ({ currentSlide, slideCount, style, goToSlide }) => (
  <div className='TutorialSliderDots' style={style}>
    {
      times(slideCount, (index) => (
        <div
          key={index}
          className={classNames('TutorialSliderDots-item', { 'is-active': currentSlide === index })}
          onClick={() => { goToSlide(index) }}
        />
      ))
    }
  </div>
)

TutorialSliderDots.propTypes = {
  currentSlide: PropTypes.number.isRequired,
  slideCount: PropTypes.number.isRequired,
  style: PropTypes.object,
  goToSlide: PropTypes.func.isRequired
}

export default TutorialSliderDots
