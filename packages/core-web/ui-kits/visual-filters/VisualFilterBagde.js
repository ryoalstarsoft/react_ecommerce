import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { VisualFilter } from '@yesplz/core-models'
import './VisualFilterBagde.scss'

const VisualFilterBagde = ({ id, category, filter, defaultBodyPart, viewBox, style }) => {
  useEffect(() => {
    // initialize visual filter
    (() => (
      new VisualFilter(`#${id}`, {
        category: category,
        defaultState: filter,
        customViewBox: viewBox,
        badgeMode: true,
        hideThumbnail: true,
        showHighlightOnBuild: true,
        defaultBodyPart
      })
    ))()
  }, [id])

  return (
    <button className='VisualFilterBagde' style={style}>
      <svg id={id} />
    </button>
  )
}

VisualFilterBagde.propTypes = {
  id: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  defaultBodyPart: PropTypes.string,
  filter: PropTypes.object,
  viewBox: PropTypes.array,
  style: PropTypes.object
}

VisualFilterBagde.defaultProps = {
  filter: {
    coretype: 0,
    neckline: 0,
    shoulder: 0,
    sleeve_length: 0,
    top_length: 0,
    toes: 0,
    covers: 0,
    counters: 0,
    bottoms: 0,
    shafts: 0
  },
  viewBox: [90, 10, 130, 130]
}

export default VisualFilterBagde
