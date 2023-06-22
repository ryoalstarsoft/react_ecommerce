import React from 'react'
import PropTypes from 'prop-types'
import './section-title.css'

const SectionTitle = ({ title, subtitle, style, titleStyle, small, onClick }) => (
  <div onClick={onClick} className={`SectionTitle ${small ? 'small' : ''}`} style={style}>
    <div className='container-wide'>
      <h3 style={titleStyle}>{title}</h3>
      <p>{subtitle}</p>
    </div>
  </div>
)

SectionTitle.propTypes = {
  title: PropTypes.string,
  small: PropTypes.bool,
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  style: PropTypes.object,
  titleStyle: PropTypes.object,
  onClick: PropTypes.func
}
SectionTitle.defaultProps = {
  onClick () { }
}

export default SectionTitle
