import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tutorial } from '../modules/tutorials'

export default () => WrappedComponent => {
  class TutorialHOC extends PureComponent {
    static propTypes = {
      onboarding: PropTypes.bool.isRequired
    }

    constructor (props) {
      super(props)
      this.state = {
        tutorialActive: true
      }
      this.handleTutorialFinish = this.handleTutorialFinish.bind(this)
    }

    handleTutorialFinish () {
      this.setState({
        tutorialActive: false
      })
    }

    render () {
      const { onboarding } = this.props
      const { tutorialActive } = this.state

      if (onboarding && tutorialActive) {
        return <Tutorial onFinish={this.handleTutorialFinish} />
      }
      return <WrappedComponent />
    }
  }

  const mapStateToProps = state => ({
    onboarding: state.filters.onboarding
  })

  return connect(mapStateToProps)(TutorialHOC)
}
