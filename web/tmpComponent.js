import React from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames'
import './TmpComponent.scss'

class TmpComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        TmpComponent
      </div>
    )
  }
}

TmpComponent.propTypes = {
}
TmpComponent.defaultProps = {
}
export default TmpComponent
