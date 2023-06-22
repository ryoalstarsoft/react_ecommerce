/**
 * VisualFilter
 * contains functions to handle visual filter svg interactions
 */
// Import Snap from window. Snap is loaded from template.
import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import throttle from 'lodash/throttle'
import {
  LAST_BODY_PART,
  FILTERS,
  PRD_CATEGORY
} from '@yesplz/core-web/config/constants'

import Tracker from './Tracker'
import { getCatData } from './VFCatViewData'

const { Snap, localStorage } = window

export default class VisualFilter {
  selectedBodyPart = null
  colorPalletteOpened = 0
  svgLoaded = false
  lastHighlightId = null
  lastBodyPart = 'shoulder'
  swipeView = false
  catdata = null

  constructor(selector = '#svg', options = {}) {
    this.settings = {
      ...defaultOptions,
      ...options
    }
    this.catdata = getCatData(this.settings.category)

    if (!Snap) { // Skip init to avoid error on test env.
      return false
    }

    this.snap = Snap(selector)

    if (options.defaultState) {
      this.catdata.setDefaultState(options.defaultState)
    }

    this.initialize()

    this.moveToNextThumbnails = throttle(this.moveToNextThumbnails, 500, { leading: true, trailing: false })
  }

  trackBodypart(event, prop) {
    Tracker.track(event, { 'category': this.settings.category, 'bodypart': prop })
  }

  track(event) {
    Tracker.track(event, { 'category': this.settings.category })
  }

  setLastBodyPart(lastBodyPart) {
    if (!isEmpty(lastBodyPart) && this.lastBodyPart !== lastBodyPart) {
      this.lastBodyPart = lastBodyPart
    }
  }

  setPointerHovering() {
    for (let prop in this.catdata.currentPropState) {
      let hitArea = this.findGroupById(this.catdata.touchGroupName(prop))
      let vf = this
      hitArea.mouseover(function () {
        vf.highlightGroup(vf.catdata.getHoverGroupName(prop), false, '.5')
      })
      hitArea.mouseout(function () {
        vf.removeHighlight()
      })
    }
  }

  arrangeThumbnails() {
    for (var i in this.catdata.catcfg.partList) {
      const prop = this.catdata.catcfg.partList[i]
      for (var j = 0; j < this.catdata.propCount(prop); j++) {
        const tn = this.findGroupById(this.catdata.thumbnailGroupName(prop, j))
        const offsets = this.catdata.tnOffset(prop, j)
        tn.attr(this.transformAttr(offsets.x, offsets.y, null, this.catdata.tnScale))
      }
    }
  }

  initialize() {
    const { onSVGLoaded, hideThumbnail, defaultBodyPart, badgeMode, showHighlightOnBuild, customViewBox } = this.settings

    this.lastBodyPart = defaultBodyPart
    this.viewBox = customViewBox || this.catdata.viewBox(hideThumbnail)
    this.catdata.setViewBox(this.viewBox)
    let svgSource = this.catdata.svgCoreAndTn()

    this.snap.attr({ viewBox: this.viewBox })

    Snap.load(svgSource, (frag) => {
      this.svgLoaded = true
      this.snapGroup = this.snap.group()
      this.snapGroup.append(frag)
      // Hide all object and show what we want only later
      this.snapGroup.attr({ visibility: 'hidden' })

      this.showGroup(this.catdata.fullbodyGroupName())

      for (let prop in this.catdata.currentPropState) {
        this.showGroup(this.catdata.getBodyPartGroupName(prop))
      }

      this.handleOnboardingFinished()
      this.initializeClickHitMap()

      if (!badgeMode) {
        this.track('VF Opened')

        this.initializeArrowNavigation()

        this.showGroup('touch_points')
        this.setPointerHovering()

        if (this.catdata.propList().indexOf(this.lastBodyPart) < 0) {
          console.log('Unrecognized last bodypart', this.lastBodyPart, 'switching to default')
          this.lastBodyPart = this.catdata.propList()[0]
        }
        if (!this.settings.hideThumbnail) {
          this.arrangeThumbnails()
          this.switchBodypartThumbnail(this.lastBodyPart)
        }
      }

      if (showHighlightOnBuild) {
        this.highlightGroup(this.catdata.getHoverGroupName(this.lastBodyPart), false, '.5')
      }

      // callback
      onSVGLoaded()
    })
  }

