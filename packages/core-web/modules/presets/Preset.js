import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FabricFilters } from '@yesplz/core-web/modules/filters'
import { VisualFilter } from '@yesplz/core-models'
import { LikeButton } from '@yesplz/core-web/ui-kits/buttons'
import './preset.scss'

const filterProps = PropTypes.oneOfType([
  PropTypes.number, PropTypes.string
])

export default class Preset extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    presetKey: PropTypes.string,
    name: PropTypes.string,
    coretype: filterProps,
    details: filterProps,
    neckline: filterProps,
    pattern: filterProps,
    shoulder: filterProps,
    sleeveLength: filterProps,
    solid: filterProps,
    color: filterProps,
    category: PropTypes.string,
    topLength: filterProps,
    className: filterProps,
    favorite: PropTypes.bool,
    style: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    onToggleLike: PropTypes.func.isRequired,
    bottoms: PropTypes.number,
    counters: PropTypes.counters,
    covers: PropTypes.covers,
    shafts: PropTypes.shafts,
    toes: PropTypes.toes,
    ankle: PropTypes.ankle,
    knee: PropTypes.knee,
    rise: PropTypes.rise,
    thigh: PropTypes.thigh
  }

  static defaultProps = {
    name: 'unknown',
    coretype: 0,
    details: 0,
    neckline: 0,
    pattern: 0,
    shoulder: 0,
    sleeveLength: 0,
    solid: 0,
    topLength: 0,
    color: null,
    favorite: false
  }

  get bodyPartFilters () {
    const { coretype, neckline, shoulder, sleeveLength, topLength, bottoms, counters, covers, shafts, toes, ankle, knee, rise, thigh } = this.props
    return {
      coretype, neckline, shoulder, sleeve_length: sleeveLength, top_length: topLength, bottoms, counters, covers, shafts, toes, ankle, knee, rise, thigh
    }
  }

  get fabricFilters () {
    const { details, pattern, solid, color } = this.props
    return { details, pattern, solid, color }
  }

  componentDidMount () {
    const { id, category } = this.props
    // initialize body part
    this.bodyPart = new VisualFilter(`#${id}-svg`, {
      defaultState: this.bodyPartFilters,
      badgeMode: true,
      hideThumbnail: true,
      category
    })
  }

  get handleClick () {
    const { name, onClick, category, presetKey } = this.props
    return () => {
      const filters = {
        ...this.bodyPartFilters,
        ...this.fabricFilters
      }
      onClick(filters, name, category, presetKey)
    }
  }

  get toggleLike () {
    const { presetKey, name, favorite, onToggleLike } = this.props
    return (e) => {
      e.preventDefault()
      e.stopPropagation()

      const preset = {
        key: presetKey,
        name,
        ...this.bodyPartFilters,
        ...this.fabricFilters
      }

      onToggleLike(preset, !favorite)
    }
  }

  render () {
    const { id, presetKey, className, favorite, style } = this.props

    return (
      <div id={id} onClick={this.handleClick} className={classNames('Preset', { [className]: className })} style={style}>
        <div className='Preset-svg'>
          <LikeButton active={favorite} onClick={this.toggleLike} />
          <svg id={`${id}-svg`} />
        </div>
        <div className='Preset-filter'>
          <div className='Preset-name'>{presetKey.replace('-', ' ')}</div>
          <FabricFilters {...this.fabricFilters} badgeMode />
        </div>
      </div>
    )
  }
}
