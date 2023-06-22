import React from 'react'
import PropTypes from 'prop-types'
import { TitleHeader } from '../title-headers'

import './ProfileBanner.scss'

const firstWord = word => word ? word[0] : ''

const ProfileBanner = ({ firstName, lastName, imageUrl }) => (
  <div className='ProfileBanner'>
    <TitleHeader>
      <div className='Box'>
        <div className='avatar'>
          {
            imageUrl
              ? <img src={imageUrl} alt='User profile avatar' />
              : <span className='avatar--null'>{firstWord(firstName)}{firstWord(lastName)}</span>
          }
        </div>
        <span className='fullname'>{firstName} {lastName}</span>
      </div>
    </TitleHeader>
  </div>
)

ProfileBanner.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  imageUrl: PropTypes.string
}

ProfileBanner.defaultProps = {
  firstName: 'Rebecca',
  lastName: 'Johnson',
  imageUrl: null
}

export default ProfileBanner
