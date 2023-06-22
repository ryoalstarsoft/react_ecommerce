import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import camelCase from 'lodash/camelCase'
import history from '@yesplz/core-web/config/history'
import { enableInitialFetch } from '@yesplz/core-redux/ducks/products'
import { fetchPresets, setFilter, likePreset, unlikePreset } from '@yesplz/core-redux/ducks/filters'
import Transition from '@yesplz/core-web/ui-kits/transitions/Transition'
import { DotLoader } from '@yesplz/core-web/ui-kits/loaders'
import AdvancedPreset from './AdvancedPreset'
import { withTrackingConsumer } from '../../hoc'

// utils
import { formatPresetName } from '@yesplz/core-web/utils/index'

export class AdvancedPresetList extends Component {
  static propTypes = {
    presets: PropTypes.array,
    isPresetsFetched: PropTypes.bool,
    presetMatchesCount: PropTypes.number,
    activeCategory: PropTypes.string,
    activePresetName: PropTypes.string,
    fetchPresets: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    likePreset: PropTypes.func.isRequired,
    unlikePreset: PropTypes.func.isRequired,
    enableInitialFetch: PropTypes.func.isRequired,
    tracker: PropTypes.object,
    useMinimalPreset: PropTypes.bool,
    hidePreset: PropTypes.bool,
    titleBellowPreset: PropTypes.bool,
    defaultViewBoxSvg: PropTypes.array,
    style: PropTypes.object,
    onClickGroupTitle: PropTypes.func
  }

  static defaultProps = {
    presets: [],
    useMinimalPreset: false,
    isPresetsFetched: false,
    titleBellowPreset: false,
    hidePreset: false,
    onClickGroupTitle () { }
  }

  componentDidMount () {
    const { activeCategory, activePresetName, fetchPresets } = this.props
    // don't need to do initial fetch if presets is fetched already
    // I dont think so. When user change product preset, we need fetch editor-picks again
    // if (!this.props.isPresetsFetched) {
    if (activePresetName) {
      fetchPresets(activeCategory, { subcat: activePresetName })
    } else {
      if (activeCategory) {
        fetchPresets(activeCategory)
      } else {
        // we will fetch all categories editor picks
        fetchPresets()
      }
    }
    // }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.activePresetName !== prevProps.activePresetName) {
      const { activeCategory, activePresetName, fetchPresets } = this.props
      fetchPresets(activeCategory, { subcat: activePresetName })
    }
  }

  // componentWillReceiveProps (nextProps) {
  //   const { activeCategory, activePresetName, fetchPresets } = nextProps
  //   if (activePresetName !== this.props.activePresetName) {
  //     fetchPresets(activeCategory, { subcat: activePresetName })
  //   }
  // }

  get handlePresetClick () {
    const { setFilter, enableInitialFetch, tracker } = this.props
    return (filters, presetName, category) => {
      setFilter(category, filters)
      // make products fetched from beginning
      enableInitialFetch()
      // redirect to preset's products page
      history.push(`/preset-products/${category}/${formatPresetName(presetName)}`)
      // track preset click
      tracker.track('Preset Choose', { name: presetName })
    }
  }

  get togglePresetLike () {
    const { likePreset, unlikePreset, tracker } = this.props
    return (preset, favorite) => {
      if (favorite) {
        likePreset(preset, tracker)
      } else {
        unlikePreset(preset, tracker)
      }
    }
  }

  filterPresetWithCategory = preset => preset.category === this.props.activeCategory

  render () {
    const {
      isPresetsFetched,
      presets,
      presetMatchesCount,
      useMinimalPreset,
      activeCategory,
      style,
      onClickGroupTitle,
      hidePreset,
      titleBellowPreset,
      defaultViewBoxSvg
    } = this.props

    return (
      <div className='AdvancedPresetList' style={style}>
        {!isPresetsFetched && <DotLoader visible style={styles.loader} />}
        <Transition show={isPresetsFetched} transition='fadeInUp'>
          {
            presets.map((preset, index) => (
              <AdvancedPreset
                key={index}
                id={`${camelCase(preset.name)}${index}`}
                preset={preset}
                onClick={this.handlePresetClick}
                onClickGroupTitle={onClickGroupTitle(preset)}
                onToggleLike={this.togglePresetLike}
                presetMatchesCount={presetMatchesCount}
                useMinimalPreset={useMinimalPreset}
                activeCategory={preset.category || activeCategory}
                hidePreset={hidePreset}
                titleBellowPreset={titleBellowPreset}
                defaultViewBoxSvg={defaultViewBoxSvg}
              />
            ))
          }
        </Transition>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  presets: props.presets || state.filters.presets,
  isPresetsFetched: props.show || state.filters.presetsFetched
})

export default compose(
  connect(
    mapStateToProps,
    {
      fetchPresets,
      setFilter,
      likePreset,
      unlikePreset,
      enableInitialFetch
    }
  ),
  withTrackingConsumer()
)(AdvancedPresetList)

const styles = {
  loader: {
    position: 'absolute',
    margin: 'auto',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 100,
    height: 30
  }
}
