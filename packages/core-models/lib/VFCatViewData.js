import vfWtopSvg from '@yesplz/core-web/assets/svg/vf_wtop.svg'
import vfWshoesSvg from '@yesplz/core-web/assets/svg/vf_wshoes.svg'
import vfWpantsSvg from '@yesplz/core-web/assets/svg/vf_wpants.svg'

import pick from 'lodash/pick'
import { getCatCfg } from './VFCatCfg'

class VfCatViewData {
  catcfg = null
  viewBoxWithHorizThumbnail = [15, -5, 280, 280]
  viewBoxWithNoThumnbnail = [0, 0, 250, 250]
  thumbnailWidth = 45
  thumbnailHeight = 45
  tnScale = 0.70
  constructor (vfcatcfg) {
    this.catcfg = vfcatcfg
    this.curViewBox = null
  }
  currentPreset = null

  presetList = [ ]

  sanitizeFilters (filters) {
    let filterSettings = pick(filters, this.catcfg.partList)
    // Older settings may have different range.
    // Limit settings values to valid ones
    for (let i in this.propList()) {
      let prop = this.propList()[i]
      var maxVal = this.catcfg.maxVal(prop)
      if (filterSettings[prop] >= 0) {
        if (parseInt(filterSettings[prop], 10) > maxVal) {
          console.log('Limiting settings to valid range', prop, filterSettings[prop])
          filterSettings[prop] = maxVal
        }
      } else {
        filterSettings[prop] = this.currentPropState[prop]
      }
    }
    return filterSettings
  }
  thumbTouchSize () {
    return { width: this.thumbnailWidth, height: this.thumbnailHeight }
  }
  setDefaultState (filters) {
    this.currentPropState = this.sanitizeFilters(filters)
  }

  viewBox (hideThumbnail) {
    if (hideThumbnail) {
      return this.viewBoxWithNoThumnbnail
    }
    return this.viewBoxWithHorizThumbnail
  }

  setViewBox (viewBox) {
    this.curViewBox = viewBox
  }

  propCount (prop) {
    return this.catcfg.maxVal(prop) + 1
  }

  getMaxSelectionIndx (prop) {
    return this.catcfg.maxVal(prop)
  }
  clipPropStateRange (val, from, to) {
    return Math.max(from, Math.min(val, to))
  }

  // Offset relative to thumbnail offset
  tnOffset (prop, idx) {
    const tnCnt = this.propCount(prop)
    const base = this.tnAreaOffset()

    let calcX = (idx) => {
      return base.x + this.curViewBox[2] * 0.22 + idx * (this.thumbnailWidth + 3)
    }
    if (tnCnt > 4) { // Show in two rows
      if (idx <= 3) {
        return {x: calcX(idx), y: base.y - this.thumbnailHeight / 2}
      } else {
        return {x: calcX(idx - 4), y: base.y + this.thumbnailHeight / 2}
      }
    }
    return {x: calcX(idx), y: base.y}
  }

  tnAreaOffset () {
    return {x: 0, y: this.curViewBox[3] * 0.65}
  }
  arrowBackOffset () {
    let {x, y} = this.tnAreaOffset()
    return {x: x, y: y}
  }
  arrowForwardOffset () {
    let {x, y} = this.tnAreaOffset()
    return {x: x + this.curViewBox[2] * 0.85, y: y}
  }

  propList () {
    return this.catcfg.partList
  }
  prevProp (prop) {
    const currentPropIndex = this.catcfg.partList.indexOf(prop)
    const nextPropIndex = currentPropIndex > 0 ? currentPropIndex - 1 : this.catcfg.partList.length - 1
    return this.catcfg.partList[nextPropIndex]
  }
  nextProp (prop) {
    const currentPropIndex = this.catcfg.partList.indexOf(prop)
    const nextPropIndex = currentPropIndex < this.catcfg.partList.length - 1 ? currentPropIndex + 1 : 0
    return this.catcfg.partList[nextPropIndex]
  }
  nextPreset (backward) {
    if (this.currentPreset === null) {
      this.currentPreset = 0
    }
    this.currentPreset += backward ? -1 : 1
    this.currentPreset = (this.currentPreset + this.presetList.length) % this.presetList.length
    return this.presetList[this.currentPreset]
  }

