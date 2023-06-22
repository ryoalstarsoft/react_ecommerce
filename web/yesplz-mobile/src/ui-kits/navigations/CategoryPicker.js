import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import findKey from 'lodash/findKey'
import MobilePicker from '@yesplz/core-web/ui-kits/selects/MobilePicker'
import { CATEGORY_TOPS, CATEGORIES_LABELS } from '@yesplz/core-web/config/constants'
import history from '@yesplz/core-web/config/history'

const CategoryPicker = ({ isVisible, hideBackdrop, category, onClose, setCategory }) => {
  const [ valueGroups, changeValueGroups ] = useState({ category: CATEGORIES_LABELS[category] })

  useEffect(() => {
    if (valueGroups.category !== CATEGORIES_LABELS[category]) {
      changeValueGroups({ valueGroups: { category: CATEGORIES_LABELS[category] } })
    }
  }, [category])

  const handleCategoryChange = (name, value) => {
    changeValueGroups({
      ...valueGroups,
      [name]: value
    })
  }

  const handleCategoryPick = () => {
    const categoryKey = findKey(CATEGORIES_LABELS, label => label === valueGroups.category)
    setCategory(categoryKey)
    history.push(`/products/${categoryKey}/list?listingView=double`)
    onClose()
  }

  return (
    <MobilePicker
      isVisible={isVisible}
      hideBackdrop={hideBackdrop}
      optionGroups={optionGroups}
      valueGroups={valueGroups}
      onChange={handleCategoryChange}
      onPick={handleCategoryPick}
      onClose={onClose}
    />
  )
}

const optionGroups = {
  category: [
    'Tops',
    'Pants',
    'Shoes'
  ]
}

CategoryPicker.propTypes = {
  isVisible: PropTypes.bool,
  hideBackdrop: PropTypes.bool,
  category: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  setCategory: PropTypes.func.isRequired
}

CategoryPicker.defaultProps = {
  isVisible: false,
  hideBackdrop: false,
  category: CATEGORY_TOPS,
  onClose: () => {},
  setCategory: () => {}
}

export default CategoryPicker
