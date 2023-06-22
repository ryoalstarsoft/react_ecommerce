import React, { Component } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import camelCase from 'lodash/camelCase'
import history from '@yesplz/core-web/config/history'
import { enableInitialFetch } from '@yesplz/core-redux/ducks/products'
import { fetchPresets, setFilter, likePreset, unlikePreset } from '@yesplz/core-redux/ducks/filters'
import { withTrackingConsumer } from '../../hoc'
import Transition from '@yesplz/core-web/ui-kits/transitions/Transition'
import { DotLoader } from '@yesplz/core-web/ui-kits/loaders'
import Preset from './Preset'
import './presets.css'

export class Presets extends Component {
  static propTypes = {
    presets: PropTypes.array,
    isPresetsFetched: PropTypes.bool,
    fetchPresets: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    likePreset: PropTypes.func.isRequired,
    unlikePreset: PropTypes.func.isRequired,
    enableInitialFetch: PropTypes.func.isRequired,
    extraItem: PropTypes.element,
    tracker: PropTypes.object,
    style: PropTypes.object
  }

  static defaultProps = {
    presets: [],
    isPresetsFetched: false
  }

  componentDidMount () {
    const { fetchPresets, isPresetsFetched } = this.props
    // don't need to do initial fetch if presets is fetched already
    if (!isPresetsFetched) {
      fetchPresets()
    }
  }

  get handlePresetClick () {
    const { tracker, setFilter, enableInitialFetch } = this.props
    return (filters, name, category, presetKey) => {
      setFilter(category, filters)
      // make products fetched from beginning
      enableInitialFetch()
      // redirect to Tops page
      // history.push(`/preset-products/${name}`)
      history.push(`/favorites/styles/${category}/${presetKey}?listingView=double`)

      tracker.track('Preset Choose', { name })
    }
  }

  get togglePresetLike () {
    const { likePreset, unlikePreset } = this.props
    return (preset, favorite) => {
      if (favorite) {
        likePreset(preset)
      } else {
        unlikePreset(preset)
      }
    }
  }

  render () {
    const { isPresetsFetched, presets, extraItem, style } = this.props
    return (
      <div id='MainScroll' className='Presets' style={style}>
        {extraItem}
        {!isPresetsFetched && <DotLoader visible style={styles.loader} />}
        <div className='container'>
          <Transition show={isPresetsFetched} transition='fadeInUp'>
            {
              presets.map((preset, index) => {
                if (preset.category) {
                  return (
                    <Preset
                      key={preset.key || `${preset.name} ${index}`}
                      id={`${camelCase(preset.name)}${index}`}
                      category={preset.category}
                      ankle={preset.ankle}
                      knee={preset.knee}
                      rise={preset.rise}
                      thigh={preset.thigh}
                      bottoms={preset.bottoms}
                      counters={preset.counters}
                      covers={preset.covers}
                      shafts={preset.shafts}
                      toes={preset.toes}
                      presetKey={preset.key}
                      name={preset.name}
                      coretype={preset.coretype}
                      neckline={preset.neckline}
                      shoulder={preset.shoulder}
                      sleeveLength={preset.sleeve_length}
                      topLength={preset.top_length}
                      pattern={preset.pattern}
                      solid={preset.solid}
                      details={preset.details}
                      color={preset.color}
                      favorite={preset.favorite}
                      onClick={this.handlePresetClick}
                      onToggleLike={this.togglePresetLike}
                      style={{ animationDelay: `${50 * index}ms` }}
                    />
                  )
                }
                return null
              })
            }
          </Transition>
        </div>
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
)(Presets)

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
