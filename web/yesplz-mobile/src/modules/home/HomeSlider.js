import React from 'react'
import PropTypes from 'prop-types'

import { HeroSlider } from '../../ui-kits/sliders'
import { CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS } from '@yesplz/core-web/config/constants'

// slide images
import SliderTopsImage from './images/slider-tops-home.png'
import SliderPantsImage from './images/slider-pants-home.png'
import SliderShoesImage from './images/slider-shoes-home.png'

import ArrowLine from '@yesplz/core-web/ui-kits/icons/ArrowLine'

const NextArrow = ({ onClick }) => (
  <button onClick={onClick} className='HeroSlider-button'>
    <ArrowLine />
  </button>
)

NextArrow.propTypes = {
  onClick: PropTypes.func
}

const HomeSlider = ({ onClickSlideItem }) => (
  <HeroSlider>
    <div style={{ backgroundImage: `url(${SliderTopsImage})` }}>
      <h4>Tops</h4>
      <p>Tops for your day to day or special occasions</p>
      <NextArrow onClick={onClickSlideItem(CATEGORY_TOPS)} />
    </div>
    <div style={{ backgroundImage: `url(${SliderPantsImage})` }}>
      <h4>Pants</h4>
      <p>Pants for your day to day or special occasions</p>
      <NextArrow onClick={onClickSlideItem(CATEGORY_PANTS)} />
    </div>
    <div style={{ backgroundImage: `url(${SliderShoesImage})` }}>
      <h4>Shoes</h4>
      <p>Shoes for your day to day or special occasions</p>
      <NextArrow onClick={onClickSlideItem(CATEGORY_SHOES)} />
    </div>
  </HeroSlider>
)

HomeSlider.propTypes = {
  onClickSlideItem: PropTypes.func
}

export default HomeSlider
