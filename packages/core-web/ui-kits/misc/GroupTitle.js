import React from 'react'
import PropTypes from 'prop-types'
import ArrowLine from '../icons/ArrowLine'
import './GroupTitle.scss'

const GroupTitle = ({ children, onClickTitle }) => (
  <h4 onClick={onClickTitle} className='GroupTitle'>{children} <ArrowLine width='20px' height='20px' /></h4>
)

GroupTitle.propTypes = {
  children: PropTypes.string.isRequired,
  onClickTitle: PropTypes.func
}

GroupTitle.defaultProps = {
  onClickTitle () {
    console.log('click arrow')
  }
}

export default GroupTitle
