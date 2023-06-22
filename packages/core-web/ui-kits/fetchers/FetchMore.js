/**
 * FetchMore
 * to fetch more data when the component visible.
 * Note: always place this component after the component lists you want to fetch.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { DotLoader } from '@yesplz/core-web/ui-kits/loaders'

export default class FetchMore extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string,
    finished: PropTypes.bool,
    spinnerStyle: PropTypes.shape({}),
    onFetch: PropTypes.func
  }

  static defaultProps = {
    id: 'scroll-state',
    finished: false,
    spinnerStyle: {},
    // `onFetch` should be a Promise
    onFetch: () => (
      new Promise((resolve, reject) => {
        console.debug('Unhandled event of `onFetch` prop in `FetchMore`')
        resolve()
      })
    )
  }

  static isBottom (el) {
    return el.getBoundingClientRect().bottom - 50 <= window.innerHeight
  }

  constructor (props) {
    super(props)
    this.state = {
      isLoading: false
    }
  }

  componentDidMount () {
    if (process.env.REACT_APP_IS_MOBILE !== 'true') {
      document.addEventListener('scroll', this.trackScrolling)
    } else {
      const wrappedElement = document.getElementById('Base-mobile')
      wrappedElement.addEventListener('touchmove', this.trackScrolling)
    }
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this.trackScrolling)
  }

  trackScrolling = async () => {
    const { id, onFetch } = this.props
    const wrappedElement = document.getElementById(id)
    if (wrappedElement == null) {
      return
    }

    if (FetchMore.isBottom(wrappedElement)) {
      this.setState({ isLoading: true })
      try {
        await onFetch()
        this.setState({ isLoading: false })
      } catch (error) {
        console.error('Exception on `FetchMore.trackScrolling`', error)
      }
    }
  }

  render () {
    const {
      id, finished, spinnerStyle
    } = this.props
    const { isLoading } = this.state

    if (finished) {
      return null
    }

    if (isLoading) {
      return <DotLoader visible style={spinnerStyle} />
    }

    return (
      <div id={id} />
    )
  }
}