  initializeClickHitMap() {
    let group = null
    let thumbTouchSize = this.catdata.thumbTouchSize()
    var i
    // This will be touch hit-area
    for (i in this.catdata.propList()) {
      const prop = this.catdata.propList()[i]
      group = this.findGroupById(this.catdata.touchGroupName(prop))

      if (group === null) {
        console.log('Touch area for', prop, 'not found')
        continue
      }

      // Just make it not-visible. We still need it for hit-map
      group.attr({ visibility: 'visible' })
      group.attr({ opacity: this.settings.debugTouchArea ? 0.5 : 0.0 })

      if (!this.settings.badgeMode) {
        group.click(() => { this.handleBodyPartClick(prop) })
      }
    }

    if (this.settings.hideThumbnail) {
      group = this.findGroupById(this.catdata.thumbnailTouchGroupName())
      group.attr({ opacity: 0 })
      for (i in this.catdata.propList()) {
        const prop = this.catdata.propList()[i]
        group = this.findGroupById(this.catdata.thumbnailGroupName(prop))
        group.attr({ opacity: 0 })
      }
      this.hideGroup(this.catdata.thumbnailHLGroupName())
    } else {
      for (let i = 0; i < 7; i++) {
        group = this.findGroupById(this.catdata.thumbnailTouchGroupName(i))
        group.attr(thumbTouchSize)
        group.attr({ opacity: this.settings.debugTouchArea ? 0.2 : 0.0 })
        group.attr({ visibility: 'visible' })
        group.click(() => { this.handleThumbnailClick(i) })
      }
    }
  }

  transformAttr(x, y, rotate, scale = null) {
    let t = `translate(${x},${y})`
    if (rotate) {
      t += ` rotate(${rotate})`
    }
    if (scale) {
      t += ` scale(${scale})`
    }
    return { transform: t }
  }

  moveToNextPreset(backward = false) {
    this.updateState(this.catdata.nextPreset(backward))
    this.settings.onFilterChange(this.catdata.currentPropState)
  }

  initializeArrowNavigation() {
    const { hideThumbnail } = this.settings

    // Initialize preset arrow
    const presetBack = this.findGroupById('preset_back')
    const presetForward = this.findGroupById('preset_forward')
    this.showGroup('preset_back')
    this.showGroup('preset_forward')
    presetBack.click(() => {
      this.moveToNextPreset(true)
    })
    presetForward.click(() => {
      this.moveToNextPreset()
    })

    if (!hideThumbnail) {
      // set arrow navigation visibility and position
      const arrowBack = this.findGroupById('tn_arrow_back')
      const arrowForward = this.findGroupById('tn_arrow_forward')

      this.showGroup('tn_arrow_back')
      this.showGroup('tn_arrow_forward')
      const backOffset = this.catdata.arrowBackOffset()
      const forwardOffset = this.catdata.arrowForwardOffset()
      arrowBack.attr(this.transformAttr(backOffset.x, backOffset.y))
      arrowForward.attr(this.transformAttr(forwardOffset.x, forwardOffset.y))

      // initialize navigation tap events
      arrowBack.click(() => {
        this.moveToNextThumbnails(true)
      })
      arrowForward.click(() => {
        this.moveToNextThumbnails()
      })
    }
  }

  moveToNextThumbnails(backward = false) {
    const nextProp = backward ? this.catdata.prevProp(this.selectedBodyPart)
      : this.catdata.nextProp(this.selectedBodyPart)
    const nextThumb = this.catdata.currentPropState[nextProp]

    this.handleAfterSwipeThumbnail(nextProp, nextThumb)
  }

