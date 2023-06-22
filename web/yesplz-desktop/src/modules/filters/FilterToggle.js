import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter, matchPath } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { toggleVisualFilter } from '@yesplz/core-redux/ducks/filters'
import history from '@yesplz/core-web/config/history'
import FloatButton from '@yesplz/core-web/modules/filters/FloatButton'
import './filter-toggle.css'

class FilterToggle extends Component {
  static propTypes = {
    filters: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    activeCategory: PropTypes.string.isRequired,
    scrollBellowTheFold: PropTypes.bool,
    onboarding: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      show: true
    }
  }

  componentDidMount () {
    this.setState({
      show: !this.isOnProductsPage
    })
  }

  componentDidUpdate (prevProps) {
    const { router } = this.props
    // if pathname changed
    if (prevProps.router.location.pathname !== router.location.pathname) {
      this.setState({
        show: !this.isOnProductsPage
      })
    }
  }

  get isOnProductsPage () {
    const { router } = this.props
    return router.location.pathname === '/products'
  }

  get isProductDetailPage () {
    const { router } = this.props
    return /^\/products/.test(router.location.pathname)
  }

  get handleFilterToggle () {
    return () => {
      // will move to products page when clicking on the visual filter button
      if (!this.isOnProductsPage) {
        history.push('/products')
      }
    }
  }

  render () {
    const { activeCategory, filters, scrollBellowTheFold, onboarding } = this.props
    const { show } = this.state

    return (
      <div className={classNames('FilterToggle', {
        allowHide: this.isProductDetailPage,
        pullDown: !scrollBellowTheFold || !show,
        onboarding,
        animated: !onboarding
      })}>
        <FloatButton category={activeCategory} filters={filters} onClick={this.handleFilterToggle} className='animated' />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const match = matchPath(props.location.pathname, { path: '/products/:category' })
  const activeCategory = (match && match.params.category) || state.products.activeCategory

  return {
    filters: state.filters[activeCategory].data,
    router: state.router,
    scrollBellowTheFold: state.product.scrollBellowTheFold,
    onboarding: state.filters.onboarding,
    activeCategory
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, { toggleVisualFilter })
)(FilterToggle)
