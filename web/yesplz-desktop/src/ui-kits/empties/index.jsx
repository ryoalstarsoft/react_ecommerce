import React from 'react'
import PropTypes from 'prop-types'
import EmptyFavoriteItemsSvg from './empty-photos/item-empty.svg'
import EmptyFavoriteStylesSvg from './empty-photos/style-empty.svg'
import './index.scss'

const Empty = ({ page }) => {
  let images = {
    'favorite-items': {
      imageUrl: EmptyFavoriteItemsSvg,
      title: 'THERE ARE NO SAVED ITEMS.'
    },
    'favorite-styles': {
      imageUrl: EmptyFavoriteStylesSvg,
      title: 'THERE ARE NO SAVED STYLES YET'
    }
  }

  const { imageUrl, title } = images[page]
  return (
    <div className='Empty'>
      <img src={imageUrl} alt={title} />
      <p>{title}</p>
    </div>
  )
}

Empty.propTypes = {
  page: PropTypes.string
}

Empty.defaultProps = {
  page: ''
}

export default Empty