  handleAfterSwipeThumbnail(prop, sel) {
    // change visual filter after animation finished
    this.switchBodypartThumbnail(prop)

    this.showHorizontalSelectionBox(prop, sel)
    this.changePropSelection(prop, sel)

    // show / hide highlight
    this.removeHighlight()
    this.highlightGroup(this.catdata.getBodyPartGroupName(prop))

    // set last body part when its changed
    this.lastBodyPart = prop
    this.settings.onPropChange(prop)
  }

  /**
   * animate thumbnail left / right
   * @param {string} prop
   * @param {string} nextProp
   * @param {boolean} movingLeft // moving right = false
   * @param {function} onAnimationFinish callback
   * @param {number} animationDuration
   */
  animateHorizontalThumbnail(prop, nextProp, movingLeft = true, onAnimationFinish = () => { }, animationDuration = 300) {
    const currentThumb = this.findGroupById(this.catdata.thumbnailGroupName(prop))
    const nextThumbs = this.findGroupById(this.catdata.thumbnailGroupName(nextProp))
    const currentThumbBBox = currentThumb.getBBox()
    const nextThumbBBox = nextThumbs.getBBox()
    const currentThumbInitialX = currentThumbBBox.x
    const nextThumbInitialX = nextThumbBBox.x

    if (movingLeft) {
      // move current thumbs from thumbnails position to top
      currentThumb.animate({ transform: `translate(${currentThumbBBox.x - currentThumbBBox.width}, 330) scale(1)` }, animationDuration, () => {
        currentThumb.attr({ visibility: 'hidden', transform: `translate(${currentThumbInitialX}, 330) scale(1)` })
      })

      // move next thumbs from bottom to thumbnails position
      nextThumbs.attr({ visibility: 'visible', transform: `translate(${nextThumbBBox.x + currentThumbBBox.width}, 330) scale(1)` })
      nextThumbs.animate({ transform: `translate(${nextThumbInitialX}, 330) scale(1)` }, animationDuration, () => {
        onAnimationFinish()
      })
    } else {
      // move current thumbs from thumbnails position to bottom
      currentThumb.animate({ transform: `translate(${currentThumbBBox.x + nextThumbBBox.width}, 330) scale(1)` }, animationDuration, () => {
        currentThumb.attr({ visibility: 'hidden', transform: `translate(${currentThumbInitialX}, 330) scale(1)` })
      })

      // move next thumbs from top to thumbnails position and fadeIn
      nextThumbs.attr({ visibility: 'visible', transform: `translate(${nextThumbInitialX - nextThumbBBox.width}, 330) scale(1)` })
      nextThumbs.animate({ transform: `translate(${nextThumbInitialX}, 330) scale(1)` }, animationDuration, () => {
        onAnimationFinish()
      })
    }
  }

  updateState(filters) {
    if (!this.svgLoaded) {
      return
    }

    if (!this.settings.hideThumbnail && isNil(this.selectedBodyPart)) { // Initial update
      this.switchBodypartThumbnail(this.lastBodyPart)
    }

    const newPropState = this.catdata.sanitizeFilters(filters)
    // only update when svg is loaded and has changes on filters
    if (!isEqual(this.catdata.currentPropState, newPropState)) {
      // body part visibility handler
      for (let prop in newPropState) {
        // hide previous bodypart
        this.hideGroup(this.catdata.getBodyPartGroupName(prop))
        // show next bodypart
        this.showGroup(this.catdata.getBodyPartGroupName(prop, newPropState))
      }
      // update current prop state after body part visibility handler done
      this.catdata.currentPropState = newPropState

      if (!this.settings.hideThumbnail) {
        this.updateThumbnailSelectionBox(this.lastBodyPart)
      }
    }
  }