  changePropSelection (prop, sel) {
    this.currentPropState[prop] = sel
  }

  getBodyPartGroupName (prop, propState = null) {
    let state = propState || this.currentPropState
    return prop + '_' + state[prop]
  }

  getHoverGroupName (prop) {
    return this.getBodyPartGroupName(prop, this.catcfg.propMaxVal)
  }

  thumbnailHLGroupName () {
    return 'tn_HL'
  }
  fullbodyGroupName () {
    return this.catcfg.category + '_mannequin'
  }
}

class VfCatWtopViewData extends VfCatViewData {
  currentPropState = {
    coretype: 0,
    neckline: 0,
    shoulder: 0,
    sleeve_length: 0,
    top_length: 0
  }
  onboardingSequences = [
    {coretype: 2, neckline: 1, shoulder: 1, sleeve_length: 0, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 2, sleeve_length: 0, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 3, sleeve_length: 0, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 0, sleeve_length: 1, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 0, sleeve_length: 2, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 0, sleeve_length: 4, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 0, sleeve_length: 5, top_length: 2},
    {coretype: 0, neckline: 2, shoulder: 3, sleeve_length: 5, top_length: 0},
    {coretype: 1, neckline: 2, shoulder: 3, sleeve_length: 2, top_length: 2},
    {coretype: 2, neckline: 1, shoulder: 3, sleeve_length: 0, top_length: 1}
  ]

  constructor (vfcatcfg) {
    super(vfcatcfg)
    console.log('Creating VfCatWtopViewData')
    this.settings = {
    }
  }
  svgCoreAndTn () {
    return vfWtopSvg
  }

  thumbnailGroupName (prop, idx = null) {
    if (idx === null) {
      return 'tn_' + prop
    } else {
      return 'tn_' + prop + '_' + idx
    }
  }

  presetList = [
    {coretype: 1, neckline: 0, shoulder: 0, sleeve_length: 0, top_length: 0},
    {coretype: 0, neckline: 1, shoulder: 3, sleeve_length: 3, top_length: 0},
    {coretype: 1, neckline: 3, shoulder: 3, sleeve_length: 1, top_length: 0},
    {coretype: 1, neckline: 0, shoulder: 1, sleeve_length: 0, top_length: 1},
    {coretype: 2, neckline: 0, shoulder: 3, sleeve_length: 4, top_length: 2},
    {coretype: 2, neckline: 0, shoulder: 0, sleeve_length: 5, top_length: 1},
    {coretype: 3, neckline: 0, shoulder: 3, sleeve_length: 0, top_length: 1},
    {coretype: 3, neckline: 3, shoulder: 3, sleeve_length: 4, top_length: 2}
  ]

  // For Kolon demo - TODO: Make this configurable
  // presetList = [
  //   {coretype: 2, neckline: 2, shoulder: 3, sleeve_length: 1, top_length: 1}, // tight short sleeves
  //   {coretype: 3, neckline: 2, shoulder: 3, sleeve_length: 2, top_length: 2}, // loose short sleeves
  //   {coretype: 2, neckline: 1, shoulder: 2, sleeve_length: 0, top_length: 1}, // sleeveles shirt low neck
  //   {coretype: 2, neckline: 2, shoulder: 2, sleeve_length: 0, top_length: 1}, // sleeveles shirt closed neck
  //   {coretype: 2, neckline: 3, shoulder: 3, sleeve_length: 4, top_length: 2, solid: true}, // blouses
  //   {coretype: 3, neckline: 2, shoulder: 3, sleeve_length: 4, top_length: 1} // long sleeves shirt
  // ]

