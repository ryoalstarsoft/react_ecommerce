import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import reduce from 'lodash/reduce'
import isEqual from 'lodash/isEqual'
import DotLoader from '../loaders/DotLoader'
import { ButtonSeparator } from '../buttons'

class ScrollFetcher extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isFetchingData: false
    }
    this.prevTopScroll = true
    this.scrollCheckTimeout = null
  }

  componentDidMount () {
    if (!this.props.disableInitalFetch) {
      this.checkScrollOnMount()
    }
  }

  componentDidUpdate (prevProps) {
    if (!isEqual(prevProps.children, this.props.children) && !this.props.disableInitalFetch) {
      this.checkScrollOnMount()
    }
  }

  componentWillUnmount () {
    if (!this.scrollCheckTimeout) {
      clearTimeout(this.scrollCheckTimeout)
    }
  }

  checkScrollOnMount () {
    // This function will check whether the container has a scroll or not.
    // If not, then we need to do a fetch to fill more items.
    // We need the scroll to be available, so onScroll callback can be triggered.
    this.scrollCheckTimeout = setTimeout(() => { // need to have setTimeout, waiting for this component to complete rendering
      const scrollFetcher = this.scrollFetcher
      if (scrollFetcher) {
        const contentHeight = reduce((scrollFetcher.children), (totalHeight, child) => (totalHeight + child.clientHeight), 0)
        // This will check whether the container has scroll or not
        if (scrollFetcher.offsetHeight > contentHeight) { // container doesn't has scroll
          this.handleFetch() // do fetch
        }
      }
    }, 100)
  }

  get handleFetch () {
    const { onFetch } = this.props
    return () => {
      this.setState({
        isFetchingData: true
      })
      onFetch(() => {
        this.setState({
          isFetchingData: false
        })
      })
    }
  }

  get handleScrollFrame () {
    const { offsetScroll, onScroll, useButton } = this.props
    const { isFetchingData } = this.state
    return (e) => {
      if (useButton) {
        return false
      }

      const currentTarget = e.currentTarget
      const top = currentTarget.scrollTop + currentTarget.offsetHeight
      onScroll(top)
      // onScrollDown && scroll space left is <= offsetScroll, load next post if no previous request is still running
      if (this.prevTopScroll < top && currentTarget.scrollHeight - top <= offsetScroll && !isFetchingData) {
        this.handleFetch()
      }
      this.prevTopScroll = top
    }
  }

  get handleTouchMove () {
    const { onTouchMove, useButton } = this.props
    return (e) => {
      if (useButton) {
        return false
      }

      const currentTarget = e.currentTarget
      const top = currentTarget.scrollTop + currentTarget.offsetHeight

      onTouchMove(top)
    }
  }

  get loadRef () {
    return (element) => {
      this.scrollFetcher = element
    }
  }

  render () {
    const { id, useButton, className, style } = this.props
    const { isFetchingData } = this.state

    return (
      <div id={id} ref={this.loadRef} className={className} onScroll={this.handleScrollFrame} onTouchMove={this.handleTouchMove} style={{ ...styles.wrapper, ...style }}>
        {this.props.children}
        {
          useButton && !isFetchingData && (
            <React.Fragment>
              <ButtonSeparator label='Show More' onClick={this.handleFetch} style={styles.moreButton} />
              <div className='GoBack-link' >
                <Link to='/'>Back to HOME</Link>
              </div>
            </React.Fragment>
          )
        }
        <DotLoader visible={isFetchingData} style={{ ...styles.loader, ...(useButton ? styles.loaderSpace : {}) }} />
      </div>
    )
  }
}

ScrollFetcher.propTypes = {
  id: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string,
  style: PropTypes.object,
  disableInitalFetch: PropTypes.bool,
  useButton: PropTypes.bool,
  offsetScroll: PropTypes.number, // fetch will be triggered before touching this offset
  onFetch: PropTypes.func.isRequired,
  onScroll: PropTypes.func,
  onTouchMove: PropTypes.func
}

ScrollFetcher.defaultProps = {
  useButton: false,
  onFetch: (next) => { next() },
  onScroll: (top) => { },
  onTouchMove: (top) => { },
  className: '',
  style: {},
  disableInitalFetch: false,
  offsetScroll: window.innerHeight
}

const styles = {
  wrapper: {
    overflowY: 'scroll',
    overflowScrolling: 'touch',
    WebkitOverflowScrolling: 'touch'
  },
  loader: {
    width: '100%',
    flexBasis: '100%',
    order: 999 // place at the end
  },
  loaderSpace: {
    marginTop: 40,
    marginBottom: 100
  },
  moreButton: {
    // marginBottom: 100
  }
}

export default ScrollFetcher
