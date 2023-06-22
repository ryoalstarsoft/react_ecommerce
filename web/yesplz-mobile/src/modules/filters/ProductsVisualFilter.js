import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import CloseSvg from '@yesplz/core-web/assets/svg/close-black.svg'
import { FloatButton } from '@yesplz/core-web/modules/filters'
import { isFilterSavedSelector } from '@yesplz/core-web/modules/filters/selectors'
import Transition from '@yesplz/core-web/ui-kits/transitions/Transition'
import { fetchProducts } from '@yesplz/core-redux/ducks/products'
import { setFilter, syncFilter, syncFavoritePresets, saveFilterAsPreset, deleteFilterFromPreset, setLastBodyPart, toggleVisualFilter, setOnboarding } from '@yesplz/core-redux/ducks/filters'
import { CUSTOM_PRESET_NAME, CATEGORIES_LABELS, CATEGORY_TOPS } from '@yesplz/core-web/config/constants'
import VisualFilterPanel from './VisualFilterPanel'
import ListView from './ListView'
import CategoryPicker from '../../ui-kits/navigations/CategoryPicker'
import './ProductsVisualFilter.scss'
import { withRouter } from 'react-router-dom'
import Arrow0 from '@yesplz/core-web/assets/svg/arrow-0.svg'
import Arrow1 from '@yesplz/core-web/assets/svg/arrow-1.svg'
import Arrow2 from '@yesplz/core-web/assets/svg/arrow-2.svg'
import { setStep } from '@yesplz/core-redux/ducks/tutorial-onboarding'

export class ProductsVisualFilter extends Component {
  static propTypes = {
    filters: PropTypes.object,
    isFilterSaved: PropTypes.bool,
    lastBodyPart: PropTypes.string,
    activeCategory: PropTypes.string,
    router: PropTypes.object,
    expanded: PropTypes.bool,
    hidden: PropTypes.bool,
    scrollBellowTheFold: PropTypes.bool,
    onboarding: PropTypes.bool,
    setFilter: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    syncFilter: PropTypes.func.isRequired,
    syncFavoritePresets: PropTypes.func.isRequired,
    saveFilterAsPreset: PropTypes.func.isRequired,
    deleteFilterFromPreset: PropTypes.func.isRequired,
    setLastBodyPart: PropTypes.func.isRequired,
    toggleVisualFilter: PropTypes.func.isRequired,
    setOnboarding: PropTypes.func.isRequired,
    setStep: PropTypes.func.isRequired,
    history: PropTypes.func,
    defaultColType: PropTypes.string,
    onColTypeChange: PropTypes.func,
    location: PropTypes.object,
    match: PropTypes.object,
    tutorialStep: PropTypes.number.isRequired
  }

  static defaultProps = {
    expanded: false,
    hidden: false,
    onboarding: false,
    defaultColType: 'signle'
  }

  constructor (props) {
    super(props)
    this.state = {
      isCategoryPickerVisible: false,
      colType: props.defaultColType,
      isClickAdvanceFilter: false
    }
    this.openCategoryPicker = this.openCategoryPicker.bind(this)
    this.closeCategoryPicker = this.closeCategoryPicker.bind(this)
  }

  componentDidMount () {
    const { syncFilter, syncFavoritePresets } = this.props
    syncFilter()
    syncFavoritePresets()
  }

  get handleFilterToggle () {
    const { expanded, toggleVisualFilter } = this.props
    if (expanded) {
        window.scrollTo(0, 0)
    }
    return () => {
      toggleVisualFilter(!expanded)
    }
  }

  onSearchPage = () => {
    const { match, setStep } = this.props
    setStep(2)
    const category = match.params.category || CATEGORY_TOPS
    this.props.history.push(`/products/${category}/list?listingView=double`)
    this.props.toggleVisualFilter(true)
  }

  get handleFilterChange () {
    const { match, setFilter, onboarding, tutorialStep, setStep } = this.props
    return (filters, userClick = false) => {
      // set filter to store
      if (onboarding && tutorialStep === 3 && userClick) {
        setStep(4)
      }
      if (onboarding && tutorialStep === 4 && userClick) {
        setStep(5)
      }
      setFilter(match.params.category, filters)
      // fetch products based selected filter
      // fetchProducts(undefined, undefined, undefined, true)
      // set wrapper scrolltop to 0
      document.documentElement.scrollTop = 0
    }
  }

  get isProductDetailPage () {
    const { router } = this.props
    return /^\/products\/([a-z])+\/.+/.test(router.location.pathname)
  }

  get handleFilterLike () {
    const { activeCategory, saveFilterAsPreset, deleteFilterFromPreset } = this.props
    return (filters, favorite) => {
      const filtersWithCategory = {
        ...filters,
        category: activeCategory
      }

      if (favorite) {
        saveFilterAsPreset(filtersWithCategory, CUSTOM_PRESET_NAME)
      } else {
        deleteFilterFromPreset(filtersWithCategory, CUSTOM_PRESET_NAME)
      }
    }
  }

  get handleBodyPartChange () {
    const { setLastBodyPart } = this.props
    return (bodyPart) => {
      setLastBodyPart(bodyPart)
    }
  }

  get handleFinishOnboarding () {
    const { setOnboarding } = this.props
    return () => {
      setOnboarding(false)
    }
  }

  openCategoryPicker () {
    this.setState({
      isCategoryPickerVisible: true
    })
  }