  handleOnboardingFinished(isupdate = false) {
    const { onFinishedOnboarding, tutorialStep, onboarding } = this.settings
    // if (onboarding) {
    //   if (tutorialStep > 4) {
    //     if (onFinishedOnboarding) {
    //       onFinishedOnboarding()
    //     }
    //     VisualFilter.saveConfig('onboarding_completed', 1)
    //     this.track('MiniOnboarding Completed')
    //   }
    // } else {
    //   if (onFinishedOnboarding) {
    //     onFinishedOnboarding()
    //   }
    //   VisualFilter.saveConfig('onboarding_completed', 1)
    //   this.track('MiniOnboarding Completed')
    // }
    if (isupdate || !onboarding) {
      if (onFinishedOnboarding) {
        onFinishedOnboarding()
      }
      VisualFilter.saveConfig('onboarding_completed', 1)
      this.track('MiniOnboarding Completed')
    }
  }

  switchBodypartThumbnail(prop) {
    if (!isNil(this.selectedBodyPart)) {
      this.hideGroup(this.catdata.thumbnailGroupName(this.selectedBodyPart))
    }
    this.selectedBodyPart = prop
    this.showGroup(this.catdata.thumbnailGroupName(prop))

    this.updateThumbnailSelectionBox(prop)
    for (let i = 0; i < 7; i++) {
      const group = this.catdata.thumbnailTouchGroupName(i)
      if (i < this.catdata.propCount(prop)) {
        const { x, y } = this.catdata.tnOffset(prop, i)
        const g = this.findGroupById(group)
        g.transform(`t${x},${y}`) // not sure where this offset coming from.
        this.showGroup(group)
      } else {
        this.hideGroup(group)
      }
    }
  }

  handleBodyPartClick(prop) {
    if (!this.selectedBodyPart || this.selectedBodyPart.valueOf() === prop.valueOf()) {
      this.cyclePropSelection(prop)
    }

    this.trackBodypart('VF Touch BodyPart', prop)

    // set last body part when its changed
    this.lastBodyPart = prop
    this.settings.onPropChange(prop)

    if (!this.settings.hideThumbnail) {
      this.switchBodypartThumbnail(prop)
    }
  }

  updateThumbnailSelectionBox(prop) {
    this.showHorizontalSelectionBox(prop, this.catdata.currentPropState[prop])

    this.removeHighlight()
    this.highlightGroup(this.catdata.getBodyPartGroupName(prop))
  }

  handleThumbnailClick(tnIdx) {
    if (tnIdx > this.catdata.getMaxSelectionIndx(this.selectedBodyPart)) {
      return
    }
    this.trackBodypart('VF Thumbnail Touch', this.selectedBodyPart)

    this.showSelectionBox(this.selectedBodyPart, tnIdx)
    this.changePropSelection(this.selectedBodyPart, tnIdx)
    this.removeHighlight()
    this.highlightGroup(this.catdata.getBodyPartGroupName(this.selectedBodyPart))
  }

  cyclePropSelection(prop) {
    let next = parseInt(this.catdata.currentPropState[prop], 10) + 1
    if (next === this.catdata.propCount(prop)) {
      next = 0
    }
    this.changePropSelection(prop, next)
  }

  updatePropSelectionViewState(prevPropState, newPropState) {
    for (var prop in newPropState) {
      var hideGrp = this.catdata.getBodyPartGroupName(prop, prevPropState)
      var showGrp = this.catdata.getBodyPartGroupName(prop, newPropState)
      if (hideGrp !== showGrp) {
        // console.log(prop, 'from', hideGrp, 'to', showGrp)
        this.hideGroup(hideGrp)
        this.showGroup(showGrp)
      }
    }
  }

  changePropSelection(prop, sel, requestChange = true) {
    let curState = this.catdata.currentPropState
    var prevPropState = Object.assign({}, curState)
    this.catdata.changePropSelection(prop, sel)
    this.updatePropSelectionViewState(prevPropState, curState)
    if (requestChange) {
      this.settings.onFilterChange(curState, true)
    }
  }

  showHorizontalSelectionBox(prop, sel) {
    const group = this.findGroupById(this.catdata.thumbnailHLGroupName())
    const { x, y } = this.catdata.tnOffset(prop, sel)
    group.attr(this.transformAttr(x, y, null, this.catdata.tnScale))
    this.showGroup(this.catdata.thumbnailHLGroupName())
  }

