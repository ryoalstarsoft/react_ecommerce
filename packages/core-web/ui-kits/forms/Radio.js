import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './Radio.scss'

const Radio = ({ label, name, value, htmlFor, disabled, onChange }) => (
  <label htmlFor={htmlFor} className={classNames('YesplzRadio', { 'is-disabled': disabled })}>
    <input
      id={htmlFor}
      type='radio'
      name={name}
      onChange={(event) => {
        onChange(name, event.target.checked)
      }}
      checked={value}
      disabled={disabled}
    />
    <div
      className={
        classNames('YesplzRadio-mask', {
          'is-checked': value
        })
      } />
    {label}
  </label>
)

Radio.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.bool,
  htmlFor: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}

Radio.defaultProps = {
  value: false,
  indeterminate: false,
  onChange: (name, value) => { console.debug('Unhandled `onChange` prop of `Checkbox`', name, value) }
}

export default Radio
