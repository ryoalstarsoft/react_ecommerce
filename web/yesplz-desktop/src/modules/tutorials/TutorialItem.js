import React from 'react'
import PropTypes from 'prop-types'
import './TutorialItem.scss'

const TutorialItem = ({
  title, subtitle, image, content
}) => (
  <div className='TutorialItem'>
    {image}
    <div className='TutorialItem-content'>
      <h2>{title}</h2>
      <p className='TutorialItem-subtitle'>{subtitle}</p>
      <div style={{ maxWidth: '85%' }}>
        {content}
      </div>
    </div>
  </div>
)

TutorialItem.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  image: PropTypes.any,
  content: PropTypes.any
}

export default TutorialItem
