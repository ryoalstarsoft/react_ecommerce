import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import includes from 'lodash/includes'
import { FABRIC_COLORS } from '@yesplz/core-web/config/constants'
import { FilterButton } from '@yesplz/core-web/ui-kits/buttons'
import Transition from '@yesplz/core-web/ui-kits/transitions/Transition'
import ColorPallete from './ColorPallete'
// icons
import detailSVGSrc from '@yesplz/core-web/assets/svg/detail.svg'
import patternSVGSrc from '@yesplz/core-web/assets/svg/pattern.svg'
import colorSVGSrc from '@yesplz/core-web/assets/svg/color.svg'
// import angleSVGSrc from '@yesplz/core-web/assets/svg/angle.svg'

import './fabric-filters.css'

export default class FabricFilters extends PureComponent {
  static propTypes = {
    details: PropTypes.number,
    pattern: PropTypes.number,
    solid: PropTypes.number,
    color: PropTypes.string,
    kind: PropTypes.oneOf(['default', 'inline']),
    style: PropTypes.object,
    onChange: PropTypes.func,
    badgeMode: PropTypes.bool
  }

  static defaultProps = {
    details: 0,
    pattern: 0,
    solid: 0,
    color: null,
    kind: 'default',
    onChange: (filters) => { console.debug('FabricFilters - filters changed', filters) },
    badgeMode: false
  }

  constructor (props) {
    super(props)
    this.state = {
      collorPalleteVisible: false
    }
  }

  isActive (filter) {
    return filter === 1
  }

  get toggleColorPallete () {
    const { badgeMode } = this.props
    const { collorPalleteVisible } = this.state
    return () => {
      if (!badgeMode) {
        this.setState({ collorPalleteVisible: !collorPalleteVisible })
      }
    }
  }

  get handleClick () {
    const { details, pattern, solid, color, onChange, badgeMode } = this.props
    return (value, name) => {
      const filters = {
        details,
        pattern,
        solid,
        color
      }
      // toggle value, between 0 and 1
      const newValue = this.isActive(value) ? 0 : 1

      if (!badgeMode) {
        onChange({ ...filters, [name]: newValue })
      }
    }
  }

  get handleColorClick () {
    return (values) => {
      const { details, pattern, solid, badgeMode, onChange } = this.props
      const filters = {
        details,
        pattern,
        solid,
        color: values && values.join(',')
      }
      if (!badgeMode) {
        onChange(filters)
      }
    }
  }

  render () {
    const { details, pattern, solid, color, badgeMode, kind, style } = this.props
    const { collorPalleteVisible } = this.state
    const colorValues = color ? color.split(',') : []
    const isSingleColor = colorValues.length === 1

    // define text
    // let filterButtonChild = isSingleColor ? color : 'Colors'
    if (!badgeMode) {
      // filterButtonChild = <img src={angleSVGSrc} alt='color-picker' className='arrow' />
    }

    // color button style
    const colorHex = isSingleColor ? FABRIC_COLORS[color] : null
    const colorBackgroundImage = includes(['pastel', 'metal'], color) && colorHex // background image only applied for gradient color value
    const colorBorder = color === 'white' && '1px solid #3D3D3D'
    // end of color button style

    return (
      <div className={classNames('FabricFilters', { noEvents: badgeMode, [kind]: kind })} style={style}>
        <FilterButton
          name='solid'
          value={solid}
          onClick={this.handleClick}
          active={this.isActive(solid)}
          iconStyle={styles.solidIcon}>
          {/* Solid */}
        </FilterButton>
        <FilterButton
          name='details'
          value={details}
          onClick={this.handleClick}
          active={this.isActive(details)}
          iconSrc={detailSVGSrc}>
          {/* Details */}
        </FilterButton>
        <FilterButton
          name='pattern'
          value={pattern}
          onClick={this.handleClick}
          active={this.isActive(pattern)}
          iconSrc={patternSVGSrc}>
          {/* Patterns */}
        </FilterButton>
        <FilterButton
          name='color'
          value={color}
          onClick={this.toggleColorPallete}
          iconSrc={includes(['all', null], color) || !colorHex ? colorSVGSrc : null}
          iconStyle={{
            backgroundColor: colorHex,
            backgroundImage: colorBackgroundImage,
            border: colorBorder
          }}
          active
          className={classNames('ColorPicker', { open: collorPalleteVisible })}>
          {/* {filterButtonChild} */}
        </FilterButton>
        <Transition timeout={{ enter: 100, exit: 200 }} show={collorPalleteVisible}>
          <ColorPallete values={colorValues} onColorClick={this.handleColorClick} />
        </Transition>
      </div>
    )
  }
}

const styles = {
  solidIcon: {
    border: '1px solid #707070'
  }
}