  showSelectionBox(prop, tnIdx) {
    this.showHorizontalSelectionBox(this.selectedBodyPart, parseInt(tnIdx, 10))
  }
  /**
   * save last body part to localStorage
   * @param {string} prop
   */
  static saveLastBodyPart(prop) {
    localStorage.setItem(LAST_BODY_PART, prop)
  }

  /**
   * get last body part to localStorage
   * @returns {string} last body part (prop)
   */
  static getLastBodyPart() {
    let prop = localStorage.getItem(LAST_BODY_PART)
    if (prop === 'collar') { // collar is deprecated
      return 'neckline'
    } else {
      return prop
    }
  }

  /**
   * remove last body part from localStorage
   */
  static removeLastBodyPart() {
    localStorage.removeItem(LAST_BODY_PART)
  }

  /**
   * Set svg group to visible
   * @param {string} id
   * @param {Object} extraProps
   */
  showGroup(id, extraProps = {}) {
    const group = this.findGroupById(id)
    group.attr({ visibility: 'visible', ...extraProps })
    return group
  }

  /**
   * Set svg group to invisible
   * @param {string} id
   * @param {Object} extraProps
   */
  hideGroup(id, extraProps) {
    const group = this.findGroupById(id)
    group.attr({ visibility: 'hidden', ...extraProps })
  }

  /**
   * Highlight svg group
   * @param {string} id
   */
  highlightGroup(id, fadeout = true, opacity = '1') {
    id = id + '_HL'
    // Assume highlight objects are defined below body parts in svg file
    const group = this.findGroupById(id)
    if (group === null) { // HL resource is not ready yet.
      console.log('Ignoring highlightGroup', id, group)
      return
    }
    // console.log('highlightGroup', id, group)
    group.attr({
      visibility: 'visible',
      opacity: opacity,
      'transform-origin': '50% 50%'
    })
    if (fadeout) {
      group.animate({
        opacity: '.8'
        // transform: 'scale(1.01)' // Somehow scaling up animation looks shaky.
      }, 500, null, () => { this.hideGroup(id) })
    }
    this.lastHighlightId = id
  }

  removeHighlight() {
    if (!isNil(this.lastHighlightId)) {
      this.hideGroup(this.lastHighlightId)
      this.lastHighlightId = null
    }
  }

  /**
   * Find svg group based on specific id
   * @param {*} id
   * @return {Object} svg group
   */
  findGroupById(id) {
    const group = this.snap.select('#' + id)
    if (group === null) {
      console.debug('Missing group', id)
      // console.trace()
      // Avoid script crashing
      return this.snap.select('#missing_group')
    }
    return group
  }

  /**
   * Check wheter onboarding screen needs to be loaded
   */
  static shouldShowOnboarding() {
    return !VisualFilter.loadConfig('onboarding_completed')
  }

  /**
   * Save config value from localstorage
   * @param {string} name
   * @param {string} val
   */
  static saveConfig(name, val) {
    try {
      localStorage.setItem(name, val)
    } catch (err) {
      console.debug('error saving config', err)
    }
  }

  /**
   * Load config value from localstorage
   * @param {string} name
   * @returns {(string|null)} config value
   */
  static loadConfig(name) {
    try {
      return localStorage.getItem(name)
    } catch (err) {
      console.debug('error loading config', err)
    }
    return null
  }

  /**
   * get current filters from local storage
   */
  static getFilters() {
    const filters = JSON.parse(localStorage.getItem(FILTERS))
    return filters || {}
  }
}

const defaultOptions = {
  category: PRD_CATEGORY, // Should be changeable runtime
  badgeMode: false, // Disable interaction and do not show thumbnails/bottom menus
  defaultState: {},
  hideThumbnail: false,
  debugTouchArea: false,
  customViewBox: null,
  defaultBodyPart: 'shoulder',
  onFilterChange: (filters, userClick = false) => { console.debug('filter change', filters) },
  onPropChange: (prop) => { console.debug('prop change', prop) },
  onSVGLoaded: () => { },
  onFinishedOnboarding: () => { }
}
