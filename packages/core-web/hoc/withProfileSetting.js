/**
 * enhance react component with product like handler
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateSizes } from '@yesplz/core-redux/ducks/profile'

export default WrappedComponent => {
  class ProfileSettingHOC extends Component {
    static propTypes = {
      updateSizes: PropTypes.func.isRequired
    }

    updateSizes = sizes => {
      this.props.updateSizes(sizes)
    }

    render () {
      return <WrappedComponent
        {...this.props}
        updateSizes={this.updateSizes}
      />
    }
  }

  return connect(
    state => ({
      profile: state.profile
    }),
    { updateSizes })(ProfileSettingHOC)
}
