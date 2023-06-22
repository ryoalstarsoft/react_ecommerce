import React from 'react'
import { SlideImage } from '@yesplz/core-web/modules/sliders'
import TutorialItem from './TutorialItem'
// image sources
import TutorialImage1 from './images/yesplz-1-mobile.png'
import TutorialImage1at2x from './images/yesplz-1-mobile@2x.png'
import TutorialImage1at3x from './images/yesplz-1-mobile@3x.png'

const FirstSlide = () => (
  <TutorialItem
    title='Hello'
    subtitle='meet your smart filter'
  >
    <SlideImage
      imageSources={[
        {
          src: TutorialImage1,
          srcset: `${TutorialImage1at2x} 2x, ${TutorialImage1at3x} 3x`
        }
      ]}
      noAnimation
    />
  </TutorialItem>
)

export default FirstSlide
