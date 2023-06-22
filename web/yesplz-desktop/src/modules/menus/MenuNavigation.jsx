import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './MenuNavigation.scss'

class MenuNavigation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menu: this.props.menu
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
    const { YFilter } = this.props
    return (
      <div className={classnames('MenuNavigation')}>
        {
          this.state.menu.map(item => (
            <button onClick={this.onClickMenuItem(item)} className={classnames({
              actived: item.isActived
            })} key={item.title} >{item.title}</button>
          ))
        }
        {
          YFilter && YFilter
        }
      </div>
    )
  }
}

MenuNavigation.propTypes = {
  menu: PropTypes.array,
  onClickMenuItem: PropTypes.func,
  YFilter: PropTypes.any
}

MenuNavigation.defaultProps = {
  menu: [],
  onClickMenuItem () { }
}

export default MenuNavigation
