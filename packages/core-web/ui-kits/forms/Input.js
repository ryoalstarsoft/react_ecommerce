import React from 'react'
import PropTypes from 'prop-types'
// import classnames from 'classnames'
import './Input.scss'

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { type, label, name, customStyle } = this.props
    return (
      <div className='YesplzInput' style={{ ...customStyle }}>
        <label htmlFor='inp' className='inp'>
          <input type={type} id='inp' placeholder='&nbsp;' name={name} />
          <span className='label'>{label}</span>
          <span className='border' />
        </label>
      </div>
    )
  }
}

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  customStyle: PropTypes.object
}
Input.defaultProps = {
  type: 'text',
  label: 'TEXT',
  name: 'input',
  customStyle: {}
}
export default Input
