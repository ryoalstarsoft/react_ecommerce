import React from 'react'
import PropTypes from 'prop-types'
import { SlideImage } from '@yesplz/core-web/modules/sliders'
import TutorialItem from './TutorialItem'
// image sources
import TutorialImage2a from './images/yesplz-2-a-mobile.png'
import TutorialImage2aAt2x from './images/yesplz-2-a-mobile@2x.png'
import TutorialImage2aAt3x from './images/yesplz-2-a-mobile@3x.png'
import TutorialImage2b from './images/yesplz-2-b-mobile.png'
import TutorialImage2bAt2x from './images/yesplz-2-b-mobile@2x.png'
import TutorialImage2bAt3x from './images/yesplz-2-b-mobile@3x.png'
import TutorialImage2c from './images/yesplz-2-c-mobile.png'
import TutorialImage2cAt2x from './images/yesplz-2-c-mobile@2x.png'
import TutorialImage2cAt3x from './images/yesplz-2-c-mobile@3x.png'

const SecondSlide = ({ activeIndex, onBeforeStart, onFinish }) => (
  activeIndex !== 1 ? null : (
    <TutorialItem
      title='Click'
      subtitle='the smart filter button'
    >
      <SlideImage
        imageSources={[
          {
            src: TutorialImage2a,
            srcset: `${TutorialImage2aAt2x} 2x, ${TutorialImage2aAt3x} 3x`
          },
          {
            src: TutorialImage2b,
            srcset: `${TutorialImage2bAt2x} 2x, ${TutorialImage2bAt3x} 3x`
          },
          {
            src: TutorialImage2c,
            srcset: `${TutorialImage2cAt2x} 2x, ${TutorialImage2cAt3x} 3x`
          }
        ]}
        repeatedTimes={2}
        beforeStart={onBeforeStart}
        onFinish={onFinish}
        duration={700}
        noAnimation
      />
    </TutorialItem>
  )
)

SecondSlide.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  onBeforeStart: PropTypes.func,
  onFinish: PropTypes.func
}

SecondSlide.defaultProps = {
  onBeforeStart: () => {},
  onFinish: () => {}
}

export default SecondSlide
