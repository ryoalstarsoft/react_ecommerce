import React from 'react'
import PropTypes from 'prop-types'
import './TutorialItem.scss'

const TutorialItem = ({ children, title, subtitle }) => (
  <div className='TutorialItem'>
    <div className='TutorialItem-imageWrapper'>
      {children}
    </div>
    <div className='TutorialItem-content'>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  </div>
)

TutorialItem.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired
}

export default TutorialItem
