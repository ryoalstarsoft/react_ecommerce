import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import includes from 'lodash/includes'

import { formatPresetName } from '@yesplz/core-web/utils'
import history from '@yesplz/core-web/config/history'
import { AdvancedPresetList } from '@yesplz/core-web/modules/presets'
import ProductsVisualFilter from '../filters/ProductsVisualFilter'
import { CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS, CATEGORIES_LABELS } from '@yesplz/core-web/config/constants'
import { withTrackingProvider } from '@yesplz/core-web/hoc'
import { PageTitle, GroupTitle } from '@yesplz/core-web/ui-kits/misc'
import { Button } from '@yesplz/core-web/ui-kits/buttons'

import { NewProducts, ProductPresets, ProductsFilter, RecommendedProducts } from './index'
import { NotFound } from '../base'
import CategoryPicker from '../../ui-kits/navigations/CategoryPicker'

import './ProductsLandingPage.scss'

class ProductsLandingPage extends PureComponent {
  static propTypes = {
    match: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      isCategoryPickerVisible: false,
      isFilterVisible: false
    }
    this.handleTitleClick = this.handleTitleClick.bind(this)
    this.handleClosePicker = this.handleClosePicker.bind(this)
    this.handleFilterButtonClick = this.handleFilterButtonClick.bind(this)
    this.handleCloseFilter = this.handleCloseFilter.bind(this)
  }

  get currentCategory () {
    const { match } = this.props
    return match.params.category || CATEGORY_TOPS
  }

  handleTitleClick () {
    const { isCategoryPickerVisible } = this.state
    this.setState({
      isCategoryPickerVisible: !isCategoryPickerVisible
    })
  }

  handleClosePicker () {
    this.setState({
      isCategoryPickerVisible: false
    })
  }

  handleFilterButtonClick () {
    this.setState({
      isFilterVisible: true
    })
  }

  handleCloseFilter () {
    this.setState({
      isFilterVisible: false
    })
  }

  handleClickNewArrivals = () => {
    history.push(
      `/products/${this.currentCategory}/list?listingView=single&page=new`
    )
  }
  handleClickEditorPick = (preset) => () => {
    history.push(
      `/products/${this.currentCategory}/list?listingView=single&page=editorspick&preset=${formatPresetName(preset.name)}`
    )
  }

  render () {
    const { match } = this.props
    const { isCategoryPickerVisible, isFilterVisible } = this.state

    if (!includes([CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS], this.currentCategory)) {
      return <NotFound />
    }

    return (
      <div
        id='MainScroll'
        key={this.currentCategory}
        className='ProductsLandingPage'
        style={{ overflow: 'hidden' }}
      >
        <div className='container'>
          <PageTitle
            className={classNames('ProductsLandingPage-title', { 'is-opened': isCategoryPickerVisible })}
            showSwitch
            onFilterClick={this.handleFilterButtonClick}
            onTitleClick={this.handleTitleClick}
          >
            {CATEGORIES_LABELS[this.currentCategory]}
          </PageTitle>

          <GroupTitle onClickTitle={this.handleClickNewArrivals}>New Arrivals</GroupTitle>
          <NewProducts
            category={this.currentCategory}
            limitPerPage={20}
            isVertical
          />
          <Button kind='secondary' to={`/products/${this.currentCategory}/list`} style={styles.button}>See all new {CATEGORIES_LABELS[this.currentCategory]}</Button>

          <ProductPresets
            category={this.currentCategory}
          />

          <h2 className='SubHeader'>Editors Picks</h2>
          <AdvancedPresetList
            presetMatchesCount={20}
            activeCategory={this.currentCategory}
            useMinimalPreset
            onClickGroupTitle={this.handleClickEditorPick}
            hidePreset
          />

          <h2 className='SubHeader'>Explore</h2>
          <RecommendedProducts
            limitPerPage={20}
            category={this.currentCategory}
            enableFetchNext
            useScrollFetcher
          />
        </div>
        <CategoryPicker
          isVisible={isCategoryPickerVisible}
          category={match.params.category || CATEGORY_TOPS}
          onClose={this.handleClosePicker}
        />
        <ProductsFilter activeCategory={this.currentCategory} isVisible={isFilterVisible} onSubmit={this.handleCloseFilter} onClose={this.handleCloseFilter} />
        <ProductsVisualFilter hidden={isFilterVisible} activeCategory={this.currentCategory} />
      </div>
    )
  }
}

const styles = {
  button: {
    width: '100%',
    textTransform: 'uppercase'
  }
}

export default withTrackingProvider()(ProductsLandingPage)
