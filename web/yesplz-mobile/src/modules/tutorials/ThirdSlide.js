import React from 'react'
import PropTypes from 'prop-types'
import { SlideImage } from '@yesplz/core-web/modules/sliders'
import TutorialItem from './TutorialItem'
// image sources
import TutorialImage3a from './images/yesplz-3-a.png'
import TutorialImage3aAt2x from './images/yesplz-3-a@2x.png'
import TutorialImage3aAt3x from './images/yesplz-3-a@3x.png'
import TutorialImage3b from './images/yesplz-3-b.png'
import TutorialImage3bAt2x from './images/yesplz-3-b@2x.png'
import TutorialImage3bAt3x from './images/yesplz-3-b@3x.png'
import TutorialImage3c from './images/yesplz-3-c.png'
import TutorialImage3cAt2x from './images/yesplz-3-c@2x.png'
import TutorialImage3cAt3x from './images/yesplz-3-c@3x.png'

const ThirdSlide = ({ activeIndex, onBeforeStart, onFinish }) => (
  activeIndex !== 2 ? null : (
    <TutorialItem
      title='Tap'
      subtitle='any parts you want to customize. We find the items for you. Enjoy!'
    >
      <SlideImage
        imageSources={[
          {
            src: TutorialImage3a,
            srcset: `${TutorialImage3aAt2x} 2x, ${TutorialImage3aAt3x} 3x`
          },
          {
            src: TutorialImage3b,
            srcset: `${TutorialImage3bAt2x} 2x, ${TutorialImage3bAt3x} 3x`
          },
          {
            src: TutorialImage3c,
            srcset: `${TutorialImage3cAt2x} 2x, ${TutorialImage3cAt3x} 3x`
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

ThirdSlide.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  onBeforeStart: PropTypes.func,
  onFinish: PropTypes.func
}

ThirdSlide.defaultProps = {
  onBeforeStart: () => {},
  onFinish: () => {}
}

export default ThirdSlide
