import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import Noop from '@yesplz/core-web/utils/noop'
import ArrowLine from '@yesplz/core-web/ui-kits/icons/ArrowLine'
import './HeroSlider.scss'

class HeroSlider extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    style: PropTypes.object
  }

  static defaultProps = {
    children: []
  }

  get sliderSettings () {
    return {
      dots: true,
      arrows: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 5000,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      // nextArrow: <NextArrow onClick={() => { console.log('click') }} />,
      leftArrow: <Noop />
    }
  }

  render () {
    const { children, style } = this.props

    return (
      <div className='HeroSlider' style={style}>
        <Slider {...this.sliderSettings}>
          {manageSlides(children)}
        </Slider>
      </div>
    )
  }
}

const NextArrow = ({ onClick }) => (
  <button onClick={onClick} className='HeroSlider-nextButton'>
    <ArrowLine />
  </button>
)

NextArrow.propTypes = {
  onClick: PropTypes.func
}

const manageSlides = (children = []) => (
  React.Children.map(children, child => (
    <div>
      {
        React.cloneElement(child, {
          className: 'HeroSlider-item',
          style: child.props.style
        })
      }
    </div>
  ))
)

export default HeroSlider
