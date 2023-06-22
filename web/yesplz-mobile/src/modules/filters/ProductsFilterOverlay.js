import React from 'react'
import PropTypes from 'prop-types'

import Overlay from '@yesplz/core-web/ui-kits/overlays/Overlay'
import Button from '@yesplz/core-web/ui-kits/buttons/Button'
import FilterGroup from './FilterGroup'
import ListView from './ListView'

import './ProductsFilterOverlay.scss'

const ProductsFilterOverlay = ({
  children,
  colType,
  isVisible,
  onColTypeChange,
  onClearFilter,
  onSubmit,
  onClose
}) => {
  return (
    <Overlay title='Filters' className='ProductsFilterOverlay' isVisible={isVisible} onClose={onClose}>
      <h4 className='ProductsFilterOverlay-sectionTitle'>Listing View options</h4>
      <ListView colType={colType} onChange={onColTypeChange} />
      {/* filters group */}
      {children}
      {/* end of filters group */}
      <button className='ProductsFilterOverlay-clearButton' onClick={onClearFilter}>Clear all</button>
      <div className='ProductsFilterOverlay-submitButtonWrapper'>
        <Button
          className='ProductsFilterOverlay-submitButton'
          kind='secondary'
          onClick={onSubmit}>
          Done
        </Button>
      </div>
    </Overlay>
  )
}

ProductsFilterOverlay.propTypes = {
  children: PropTypes.any.isRequired,
  colType: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onColTypeChange: PropTypes.func.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

ProductsFilterOverlay.defaultProps = {
  onColTypeChange: (colType) => { console.debug('Unhandled `onColTypeChange` prop in `ProductsFilter`', colType) },
  onClearFilter: () => {},
  onSubmit: (productListConfig) => { console.debug('Unhandled `onSubmit` prop in `ProductsFilter`', productListConfig) },
  onClose: () => { console.debug('Unhandled `onClose` prop in `ProductsFilter`') }
}

export default ProductsFilterOverlay

export const FilterLabel = ({ label, children }) => (
  <React.Fragment>
    <h4 className='ProductsFilterOverlay-sectionTitle' style={styles.filterSubtitle}>{label}</h4>
    {children}
  </React.Fragment>
)

FilterLabel.propTypes = {
  label: PropTypes.string,
  children: (propValue, key, componentName, location, propFullName) => {
    if (propValue[key].type !== FilterGroup) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      )
    }
  }
}

const styles = {
  filterSubtitle: { marginBottom: 13 }
}