  touchGroupName (prop) {
    return prop + '_touch'
  }
  thumbnailTouchGroupName (i = null) {
    if (i === null) {
      return 'tn_touches'
    }
    return 'tn_touch_' + i
  }
  changePropSelection (prop, sel) {
    if (prop === 'coretype' && sel === 0) {
      this.currentPropState['top_length'] = 0
    }
    if (prop === 'top_length' && sel !== 0 && this.currentPropState['coretype'] === 0) {
      this.currentPropState['coretype'] = 1
    }
    this.currentPropState[prop] = sel
  }

  getBodyPartGroupName (prop, propState = null) {
    let state = propState || this.currentPropState

    if (prop === 'shoulder') {
      // Special cases for shoulders:
      // Shoulder 3 / sleeves 0 : shows 'shoulder_3_for_sleeves_0' instead of 'shoulder_3'
      var shoulder = state['shoulder']
      if (shoulder === 3 && state['sleeve_length'] === 0) {
        return 'shoulder_3_for_sleeves_0'
      }
    }
    return prop + '_' + state[prop]
  }
}

class VfCatWshoesViewData extends VfCatViewData {
  currentPropState = {
    toes: 1,
    covers: 0,
    shafts: 0,
    counters: 2,
    bottoms: 5
  }
  presetList = [
    {'toes': 1, 'covers': 0, 'shafts': 0, 'counters': 2, 'bottoms': 5},
    {'toes': 0, 'covers': 0, 'shafts': 1, 'counters': 1, 'bottoms': 5},
    {'toes': 2, 'covers': 1, 'shafts': 0, 'counters': 2, 'bottoms': 1},
    {'toes': 1, 'covers': 2, 'shafts': 2, 'counters': 2, 'bottoms': 4},
    {'toes': 1, 'covers': 2, 'shafts': 4, 'counters': 2, 'bottoms': 2},
    {'toes': 0, 'covers': 2, 'shafts': 2, 'counters': 0, 'bottoms': 2},
    {'toes': 0, 'covers': 0, 'shafts': 0, 'counters': 0, 'bottoms': 0}
    // {'toes': 1, 'covers': 2, 'shafts': 1, 'counters': 3, 'bottoms': 0}
  ]

  // Kolon Preset
  // presetList = [
  //   {'toes': 1, 'covers': 0, 'shafts': 0, 'counters': 2, 'bottoms': 6},
  //   {'toes': 1, 'covers': 1, 'shafts': 0, 'counters': 0, 'bottoms': 0},
  //   {'toes': 2, 'covers': 1, 'shafts': 0, 'counters': 2, 'bottoms': 0},
  //   {'toes': 2, 'covers': 1, 'shafts': 0, 'counters': 2, 'bottoms': 1},
  //   {'toes': 0, 'covers': 0, 'shafts': 0, 'counters': 0, 'bottoms': 0},
  //   {'toes': 1, 'covers': 2, 'shafts': 2, 'counters': 3, 'bottoms': 4},
  //   {'toes': 1, 'covers': 2, 'shafts': 4, 'counters': 3, 'bottoms': 2},
  //   {'toes': 0, 'covers': 0, 'shafts': 1, 'counters': 1, 'bottoms': 6},
  //   {'toes': 1, 'covers': 2, 'shafts': 1, 'counters': 3, 'bottoms': 0}
  // ]

  constructor (vfcatcfg) {
    super(vfcatcfg)
    console.log('Creating VfCatWshoesViewData')
    this.settings = {
    }
  }
  svgCoreAndTn () {
    return vfWshoesSvg
  }
  thumbnailGroupName (prop, idx = null) {
    if (idx === null) {
      return 'tn_' + prop
    } else {
      return 'tn_' + prop + '_' + idx
    }
  }
  touchGroupName (prop) {
    return prop + '_touch'
  }
  thumbnailTouchGroupName (i = null) {
    if (i === null) {
      return 'tn_touches'
    }
    return 'tn_touch_' + i
  }

