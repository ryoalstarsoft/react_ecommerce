import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AdvancedPresetList } from '@yesplz/core-web/modules/presets'
import { withTrackingProvider } from '@yesplz/core-web/hoc'
import { CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS } from '@yesplz/core-web/config/constants'
import { GroupTitle } from '@yesplz/core-web/ui-kits/misc'
import ProductsVisualFilter from '../filters/ProductsVisualFilter'

import HomeSlider from './HomeSlider'
import { NewProducts, RecommendedProducts } from '../products'

// utls
import { formatPresetName } from '@yesplz/core-web/utils/index'

import './home.css'

class Home extends Component {
  static propTypes = {
    history: PropTypes.func
  }

  handleClickNewProductsTitle = category => () => {
    this.props.history.push(`/products/${category}`)
  }

  handleClickNewArrivals = category => () => {
    this.props.history.push(`/products/${category}/list?listingView=single&page=new`)
  }

  handleClickSlideItem = category => () => {
    this.props.history.push(`/products/${category}`)
  }

  handleClickEditorPick = (preset) => () => {
    this.props.history.push(
      `/products/${preset.category}/list?listingView=single&page=editorspick&preset=${formatPresetName(preset.name)}`
    )
  }

  render () {
    return (
      <div className='Home'>
        <HomeSlider onClickSlideItem={this.handleClickSlideItem} />
        <div style={{ overflowX: 'hidden' }}>
          <div className='container'>
            <GroupTitle onClickTitle={this.handleClickNewArrivals(CATEGORY_TOPS)}>New Tops</GroupTitle>
            <NewProducts
              title='New Tops'
              category={CATEGORY_TOPS}
              limitPerPage={20}
              onProductPresetClick={this.handleClickNewProductsTitle(CATEGORY_TOPS)}
            />
            <GroupTitle onClickTitle={this.handleClickNewArrivals(CATEGORY_PANTS)}>New Pants</GroupTitle>
            <NewProducts
              title='New Pants'
              category={CATEGORY_PANTS}
              limitPerPage={20}
              onProductPresetClick={this.handleClickNewProductsTitle(CATEGORY_PANTS)}
            />
            <GroupTitle onClickTitle={this.handleClickNewArrivals(CATEGORY_SHOES)}>New Shoes</GroupTitle>
            <NewProducts
              title='New Shoes'
              category={CATEGORY_SHOES}
              limitPerPage={20}
              onProductPresetClick={this.handleClickNewProductsTitle(CATEGORY_SHOES)}
            />
          </div>
        </div>
        <div style={{ overflowX: 'hidden' }}>
          <div className='container'>
            <h2 className='SubHeader'>Editors Picks</h2>
            <AdvancedPresetList
              presetMatchesCount={20}
              useMinimalPreset
              onClickGroupTitle={this.handleClickEditorPick}
              hidePreset
            />
          </div>
        </div>
        <ProductsVisualFilter hidden={false} activeCategory={CATEGORY_TOPS} />
        <div className='container'>
          <h2 className='SubHeader'>Explore</h2>
          <RecommendedProducts
            limitPerPage={20}
            enableFetchNext
            useScrollFetcher
          />
        </div>
      </div>
    )
  }
}

export default withTrackingProvider('Home')(Home)
