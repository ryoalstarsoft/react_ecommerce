import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import times from 'lodash/times'
import './SliderDots.scss'

const SliderDots = ({ currentSlide, slideCount, style, goToSlide }) => (
  <div className='SliderDots' style={style}>
    {
      times(slideCount, (index) => (
        <div
          key={index}
          className={classNames('SliderDots-item', { 'is-active': currentSlide === index })}
          onClick={() => { goToSlide(index) }}
        />
      ))
    }
  </div>
)

SliderDots.propTypes = {
  currentSlide: PropTypes.number.isRequired,
  slideCount: PropTypes.number.isRequired,
  style: PropTypes.object,
  goToSlide: PropTypes.func.isRequired
}

export default SliderDots
