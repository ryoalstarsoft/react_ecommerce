import React, { Component } from 'react'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Switch } from '@yesplz/core-web/ui-kits/forms'
import { withFocus } from '../../hoc'
import './design-filters.css'

export class DesignFilters extends Component {
  static propTypes = {
    solid: PropTypes.bool,
    pattern: PropTypes.bool,
    details: PropTypes.bool,
    className: PropTypes.string,
    classes: PropTypes.object,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    solid: false,
    pattern: false,
    details: false,
    classes: {},
    onChange: (value, name) => {}
  }

  get handleChange () {
    return (event) => {
      const name = event.target.value
      const value = event.target.checked

      // update current value
      this.props.onChange(value, name)

      // when solid is active, pattern should be inactive. Vice versa.
      // add delay, so initial value will be changed first
      setTimeout(() => {
        if (name === 'solid' && value) {
          this.props.onChange(false, 'pattern')
        } else if (name === 'pattern' && value) {
          this.props.onChange(false, 'solid')
        }
      }, 50)
    }
  }

  render () {
    const { solid, pattern, details, className, classes } = this.props
    return (
      <div className={classNames('DesignFilters', { [className]: className })}>
        <FormControlLabel
          label='Solid'
          labelPlacement='start'
          control={
            <Switch
              checked={solid}
              onChange={this.handleChange}
              value='solid'
            />
          }
          className={classes.controlLabel}
        />
        <FormControlLabel
          label='Pattern'
          labelPlacement='start'
          control={
            <Switch
              checked={pattern}
              onChange={this.handleChange}
              value='pattern'
            />
          }
          className={classes.controlLabel}
        />
        <FormControlLabel
          label='Detail'
          labelPlacement='start'
          control={
            <Switch
              checked={details}
              onChange={this.handleChange}
              value='details'
            />
          }
          className={classes.controlLabel}
        />
      </div>
    )
  }
}

const styles = theme => ({
  controlLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginLeft: 0,
    marginRight: -15
  }
})

export default compose(withStyles(styles), withFocus(true))(DesignFilters)
