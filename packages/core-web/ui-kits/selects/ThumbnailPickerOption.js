import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import CheckSvg from '../../assets/svg/check.svg'
import './ThumbnailPickerOption.scss'

const ThumbnailPickerOption = ({
  value, label, children, isActive, style, thumbnailStyle, onClick
}) => (
  <div className={classNames('ThumbnailPickerOption', { 'is-active': isActive })} style={style} onClick={() => onClick(value)}>
    <div className='ThumbnailPickerOption-thumbnail' style={thumbnailStyle}>
      <div className='ThumbnailPickerOption-imageWrapper'>
        {children}
        {isActive && <img src={CheckSvg} alt='Picker Selected' className='ThumbnailPickerOption-thumbnailSelectedIcon' />}
      </div>
    </div>
    <h5>{label}</h5>
  </div>
)

ThumbnailPickerOption.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  style: PropTypes.object,
  thumbnailStyle: PropTypes.object,
  isActive: PropTypes.bool,
  /**
   * selectThenRemove
   * value of other option (siblings) that will be removed after selecting this option
   * only works for multiple values
   */
  selectThenRemove: PropTypes.string,
  onClick: PropTypes.func
}

export default ThumbnailPickerOption
