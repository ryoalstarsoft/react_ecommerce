import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MaterialSwitch from '@material-ui/core/Switch'

export const Switch = (props) => (
  <MaterialSwitch {...props} />
)

const styles = {
  bar: {
    backgroundColor: '#9B9B9B'
  },
  icon: {
    color: '#FFFFFF'
  },
  iconChecked: {
    color: '#6200EE'
  },
  switchBase: {
    marginRight: -8
  },
  checked: {
    color: '#6200EE!important',
    '& + $bar': {
      backgroundColor: '#6200EE!important'
    }
  }
}

export default withStyles(styles)(Switch)
