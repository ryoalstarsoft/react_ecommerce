import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import YesplzLogoSvg from '@yesplz/core-web/assets/svg/yesplz-logo.svg'
import UserSvg from '@yesplz/core-web/assets/svg/user.svg'
import BurgerSvg from '@yesplz/core-web/assets/svg/burger.svg'
import FavoritesSvg from '@yesplz/core-web/assets/svg/favorites.svg'
import FilterToggle from '../filters/FilterToggle'
import CategoryMenu from '../menus/CategoryMenu'
import './base.css'

class Base extends Component {
  static propTypes = {
    activeCategory: PropTypes.string,
    children: PropTypes.element,
    location: PropTypes.object
  }

  get isProductDetailPage () {
    const { location } = this.props
    return /^\/products\//.test(location.pathname)
  }

  get isFavoritesPage () {
    const { location } = this.props
    return /^\/favorites\//.test(location.pathname)
  }

  get handleHomeLinkActive () {
    return match => match // || this.isProductDetailPage
  }

  get handleFavoritesLinkActive () {
    return () => {
      const { location } = this.props
      return /^\/favorites\/(fits|clothing)$/.test(location.pathname)
    }
  }

  get handleLinkClick () {
    return () => {
      const scrollWrapper = document.getElementById('MainScroll')
      if (scrollWrapper) {
        scrollWrapper.scrollTop = 0
      }
    }
  }

  render () {
    const { activeCategory, children } = this.props

    return (
      <div id='Base-desktop' className='Base' key={activeCategory}>
        <div className='Base-header'>
          <div className='Base-headerContainer'>
            <NavLink
              to='/faq'
              onClick={this.handleLinkClick}
              className='menu-icon menu-icon-sidebar'>
              <div>=</div>
              {/* <img src={BurgerSvg} alt='FAQ Page' /> */}
            </NavLink>
            <NavLink
              exact
              to={'/'}
              onClick={this.handleLinkClick}
              isActive={this.handleHomeLinkActive}
              className='logo'>
              YESPLZ
              {/* <img src={YesplzLogoSvg} alt='YesPlz' /> */}
            </NavLink>
            <div className='Base-rightNav'>
              <NavLink
                to={this.isFavoritesPage ? '#' : '/favorites/items'}
                onClick={this.handleLinkClick}
                isActive={this.handleFavoritesLinkActive}
                className='menu-icon'>
                <img src={FavoritesSvg} alt='Favorites Page' />
              </NavLink>
              <NavLink to='/products' onClick={this.handleLinkClick} className='menu-icon'>
                <img src={UserSvg} alt='Visual Filter Page' style={{ width: 17 }} />
              </NavLink>
            </div>
          </div>
        </div>
        {/* <CategoryMenu /> */}
        {children}
        <FilterToggle />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  activeCategory: state.products.activeCategory
})

export default connect(mapStateToProps)(Base)
