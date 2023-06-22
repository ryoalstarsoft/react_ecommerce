import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import './SingleSelect.scss'

class SingleSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { title, value, isSelected, YPonClick, isView } = this.props
    return (
      <div className='SingleSelect' onClick={YPonClick}>
        {
          title &&
          <div className='title'>{title}</div>
        }
        <div className={classnames('select', {
          'select--selected': isSelected,
          'select--not-selected': !isSelected,
          'select--is-view': isView
        })}>
          <span>{value}</span>
        </div>
      </div>
    )
  }
}

SingleSelect.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  isSelected: PropTypes.bool,
  isView: PropTypes.bool,
  YPonClick: PropTypes.func
}
SingleSelect.defaultProps = {
  value: 'select',
  isSelected: false,
  isView: false,
  YPonClick () { }
}

export default SingleSelect
