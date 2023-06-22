import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
import ArrowLine from '@yesplz/core-web/ui-kits/icons/ArrowLine'
import SidebarMenuGroup from './SidebarMenuGroup'
import SidebarMenuItem from './SidebarMenuItem'
import history from '@yesplz/core-web/config/history'
// import TopsFilterMenu from './TopsFilterMenu'
import CategoryMenu from './CategoryMenu'

// actions
import { fetchAllPresets } from '@yesplz/core-redux/ducks/products/actions'

// constants
import {
  // CATEGORY_PANTS,
  // CATEGORY_SHOES,
  // CATEGORY_TOPS
  CATEGORIES_LABELS
} from '@yesplz/core-web/config/constants'
import { formatPresetName } from '@yesplz/core-web/utils/index'

import './SidebarMenu.scss'

class SidebarMenu extends PureComponent {
  static propTypes = {
    opened: PropTypes.bool,
    onClose: PropTypes.func,
    presetsCategory: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    onCategoryChange: PropTypes.func.isRequired,
    onMenuGroupChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    opened: false,
    presetsCategory: {},
    onClose: () => { }
  }

  constructor (props) {
    super(props)

    this.state = {
      activeGroupKey: 'main',
      activeMainMenuKey: 'home'
    }

    this.handleLinkClick = this.handleLinkClick.bind(this)
    this.changeCategory = this.changeCategory.bind(this)
    this.changeMenuGroup = this.changeMenuGroup.bind(this)
    this.resetMenuGroup = this.resetMenuGroup.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  componentDidMount () {
    this.props.dispatch(fetchAllPresets())
  }

  handleLinkClick () {
    const { onClose } = this.props
    const scrollWrapper = document.getElementById('MainScroll')
    if (scrollWrapper) {
      scrollWrapper.scrollTop = 0
    }

    onClose()
  }

  changeCategory (categoryKey) {
    const { onCategoryChange, onClose } = this.props
    onCategoryChange(categoryKey)
    onClose()
  }

  changeMenuGroup (menuKey) {
    const { onMenuGroupChange } = this.props
    this.setState({ activeGroupKey: menuKey })
    onMenuGroupChange(menuKey)
  }

  resetMenuGroup () {
    const { onMenuGroupChange } = this.props
    this.setState({ activeGroupKey: 'main' })
    onMenuGroupChange('main')
  }

  handleFilterChange (category, presetName) {
    // this.setState({
    //   activeMainMenuKey: 'main'
    // })
    this.resetMenuGroup()
    this.props.onClose(() => {
      if (presetName === 'all') {
        history.push(`/products/${category}`)
      } else {
        history.push(`/preset-products/${category}/${formatPresetName(presetName)}`)
      }
    })
  }

  render () {
    const { opened, presetsCategory } = this.props
    const { activeGroupKey, activeMainMenuKey } = this.state

    return (
      <div className={classNames('SidebarMenu', { 'is-opened': opened })}>
        <div className='SidebarMenu-back' onClick={this.resetMenuGroup}>
          <ArrowLine direction='left' />
        </div>
        <SidebarMenuGroup eventKey='main' activeKey={activeGroupKey}>
          <SidebarMenuItem eventKey='home' activeKey={activeMainMenuKey} to='/' onClick={this.handleLinkClick}>
            Home
          </SidebarMenuItem>
          {/* category menu */}
          {
            Object.entries(presetsCategory).map(([category, presets], index) => (
              <SidebarMenuItem key={index} eventKey={category} activeKey={activeMainMenuKey} onClick={this.changeMenuGroup}>
                {CATEGORIES_LABELS[category]}
              </SidebarMenuItem>
            ))
          }
          {/* <SidebarMenuItem eventKey='tops' activeKey={activeMainMenuKey} onClick={this.changeMenuGroup}>
            Tops
          </SidebarMenuItem>
          <SidebarMenuItem eventKey='pants' activeKey={activeMainMenuKey} onClick={this.changeMenuGroup}>
            Jeans
          </SidebarMenuItem>
          <SidebarMenuItem eventKey='shoes' activeKey={activeMainMenuKey} onClick={this.changeMenuGroup}>
            Shoes
          </SidebarMenuItem> */}
          {/* end of category menu */}
          <div className='SidebarMenu-separator' style={{ marginTop: 44 }} />
          <NavLink to='/favorites/items' onClick={this.handleLinkClick}>
            Favorites
          </NavLink>
          <div className='SidebarMenu-separator' style={{ marginBottom: 44 }} />
          <NavLink to='/profile/sizes/wtop/regular' onClick={this.handleLinkClick}>
            Profile
          </NavLink>
          <NavLink to='/faq' onClick={this.handleLinkClick}>
            FAQ
          </NavLink>
        </SidebarMenuGroup>
        {
          Object.entries(presetsCategory).map(([category, presets]) => (
            <SidebarMenuGroup key={category} eventKey={category} activeKey={activeGroupKey}>
              {
                presets.length ? (
                  <CategoryMenu
                    presets={presets}
                    onFilterChange={this.handleFilterChange}
                  />
                ) : (
                  <p style={styles.menuNA}>Not Available</p>
                )
              }

            </SidebarMenuGroup>
          ))
        }
        {/* <SidebarMenuGroup eventKey='tops' activeKey={activeGroupKey}>
          <TopsFilterMenu onFilterChange={this.handleFilterChange} />
        </SidebarMenuGroup>
        <SidebarMenuGroup eventKey='pants' activeKey={activeGroupKey}>
          <p style={styles.menuNA}>Not Available</p>
        </SidebarMenuGroup>
        <SidebarMenuGroup eventKey='shoes' activeKey={activeGroupKey}>
          <p style={styles.menuNA}>Not Available</p>
        </SidebarMenuGroup> */}
      </div>
    )
  }
}

const styles = {
  menuNA: {
    color: 'inherit',
    fontWeight: 'bold',
    lineHeight: '1.4em',
    letterSpacing: '5.2px',
    textDecoration: 'none',
    textTransform: 'uppercase',
    paddingTop: '20px',
    paddingBottom: '20px',
    opacity: '0.3'
  }
}

const mapStateToProps = state => {
  return {
    presetsCategory: state.products.presetsCategory
  }
}

export default connect(mapStateToProps)(SidebarMenu)
