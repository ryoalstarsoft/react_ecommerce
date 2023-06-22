/**
 * enhance react component with isFocus props.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default initialFocus => WrappedComponent => {
  return class extends Component {
    static propTypes = {
      onFocusChange: PropTypes.func
    }

    static defaultProps = {
      onFocusChange: (isFocus) => {}
    }

    constructor (props) {
      super(props)
      this.state = {
        isFocus: initialFocus || false
      }

      this.checkFocusEvent = this.checkFocusHandler
    }

    componentDidMount () {
      document.addEventListener('click', this.checkFocusEvent)
      document.addEventListener('touchstart', this.checkFocusEvent)
    }

    componentDidUpdate (_, prevState) {
      // call `onFocusChange`, when `isFocus` state is changed
      if (prevState.isFocus.toString() !== this.state.isFocus.toString()) {
        this.props.onFocusChange(this.state.isFocus)
      }
    }

    componentWillUnmount () {
      document.removeEventListener('click', this.checkFocusEvent)
      document.removeEventListener('touchstart', this.checkFocusEvent)
    }

    get checkFocusHandler () {
      return (event) => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
          this.setState({
            isFocus: false
          })
        } else {
          this.setState({
            isFocus: true
          })
        }
      }
    }

    get setWrapperRef () {
      return (node) => {
        this.wrapperRef = node
      }
    }

    render () {
      return (
        <div ref={this.setWrapperRef}>
          <WrappedComponent {...this.props} isFocus={this.state.isFocus} />
        </div>
      )
    }
  }
}
