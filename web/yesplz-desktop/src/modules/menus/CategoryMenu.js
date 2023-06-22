import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setActiveCategory, enableInitialFetch } from '@yesplz/core-redux/ducks/products'
import TopMenu from '@yesplz/core-web/ui-kits/navigations/TopMenu'
import { Button } from '@yesplz/core-web/ui-kits/buttons'
import CategoryDivisorSrc from './category-divisor.png'
import CategoryMenuItem from './CategoryMenuItem'
import './category-menu.css'

class CategoryMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hoveredItem: ''
    }
    this.handleMenuClick = this.handleMenuClick.bind(this)
    this.handleMenuHover = this.handleMenuHover.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
  }

  handleMenuHover (categoryKey) {
    this.setState({ hoveredItem: categoryKey })
  }

  handleMenuClick (categoryKey) {
    const { enableInitialFetch, setActiveCategory } = this.props
    enableInitialFetch()
    setActiveCategory(categoryKey)
  }

  closeDropdown () {
    this.setState({
      hoveredItem: ''
    })
  }

  render () {
    const { hoveredItem } = this.state
    const { style } = this.props

    return (
      <TopMenu className='CategoryMenu' style={style} onMouseLeave={this.closeDropdown}>
        <CategoryMenuItem
          categoryKey='wtop'
          onClick={this.handleMenuClick}
          onMouseEnter={this.handleMenuHover}>
          Tops
        </CategoryMenuItem>
        <CategoryMenuItem
          categoryKey='wpants'
          onClick={this.handleMenuClick}
          onMouseEnter={this.handleMenuHover}>
          Jeans/Pants
        </CategoryMenuItem>
        <CategoryMenuItem
          categoryKey='wshoes'
          onClick={this.handleMenuClick}
          onMouseEnter={this.handleMenuHover}>
          Shoes
        </CategoryMenuItem>
        {renderMenuDropdown(hoveredItem)}
      </TopMenu>
    )
  }
}

CategoryMenu.propTypes = {
  enableInitialFetch: PropTypes.func.isRequired,
  setActiveCategory: PropTypes.func.isRequired,
  style: PropTypes.object
}

const renderMenuDropdown = (itemKey) => {
  switch (itemKey) {
    case 'wtop':
      return <MenuDropdown title='Tops' />
    case 'wshoes':
      return <MenuDropdown title='Shoes' />
    case 'wpants':
      return <MenuDropdown title='Pants' />
    default:
      return null
  }
}

/**
 * @todo: dummy still need refactor
 */
const MenuDropdown = ({ title }) => (
  <div className='CategoryMenu-dropdown animated fadeIn' style={styles.menuDropdown}>
    <div className='container-wide'>
      <div className='CategoryMenu-list'>
        <h5>{title}</h5>
        <ul>
          <li>turinics</li>
          <li>tank tops</li>
          <li>tank tops</li>
          <li>turinics item 1</li>
          <li className='is-active'>turinics</li>
          <li>tank tops</li>
          <li>turinics item 5</li>
          <li>turinics item</li>
          <li>turinics</li>
          <li>tank tops</li>
          <li>all tops</li>
        </ul>
      </div>
      <div className='CategoryMenu-rightCol'>
        <img src={CategoryDivisorSrc} className='CategoryMenu-categoryDivisor' />
        <div className='CategoryMenu-filterCategories'>
          <div className='CategoryMenu-list'>
            <h5>Occassions</h5>
            <ul>
              <li>work</li>
              <li className='is-active'>casual</li>
              <li>workout</li>
            </ul>
          </div>
          <div className='CategoryMenu-list'>
            <h5>Sales</h5>
            <ul>
              <li>30%</li>
              <li>50%</li>
              <li>70%</li>
            </ul>
          </div>
          <div className='CategoryMenu-list'>
            <h5>Prices</h5>
            <ul>
              <li>-$50</li>
              <li className='is-active'>$50 - $100</li>
              <li>$100 - $150</li>
              <li>$150 - $200</li>
              <li>$200 - $300</li>
            </ul>
          </div>
          <div className='CategoryMenu-list'>
            <h5>Sizes</h5>
            <ul>
              <li>regular</li>
              <li className='is-active'>plus</li>
              <li>petite</li>
              <li>my sizes!</li>
            </ul>
          </div>
        </div>
        <div className='CategoryMenu-buttonWrapper'>
          <Button className='ButtonTertiary'>Clear</Button>
          <Button className='ButtonTertiary'>Filter</Button>
        </div>
      </div>
    </div>
  </div>
)

MenuDropdown.propTypes = {
  title: PropTypes.string
}

const styles = {
  menuDropdown: {
    animationDuration: '500ms'
  }
}

export default connect(null, {
  setActiveCategory,
  enableInitialFetch
})(CategoryMenu)
