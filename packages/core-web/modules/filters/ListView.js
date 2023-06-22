import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './ListView.scss'

const ListView = ({ colType, onChange }) => {
  const makeClickHandler = (colType) => () => {
    onChange(colType)
  }

  return (
    <div className='ListView'>
      <div
        onClick={makeClickHandler('single')}
        className={classNames('ListView-option ListView-oneCol', { 'is-active': colType === 'single' })}
      />
      <div
        onClick={makeClickHandler('double')}
        className={classNames('ListView-option ListView-twoCols', { 'is-active': colType === 'double' })}
        style={{ marginLeft: 24 }}
      />
    </div>
  )
}

ListView.propTypes = {
  colType: PropTypes.oneOf(['single', 'double']),
  onChange: PropTypes.func.isRequired
}

export default ListView
