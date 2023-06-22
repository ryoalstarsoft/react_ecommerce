import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
import isNil from 'lodash/isNil'
import isEqual from 'lodash/isEqual'
import DemoArrowFirstSvg from './DemoArrowFirst.svg'
import DemoArrowSecondSvg from './DemoArrowSecond.svg'
import './BaseDemo.scss'

const DEMO_TUTORIAL_KEY = 'demo_tutorial_finished'
const { localStorage } = window

class BaseDemo extends Component {
  static propTypes = {
    children: PropTypes.element,
    activeCategory: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    lastBodyPart: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isTutorialActive: isNil(localStorage.getItem(DEMO_TUTORIAL_KEY)),
      tutorialStep: 0
    }
  }

  componentDidUpdate (prevProps) {
    const { filters, lastBodyPart } = this.props
    const { isTutorialActive, tutorialStep } = this.state

    if (isTutorialActive) {
      // if bodypart updated, change to step 2
      if (!isEqual(lastBodyPart, prevProps.lastBodyPart)) {
        this.setState({
          tutorialStep: 1
        })
      }

      // if filters changed on step 2, finish the tutorial
      if (tutorialStep === 1 && !isEqual(filters, prevProps.filters)) {
        console.debug('not equal')
        this.finishTutorial()
      }
    }
  }

  finishTutorial () {
    localStorage.setItem(DEMO_TUTORIAL_KEY, true)
    this.setState({
      isTutorialActive: false
    })
  }

  render () {
    const { children, activeCategory } = this.props
    const { isTutorialActive, tutorialStep } = this.state

    return (
      <div className={'BaseDemo'} key={activeCategory}>
        <div className={classNames('BaseDemo-header')}>
          <div className='container-wide Base-header-container'>
            <NavLink
              exact
              to='/'
              className='BaseDemo-logo'>
              YESPLZ <small>for {process.env.REACT_APP_RETAILER_NAME}</small>
            </NavLink>
          </div>
        </div>
        <div className='BaseDemo-content'>
          {children}
          {renderDemoTutorial(isTutorialActive, tutorialStep)}
        </div>
      </div>
    )
  }
}

const renderDemoTutorial = (isTutorialActive, tutorialStep) => {
  if (!isTutorialActive) {
    return null
  }
  return (
    <div className='BaseDemo-contentOverlay'>
      <div className='BaseDemo-contentOverlayInner'>
        <div className='BaseDemo-tutorialItemWrapper'>
          {
            tutorialStep === 0 && (
              <div className='BaseDemo-tutorialItem' style={{ top: 150 }}>
                <p>
                  Hi!<br />
                  Let’s tap on dimond buttons<br />
                  to change shoes design.
                </p>
                <img src={DemoArrowFirstSvg} className='BaseDemo-tutorialItemImage' />
              </div>
            )
          }
          {
            tutorialStep === 1 && (
              <div className='BaseDemo-tutorialItem' style={{ right: 50, top: 250 }}>
                <p>
                  Great! Now either tap the<br />
                  shoes or thumbnail to choose<br />
                  your styles.
                </p>
                <img src={DemoArrowSecondSvg} className='BaseDemo-tutorialItemImage' style={{ top: -40 }} />
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  activeCategory: state.products.activeCategory,
  filters: state.filters[state.products.activeCategory].data,
  lastBodyPart: state.filters.lastBodyPart
})

export default connect(mapStateToProps)(BaseDemo)
