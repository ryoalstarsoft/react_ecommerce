import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

class ScrollToTop extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    children: PropTypes.any
  }

  componentDidUpdate (prevProps) {
    if (this.props.location !== prevProps.location) {
      setTimeout(() => {
        const warrapedElement = document.getElementById('MainScroll') ? document.getElementById('MainScroll') : document.getElementById('Base-desktop')
        warrapedElement.scrollTo(0, 0)
      }, 200)
    }
  }

  render () {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)
