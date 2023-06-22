import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
import FavoritesSvg from '@yesplz/core-web/assets/svg/favorites.svg'
import { VisualFilter } from '@yesplz/core-models'
import history from '@yesplz/core-web/config/history'
import MenuButton from '../menus/MenuButton'
import SidebarMenu from '../menus/SidebarMenu'
import { connect } from 'react-redux'
import './base.css'

class Base extends Component {
  static propTypes = {
    children: PropTypes.element,
    location: PropTypes.object,
    expanded: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      menuOpened: false,
      hideMenuButton: false,
      stickyHeader: false
    }
    this.toggleSidebarMenu = this.toggleSidebarMenu.bind(this)
    this.handleSidebarMenuClose = this.handleSidebarMenuClose.bind(this)
    this.handleMenuGroupChange = this.handleMenuGroupChange.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
  }

  componentDidMount () {
    // when onboarding active, show the tutorial page first
    if (VisualFilter.shouldShowOnboarding()) {
      history.push('/tutorial')
    }
    this.initializeHeaderScroll()
  }

  /**
   * sticky header
   */
  initializeHeaderScroll () {
    document.addEventListener('touchmove', (el) => {
      const { stickyHeader } = this.state
      // const scrollTop = el.target.documentElement.scrollTop
      const scrollTop = window.pageYOffset
      if (!stickyHeader && scrollTop > 40) {
        this.setState({
          stickyHeader: true
        })
      }

      if (stickyHeader && scrollTop <= 40) {
        this.setState({
          stickyHeader: false
        })
      }
    })
  }

  get isProductDetailPage() {
    const { location } = this.props
    return /^\/products\//.test(location.pathname)
  }

  get isFavoritesPage() {
    const { location } = this.props
    return /^\/favorites\/[a-zA-Z]$/.test(location.pathname)
  }

  get handleHomeLinkActive() {
    return match => match // || this.isProductDetailPage
  }

  get handleFavoritesLinkActive() {
    return () => {
      const { location } = this.props
      return /^\/favorites\/(fits|clothing)$/.test(location.pathname)
    }
  }

  get handleLinkClick() {
    return () => {
      const scrollWrapper = document.getElementById('MainScroll')
      if (scrollWrapper) {
        scrollWrapper.scrollTop = 0
      }
    }
  }

  toggleSidebarMenu() {
    const { menuOpened } = this.state
    this.setState({
      menuOpened: !menuOpened
    })
  }

  handleSidebarMenuClose(done = () => { }) {
    this.setState({
      menuOpened: false
    }, () => {
      setTimeout(() => {
        done(true)
      }, 300) // callback when sidebar has closed
    })
  }

  handleMenuGroupChange(groupKey) {
    this.setState({
      hideMenuButton: groupKey !== 'main'
    })
  }

  handleCategoryChange(category) {
    console.debug('category changed', category)
  }

  get isListProductPage () {
    return () => {
      const { location } = this.props
      return /^\/products\/(wtop|wpants|wshoes)\/list$/.test(location.pathname)
    }
  }

  render () {
    const { children } = this.props
    const { menuOpened, hideMenuButton, stickyHeader } = this.state

    return (
      <div id='Base-mobile' className='Base'>
        {
          (!this.props.expanded || !this.isListProductPage()) && (
            <div className={classNames('Base-header', { 'is-sticky': stickyHeader })}>
              <div className='container-wide Base-header-container'>
                <div style={styles.buttonMenuWrapper}>
                  {!hideMenuButton && <MenuButton closeMode={menuOpened} onClick={this.toggleSidebarMenu} />}
                </div>
                <NavLink
                  exact
                  to={'/'}
                  onClick={this.handleLinkClick}
                  isActive={this.handleHomeLinkActive}
                  className='logo'>
                  YESPLZ
                </NavLink>
                <NavLink
                  to={this.isFavoritesPage ? '#' : '/favorites/items'}
                  onClick={this.handleLinkClick}
                  isActive={this.handleFavoritesLinkActive}
                  className='menu-icon'>
                  <img src={FavoritesSvg} alt='Favorites Page' />
                </NavLink>
                <SidebarMenu
                  opened={menuOpened}
                  onCategoryChange={this.handleCategoryChange}
                  onClose={this.handleSidebarMenuClose}
                  onMenuGroupChange={this.handleMenuGroupChange}
                />
              </div>
            </div>
          )
        }
        {children}
      </div>
    )
  }
}

const styles = {
  buttonMenuWrapper: {
    width: 40,
    height: 40,
    flexShrink: 0
  }
}

const mapStateToProps = state => ({
  expanded: state.filters.expanded
})

export default connect(mapStateToProps)(Base)
