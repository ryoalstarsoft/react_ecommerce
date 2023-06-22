import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import omit from 'lodash/omit'
import reduce from 'lodash/reduce'
import isBoolean from 'lodash/isBoolean'
import throttle from 'lodash/throttle'
import Button from '@yesplz/core-web/ui-kits/buttons/Button'
import Transition from '@yesplz/core-web/ui-kits/transitions/Transition'
import ColorPallete from './ColorPallete'
import DesignFilters from './DesignFilters'
import { Tracker } from '@yesplz/core-models'
import './secondary-filters.css'

export default class SecondaryFilters extends Component {
  static propTypes = {
    sale: PropTypes.number,
    fabricFilters: PropTypes.shape({
      details: PropTypes.number,
      pattern: PropTypes.number,
      solid: PropTypes.number,
      color: PropTypes.string
    }),
    style: PropTypes.object,
    onChange: PropTypes.func
  }

  static defaultProps = {
    sale: 0,
    fabricFilters: {},
    kind: 'default',
    onChange: (filters) => { console.debug('SecondaryFilters - filters changed', filters) }
  }

  constructor (props) {
    super(props)
    this.state = {
      collorPalleteVisible: false,
      designFiltersVisible: false
    }

    // initialize toggle handler
    this.toggleDesignPanel = this.makeTogglePanelHandler('designFiltersVisible', 'Press design button')
    this.toggleColorPallete = this.makeTogglePanelHandler('collorPalleteVisible', 'Press color pallete button')
  }

  isActive (filter) {
    return filter === 1
  }

  updateFilter (name, value) {
    const { sale, fabricFilters, onChange } = this.props
    const filters = {
      sale,
      ...fabricFilters,
      ...(name ? { [name]: value } : null)
    }
    onChange(filters)
  }

  /**
   * create handler to change visibility of a panel
   * @param {string} panelKey
   * @param {string} trackEventName
   * @return {function} handler
   */
  makeTogglePanelHandler (panelKey, trackEventName) {
    // add throttle so event bubling at the same element won't update multiple times
    return throttle((isVisible) => {
      // update panel visibilityt based on current state / provided value
      this.setState((prevState) => {
        const isPanelVisible = prevState[panelKey]
        return {
          // if isVisible is boolean, then use it to set next state
          [panelKey]: isBoolean(isVisible) ? isVisible : !isPanelVisible
        }
      })

      Tracker.track(trackEventName)
    }, 500, { leading: true, trailing: false }) // use the first event
  }

  get handleColorClick () {
    return (values) => {
      this.updateFilter('color', values && values.join(','))
    }
  }

  get handleDesignChange () {
    return (value, name) => {
      this.updateFilter(name, value ? 1 : 0)
      Tracker.track(`Press ${name} filter button`, { active: value })
    }
  }

  get handleSaleChange () {
    const { sale } = this.props
    return () => {
      const activate = sale === 0
      this.updateFilter('sale', activate ? 1 : 0)

      Tracker.track('Press sale filter button', { active: activate })
    }
  }

  render () {
    const { sale, fabricFilters, style } = this.props
    const { collorPalleteVisible, designFiltersVisible } = this.state

    const colorValues = fabricFilters.color ? fabricFilters.color.split(',') : []
    const colorFilterPicked = colorValues.length > 0
    const designFiltersPicked = reduce(omit(fabricFilters, 'color'), (isPicked, filter) => (isPicked || filter === 1), false)

    return (
      <div className='SecondaryFilters' style={style}>
        <Button kind='rounded' className={classNames({ active: sale === 1 })} onClick={this.handleSaleChange}>Sale</Button>
        <Button
          kind='rounded'
          className={classNames({ focus: designFiltersVisible, active: designFiltersPicked })}
          onClick={this.toggleDesignPanel}>
          Design
        </Button>
        <Button
          kind='rounded'
          className={classNames({ focus: collorPalleteVisible, active: colorFilterPicked })}
          onClick={this.toggleColorPallete}>
          Color
        </Button>
        <Transition timeout={{ enter: 100, exit: 200 }} show={designFiltersVisible}>
          <DesignFilters
            solid={this.isActive(fabricFilters.solid)}
            pattern={this.isActive(fabricFilters.pattern)}
            details={this.isActive(fabricFilters.details)}
            onChange={this.handleDesignChange}
            onFocusChange={this.toggleDesignPanel}
          />
        </Transition>
        <Transition timeout={{ enter: 100, exit: 200 }} show={collorPalleteVisible}>
          <ColorPallete
            values={colorValues}
            onColorClick={this.handleColorClick}
            onFocusChange={this.toggleColorPallete}
          />
        </Transition>
      </div>
    )
  }
}
