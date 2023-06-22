import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import isEqual from 'lodash/isEqual'
import { VisualFilter } from '@yesplz/core-models'

export default class TutorialBodypartFilter extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    filters: PropTypes.object,
    noShadow: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func
  }

  static defaultProps = {
    id: 'TutorialBodypartFilter',
    noShadow: false
  }

  constructor (props) {
    super(props)
    this.state = {
      svgLoaded: false
    }
  }

  componentDidMount () {
    const { id, filters } = this.props
    // initialize visual filter
    this.tutorialBodypartFilter = new VisualFilter(`#${id}`, {
      defaultState: filters,
      badgeMode: true,
      hideThumbnail: true,
      onSVGLoaded: this.handleSVGLoaded,
      onFilterChange: () => {}
    })
  }

  componentDidUpdate (prevProps, prevState) {
    const { filters } = this.props
    const { svgLoaded } = this.state
    if (!isEqual(svgLoaded, prevState.svgLoaded) || !isEqual(filters, prevProps.filters)) {
      this.tutorialBodypartFilter.updateState(filters)
    }
  }

  get handleSVGLoaded () {
    return () => {
      this.setState({
        svgLoaded: true
      })
    }
  }

  render () {
    const { id, onClick, className, style, noShadow } = this.props
    const { svgLoaded } = this.state

    return (
      <div className={classNames('TutorialBodypartFilter', { svgLoaded, [className]: className, withShadow: !noShadow })} style={style} onClick={onClick}>
        <svg id={id} />
      </div>
    )
  }
}
