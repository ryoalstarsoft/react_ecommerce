import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import { VisualFilter } from '@yesplz/core-models'
import { LikeButton } from '@yesplz/core-web/ui-kits/buttons'
import AdvancedFilter from '@yesplz/core-web/modules/advanced-filters/AdvancedFilter'
import AngleDownSvg from '@yesplz/core-web/assets/svg/angle-down.svg'
import './VisualFilterPanel.scss'

export default class VisualFilterPanel extends Component {
  static propTypes = {
    category: PropTypes.string.isRequired,
    filters: PropTypes.object,
    favorite: PropTypes.bool,
    lastBodyPart: PropTypes.string,
    className: PropTypes.string,
    onFilterChange: PropTypes.func,
    onFilterLike: PropTypes.func,
    onBodyPartChange: PropTypes.func,
    onFinishedOnboarding: PropTypes.func,
    onSetTutorial: PropTypes.func,
    debugTouchArea: PropTypes.bool,
    tutorialStep: PropTypes.number,
    onboarding: PropTypes.bool
  }

  static defaultProps = {
    filters: {},
    favorite: false,
    className: '',
    onFilterChange: (filters) => { console.debug('FilterPanel - filter changed', filters) },
    onFilterLike: (filters, favorite) => { console.debug('FilterPanel - filter like changed', filters, favorite) }
  }

  constructor(props) {
    super(props)
    this.state = {
      svgLoaded: false,
      advancedFilterVisible: false
    }
  }

  componentDidMount() {
    const { category, filters, debugTouchArea, lastBodyPart, onBodyPartChange, onFinishedOnboarding, tutorialStep, onboarding } = this.props
    // initialize visual filter
    this.visualFilter = new VisualFilter('#VisualFilter', {
      category: category,
      tutorialStep: tutorialStep,
      onboarding: onboarding,
      defaultState: filters,
      hideThumbnail: true,
      customViewBox: [15, -5, 280, 250],
      onFilterChange: this.handleBodyPartFilter,
      onPropChange: onBodyPartChange,
      onSVGLoaded: this.handleSVGLoaded,
      onFinishedOnboarding: onFinishedOnboarding,
      debugTouchArea: debugTouchArea
    })

    this.visualFilter.setLastBodyPart(lastBodyPart)
  }

  componentDidUpdate(prevProps, prevState) {
    const { filters, lastBodyPart } = this.props
    const { svgLoaded } = this.state
    if (!isEqual(svgLoaded, prevState.svgLoaded) || !isEqual(filters, prevProps.filters)) {
      this.visualFilter.updateState(filters)
    }
    // when body part changed update visual filter lastBodyPart
    if (lastBodyPart !== prevProps.lastBodyPart) {
      this.visualFilter.setLastBodyPart(lastBodyPart)
    }
  }

  get handleSVGLoaded() {
    return () => {
      this.setState({
        svgLoaded: true
      })
    }
  }

  get fabricFilters() {
    const { details, pattern, solid, color } = this.props.filters
    return { details, pattern, solid, color }
  }

  get handleBodyPartFilter() {
    return (bodyPartFilters, userClick = false) => {
      const { filters, onFilterChange } = this.props
      onFilterChange({ ...filters, ...bodyPartFilters }, userClick)
    }
  }

  get handleAdvancedFilter() {
    const { filters, onFilterChange } = this.props
    return (advancedFilters) => {
      onFilterChange({ ...filters, ...advancedFilters }, true)
    }
  }

  toggleLike = (e) => {
    const { filters, onFilterLike, favorite, onboarding, tutorialStep } = this.props
    if (onboarding && tutorialStep === 5) {
      console.log('hererer')
      this.visualFilter.handleOnboardingFinished(true)
    }
    e.preventDefault()
    e.stopPropagation()
    onFilterLike(filters, !favorite)
  }

  get toggleAdvancedFilter() {
    return () => {
      const { onboarding, onSetTutorial } = this.props
      if (onboarding) {
        onSetTutorial(3)
      }
      const { advancedFilterVisible } = this.state
      this.setState({
        advancedFilterVisible: !advancedFilterVisible
      })
    }
  }

  get handleBodyPartChange() {
    return (bodyPart) => {
      const { filters, onBodyPartChange } = this.props

      this.visualFilter.removeHighlight()
      onBodyPartChange(bodyPart)
      this.visualFilter.setLastBodyPart(bodyPart)
      this.visualFilter.changePropSelection(bodyPart, filters[bodyPart])
      this.visualFilter.highlightGroup(this.visualFilter.catdata.getBodyPartGroupName(bodyPart))
    }
  }

  render() {
    const { filters, favorite, category, lastBodyPart, className, onboarding, tutorialStep } = this.props
    const { advancedFilterVisible } = this.state

    return (
      <div className={`VisualFilterPanel ${className}`}>
        {
          onboarding && tutorialStep < 3 && <div className='overlay' />
        }
        <div className='VisualFilterPanel-vfWrapper'>
          <LikeButton active={favorite} onClick={this.toggleLike} />
          <svg id='VisualFilter' />
        </div>
        {
          !advancedFilterVisible && (
            <button className='AdvancedFilterToggle' onClick={this.toggleAdvancedFilter} style={{ marginTop: -16, position: 'relative', zIndex: 10 }}>
              Advanced filter
              <img src={AngleDownSvg} alt='Angle Down' />
            </button>
          )
        }
        {
          advancedFilterVisible && (
            <AdvancedFilter
              category={category}
              filters={filters}
              lastBodyPart={lastBodyPart}
              config={get(this.visualFilter, 'catdata.catcfg')}
              onChange={this.handleAdvancedFilter}
              onBodyPartChange={this.handleBodyPartChange}
              style={{ marginTop: -36, position: 'relative', zIndex: 2 }}
            />
          )
        }
      </div>
    )
  }
}
