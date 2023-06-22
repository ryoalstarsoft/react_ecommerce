/**
 * SimplePreset
 * simple version of preset, only contain bodypart image and title
 */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { VisualFilter } from '@yesplz/core-models'
import './simple-preset.css'

const filterProps = PropTypes.oneOfType([
  PropTypes.number, PropTypes.string
])

export default class SimplePreset extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    coretype: filterProps,
    details: filterProps,
    neckline: filterProps,
    pattern: filterProps,
    shoulder: filterProps,
    sleeveLength: filterProps,
    solid: filterProps,
    color: filterProps,
    topLength: filterProps,
    category: PropTypes.string,
    className: filterProps,
    style: PropTypes.object,
    onClick: PropTypes.func.isRequired
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
    const { coretype, neckline, shoulder, sleeveLength, topLength } = this.props
    return {
      coretype, neckline, shoulder, sleeve_length: sleeveLength, top_length: topLength
    }
  }

  get fabricFilters () {
    const { details, pattern, solid, color } = this.props
    return { details, pattern, solid, color }
  }

  componentDidMount () {
    const { id } = this.props
    // initialize body part
    this.bodyPart = new VisualFilter(`#${id}`, {
      defaultState: this.bodyPartFilters,
      badgeMode: true,
      hideThumbnail: true
    })
  }

  get handleClick () {
    const { name, category, onClick } = this.props
    return () => {
      const filters = {
        ...this.bodyPartFilters,
        ...this.fabricFilters
      }
      onClick(filters, name, category)
    }
  }

  render () {
    const { id, name, className, style } = this.props

    return (
      <div onClick={this.handleClick} className={classNames('SimplePreset', { [className]: className })} style={style}>
        <h5>{name}</h5>
        <div className='SimplePreset-svg'>
          <svg id={id} />
        </div>
      </div>
    )
  }
}
