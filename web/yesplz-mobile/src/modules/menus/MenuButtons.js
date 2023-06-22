import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './MenuButtons.scss'

class MenuButtons extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menu: this.props.menu
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.menu) {
      this.setState({
        menu: nextProps.menu
      })
    }
  }

  onClickMenuItem = (item) => () => {
    this.props.onClickMenuItem(item)
    this.setActiveItem(item)
  }

  setActiveItem = (_item) => {
    this.setState({
      menu: this.state.menu.map(item => ({
        ...item,
        isActived: item.title === _item.title
      }))
    })
  }

  render () {
    return (
      <div className={classnames('MenuButtons')}>
        {
          this.state.menu.map(item => (
            <button onClick={this.onClickMenuItem(item)} className={classnames({
              actived: item.isActived
            })} key={item.title} >{item.title}</button>
          ))
        }
      </div>
    )
  }
}

MenuButtons.propTypes = {
  menu: PropTypes.array,
  onClickMenuItem: PropTypes.func
}

MenuButtons.defaultProps = {
  menu: [],
  onClickMenuItem () {}
}

export default MenuButtons
