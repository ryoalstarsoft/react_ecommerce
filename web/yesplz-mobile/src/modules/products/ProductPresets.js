import React, { PureComponent } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import omit from 'lodash/omit'

import { CATEGORY_TOPS } from '@yesplz/core-web/config/constants'
import { fetchPresets, syncFavoriteProducts } from '@yesplz/core-redux/ducks/products'
import withProductLike from '@yesplz/core-web/hoc/withProductLike'
import StatefulCategorizedProducts from './StatefulCategorizedProducts'

// utls
import { formatPresetName } from '@yesplz/core-web/utils/index'

class ProductPresets extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    category: PropTypes.string,
    presetName: PropTypes.string,
    presets: PropTypes.array,
    favoriteProducts: PropTypes.array,
    fetchPresets: PropTypes.func.isRequired,
    syncFavoriteProducts: PropTypes.func.isRequired,
    toggleProductLike: PropTypes.func.isRequired
  }

  static defaultProps = {
    category: CATEGORY_TOPS,
    presets: [],
    favoriteProducts: [],
    presetName: null
  }

  componentDidMount () {
    const { category, fetchPresets, syncFavoriteProducts } = this.props

    fetchPresets(category)
    syncFavoriteProducts()
  }

  filterWithPreset = preset => this.props.presetName ? formatPresetName(preset.name) === this.props.presetName : true

  onProductPresetClick = preset => () => {
    if (this.props.presetName) {
      console.log(this.props.presetName)
    } else {
      this.props.history.push(`/preset-products/${this.props.category}/${formatPresetName(preset.name)}`)
    }
  }

  render () {
    const { category, presetName, presets, favoriteProducts, toggleProductLike } = this.props

    return presets.filter(this.filterWithPreset).map(preset => (
      <StatefulCategorizedProducts
        key={preset.name}
        title={presetName ? 'NEW ARIAVLS' : preset.name}
        category={category}
        favoriteProducts={favoriteProducts}
        filters={omit(preset, ['name', 'category'])}
        limitPerPage={20}
        onProductLike={toggleProductLike}
        onProductPresetClick={this.onProductPresetClick(preset)}
      />
    ))
  }
}

const mapStateToProps = (state, props) => ({
  presets: state.products[props.category].presets,
  favoriteProducts: state.products.favoriteList
})

export default withRouter(
  compose(
    connect(mapStateToProps, { fetchPresets, syncFavoriteProducts }),
    withProductLike()
  )(ProductPresets)
)