  getHoverGroupName (prop) {
    const hoverHlIdx = {
      'shafts': 0,
      'counters': 2,
      'covers': 2,
      'toes': 0,
      'bottoms': 1
    }
    return this.getBodyPartGroupName(prop, hoverHlIdx)
  }
}

class VfCatWpantsViewData extends VfCatViewData {
  currentPropState = {
    rise: 0,
    thigh: 1,
    knee: 1,
    ankle: 1
  }
  presetList = [
    {rise: 0, thigh: 1, knee: 1, ankle: 1},
    {rise: 0, thigh: 1, knee: 2, ankle: 2},
    {rise: 1, thigh: 2, knee: 2, ankle: 3},
    {rise: 1, thigh: 0, knee: 0, ankle: 0}, // {rise: 2, thigh: 0, knee: 0, ankle: 0},
  ]

  constructor (vfcatcfg) {
    super(vfcatcfg)
    console.log('Creating VfCatWpantsViewData')
    this.settings = {
    }
  }
  svgCoreAndTn () {
    return vfWpantsSvg
  }
  thumbnailGroupName (prop, idx = null) {
    if (idx === null) {
      return 'tn_' + prop
    } else {
      return 'tn_' + prop + '_' + idx
    }
  }
  touchGroupName (prop) {
    return 'touch_' + prop
  }
  thumbnailTouchGroupName (i = null) {
    if (i === null) {
      return 'tn_touches'
    }
    return 'tn_touch_' + i
  }
  changePropSelection (prop, sel) {
    let knee = this.currentPropState['knee']
    let thigh = this.currentPropState['thigh']

    if (prop === 'thigh') {
      if (sel === 0) { // Short pants. No knee, ankle
        this.currentPropState['knee'] = 0
        this.currentPropState['ankle'] = 0
      } else if (sel === 1) {
        this.currentPropState['knee'] = this.clipPropStateRange(knee, 0, 2)
      } else {
        if (knee !== 0) {
          this.currentPropState['knee'] = this.clipPropStateRange(knee, 2, 2)
        }
      }
    }
    if (prop === 'knee') {
      if (sel === 0) { // No knee means no ankle also
        this.currentPropState['ankle'] = 0
      } else if (sel === 1 || sel === 2) {
        this.currentPropState['thigh'] = this.clipPropStateRange(thigh, 1, 2)
      }
    }

    if (prop === 'ankle') {
      let knee = this.currentPropState['knee']
      let thigh = this.currentPropState['thigh']
      if (sel === 1) {
        this.currentPropState['knee'] = 1
        this.currentPropState['thigh'] = this.clipPropStateRange(thigh, 1, 2)
      } else if (sel === 2) {
        this.currentPropState['knee'] = this.clipPropStateRange(knee, 1, 2)
        if (this.currentPropState['knee'] === 2) {
          this.currentPropState['thigh'] = 1
        } else {
          this.currentPropState['thigh'] = this.clipPropStateRange(thigh, 1, 2)
        }
      } else if (sel === 3) {
        this.currentPropState['knee'] = 2
        this.currentPropState['thigh'] = this.clipPropStateRange(thigh, 1, 2)
      }
    }
    this.currentPropState[prop] = sel
  }
  getBodyPartGroupName (prop, propState = null) {
    let state = propState || this.currentPropState
    let val = state[prop].toString()
    if (prop === 'knee' && val !== '0') {
      return 'knees_' + val + '_thigh_' + state['thigh']
    }
    if (prop === 'ankle' && val !== '0') {
      return 'ankle_' + val + '_knees_' + state['knee'] + '_thigh_' + state['thigh']
    }
    return prop + '_' + state[prop]
  }
}

export function getCatData (category) {
  let cfg = getCatCfg(category)
  if (category === 'wtop') {
    return new VfCatWtopViewData(cfg)
  } else if (category === 'wshoes') {
    return new VfCatWshoesViewData(cfg)
  } else if (category === 'wpants') {
    return new VfCatWpantsViewData(cfg)
  } else {
    console.assert(false, 'Unknown category ' + category)
    return null
  }
}
