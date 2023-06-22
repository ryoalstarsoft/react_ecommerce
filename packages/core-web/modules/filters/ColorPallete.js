import React, { Component } from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import without from 'lodash/without'
import includes from 'lodash/includes'
import classNames from 'classnames'
import { FABRIC_COLORS } from '@yesplz/core-web/config/constants'
import { ColorButton } from '@yesplz/core-web/ui-kits/buttons'
import ClearSvg from '../../assets/svg/clear.svg'
import { withFocus } from '../../hoc'
import { Tracker } from '@yesplz/core-models'
import './ColorPallete.scss'

export class ColorPallete extends Component {
  static propTypes = {
    values: PropTypes.array,
    onColorClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    values: []
  }

  constructor (props) {
    super(props)
    this.state = {
      values: []
    }
  }

  componentDidMount () {
    const { values } = this.props
    this.setState({ values })
  }

  get handleClick () {
    const { onColorClick } = this.props
    const { values } = this.state
    return (name) => {
      const colorPicked = values.indexOf(name) > -1
      let newValues = null
      // if color picked, remove it from the picked list
      // else, addit to the picked list
      if (colorPicked) {
        newValues = without(values, name)
      } else {
        newValues = [ ...values, name ]
      }

      this.setState({
        values: newValues
      })

      onColorClick(newValues)
      Tracker.track(`Press ${name} color button`, { values: newValues })
    }
  }

  get clearSelection () {
    return () => {
      this.setState({
        values: []
      })
      this.props.onColorClick([])
      Tracker.track('Press clear color button')
    }
  }

  render () {
    const { className, style } = this.props
    const { values } = this.state

    return (
      <div className={classNames('ColorPallete', { [className]: className })} style={style}>
        {
          map(FABRIC_COLORS, (color, name) => (
            <ColorButton active={includes(values, name)} key={name} name={name} color={color} onClick={this.handleClick} invert={name === 'white'} />
          ))
        }
        <button className='ColorPallete-clear' onClick={this.clearSelection}>
          <img src={ClearSvg} />
        </button>
      </div>
    )
  }
}

export default withFocus(true)(ColorPallete)
