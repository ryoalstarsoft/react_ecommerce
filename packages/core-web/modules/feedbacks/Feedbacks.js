import React, { Component } from 'react'
import { FlatBanner } from '@yesplz/core-web/ui-kits/banners'
import instagramSvgSrc from '@yesplz/core-web/assets/svg/instagram.svg'
import './feedbacks.css'

class Feedbacks extends Component {
  render () {
    return (
      <div className='Feedbacks'>
        <FlatBanner style={styles.banner}>
          <div style={styles.bannerContent}>
            <h2>Tell us how we can do better!</h2>
            <p>
              <a href='mailto:hello@yesplz.us'>hello@yesplz.us</a>
              <a href='https://www.instagram.com/yesplz_fashion/' target='_blank' rel='noopener noreferrer' className='SocialLink'>
                Follow Us <img src={instagramSvgSrc} alt='Yesplz Instagram' />
              </a>
            </p>
          </div>
        </FlatBanner>
      </div>
    )
  }
}

export default Feedbacks

const styles = {
  banner: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 30
  },
  bannerContent: {
    textAlign: 'left'
  }
}