  closeCategoryPicker () {
    this.setState({
      isCategoryPickerVisible: false
    })
  }

  onColTypeChange = (col) => {
    this.setState({
      colType: col
    })
    this.props.onColTypeChange(col)
  }

  get isListProductPage () {
    return () => {
      const { location } = this.props
      return /^\/products\/(wtop|wpants|wshoes)\/list$/.test(location.pathname)
    }
  }

  setCategory = (c) => {
    // this.props.setFilter({ ...this.props.filters, category: c })
  }

  onSetTutorial = (step) => {
    this.props.setStep(step)
  }

  render () {
    const {
      activeCategory, filters, scrollBellowTheFold, isFilterSaved, lastBodyPart,
      expanded, hidden, onboarding, tutorialStep
    } = this.props
    const { isCategoryPickerVisible, colType } = this.state

    return (
      <div
        className={classNames('ProductsVisualFilter', {
          allowHide: this.isProductDetailPage,
          pullDown: !scrollBellowTheFold,
          isonboarding: onboarding,
          expanded,
          'is-hidden': hidden,
          // animated: !onboarding
          animated: true })}
      >
        {
          onboarding && (
            <div className={`ProductsVisualFilter-backdrop-${tutorialStep > 1 ? 'notstep1' : 'onboarding'}`} />
          )
        }
        {
          !onboarding && (
            <div className='ProductsVisualFilter-backdrop' onClick={this.handleFilterToggle} />
          )
        }
        {
          onboarding && tutorialStep === 1 && (
            <div className='step-1'>
              <p>Now let’s tap on visual filter button.</p>
              <img alt='' src={Arrow0} />
            </div>
          )
        }
        {
          onboarding && tutorialStep === 2 && (
            <div className='step-1 step-2'>
              <p> Let’s tap on Advanced Filter.</p>
              <img alt='' src={Arrow0} />
            </div>
          )
        }
        {
          onboarding && tutorialStep === 3 && (
            <div className='step-1 step-3'>
              <p>Tap on a dimond to select the body parts</p>
              <img alt='' src={Arrow1} />
            </div>
          )
        }
        {
          onboarding && tutorialStep === 4 && (
            <div className='step-1 step-3 step-4'>
              <p>Tap either the body parts or thumbnails to change the design!</p>
              <div className='right-arrow'>
                <img alt='' src={Arrow0} />
              </div>
              <img alt='' className='left-arrow' src={Arrow1} />
            </div>
          )
        }
        {
          onboarding && tutorialStep === 5 && (
            <div className='step-1 step-3 step-5'>
              <p>Great! You can save your favorite styles.</p>
              <div className='arrow'>
                <img alt='' src={Arrow2} />
              </div>
            </div>
          )
        }
        <Transition
          timeout={{ enter: 100, exit: 300 }}
          transition='fadeInUp'
          show={expanded}
        >
          <div className='ProductsVisualFilter-panelWrapper'>
            <div className='ProductsVisualFilter-header'>
              {/* <span style={{ width: 40 }} /> */}
              {
                onboarding && <div className='overlay' />
              }
              <ListView colType={colType} onChange={this.onColTypeChange} />
              <div
                onClick={this.openCategoryPicker}
                className={classNames('ProductsVisualFilter-categoryToggle', { 'is-active': isCategoryPickerVisible })}>
                {CATEGORIES_LABELS[activeCategory]}
              </div>
              <div className='ProductsVisualFilter-close' onClick={this.handleFilterToggle}>
                <img src={CloseSvg} />
              </div>
            </div>
            <VisualFilterPanel
              category={activeCategory}
              favorite={isFilterSaved}
              filters={filters}
              lastBodyPart={lastBodyPart}
              onFilterChange={this.handleFilterChange}
              onFilterLike={this.handleFilterLike}
              tutorialStep={tutorialStep}
              onboarding={onboarding}
              onSetTutorial={this.onSetTutorial}
              onBodyPartChange={this.handleBodyPartChange}
              onFinishedOnboarding={this.handleFinishOnboarding} />
          </div>
        </Transition>
        <Transition timeout={{ enter: 100, exit: 100 }} show={!expanded} transition='fadeInUp'>
          {
            !this.isListProductPage() ? <FloatButton category={activeCategory} onClick={() => this.onSearchPage()} /> : <FloatButton category={activeCategory} onClick={this.handleFilterToggle} />
          }
        </Transition>
        <CategoryPicker
          isVisible={isCategoryPickerVisible}
          category={activeCategory}
          onClose={this.closeCategoryPicker}
          setCategory={this.setCategory}
          hideBackdrop
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  filters: state.filters[props.activeCategory].data,
  isFilterSaved: isFilterSavedSelector(state, { category: props.activeCategory, customPresetName: CUSTOM_PRESET_NAME }),
  lastBodyPart: state.filters.lastBodyPart,
  scrollBellowTheFold: state.product.scrollBellowTheFold,
  router: state.router,
  expanded: state.filters.expanded,
  onboarding: state.filters.onboarding,
  tutorialStep: state.tutorial.step
})

export default withRouter(
  connect(
    mapStateToProps,
    {
      fetchProducts,
      syncFilter,
      syncFavoritePresets,
      setFilter,
      saveFilterAsPreset,
      deleteFilterFromPreset,
      setLastBodyPart,
      toggleVisualFilter,
      setOnboarding,
      setStep
    }
  )(ProductsVisualFilter)
)
