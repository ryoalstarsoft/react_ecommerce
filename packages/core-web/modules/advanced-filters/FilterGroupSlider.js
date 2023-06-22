import React from 'react'
import Slider from 'react-slick'
import PropTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import AngleLeft from '@yesplz/core-web/assets/svg/angle-left.svg'
import AngleRight from '@yesplz/core-web/assets/svg/angle-right.svg'
import './FilterGroupSlider.scss'

class FilterGroupSlider extends React.Component {
  static propTypes = {
    itemKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeKey: PropTypes.string.isRequired,
    children: PropTypes.any
  }

  constructor (props) {
    super(props)
    this.slider = React.createRef()
  }

  get sliderSettings () {
    const { itemKeys, activeKey } = this.props

    return {
      initialSlide: itemKeys.indexOf(activeKey),
      dots: false,
      arrows: true,
      infinite: false,
      swipe: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PreviousArrow />
    }
  }

  componentDidUpdate (prevProps) {
    const { activeKey } = this.props
    if (activeKey !== prevProps.activeKey) {
      const nextSlideIndex = this.props.itemKeys.indexOf(activeKey)
      this.slider.current.slickGoTo(nextSlideIndex)
    }
  }

  render () {
    const { children } = this.props

    return (
      <Slider ref={this.slider} {...this.sliderSettings} className='FilterGroupSlider'>
        {children}
      </Slider>
    )
  }
}

export const SliderItem = ({ children }) => (
  <PerfectScrollbar style={styles.sliderItem}>
    {children}
  </PerfectScrollbar>
)

SliderItem.propTypes = {
  children: PropTypes.element
}

const PreviousArrow = ({ onClick, className }) => (
  <div className={`FilterGroupSlider-prevButton ${className}`} onClick={onClick}>
    <img src={AngleLeft} alt='Previous' />
  </div>
)

PreviousArrow.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string
}

const NextArrow = ({ onClick, className }) => (
  <div className={`FilterGroupSlider-nextButton ${className}`} onClick={onClick}>
    <img src={AngleRight} alt='Next' />
  </div>
)

NextArrow.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string
}

const styles = {
  sliderItem: {
    padding: '0 20px',
    width: '100%'
  }
}

export default FilterGroupSlider
