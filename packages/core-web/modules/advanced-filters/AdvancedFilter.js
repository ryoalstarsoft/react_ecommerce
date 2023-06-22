import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import AdvancedFilterTabs, { TabItem } from './AdvancedFilterTabs'
import ColorPallete from '../filters/ColorPallete'
import StylesSelect from './StylesSelect'
import DesignSelect from './DesignSelect'
import MaterialSelect from './MaterialSelect'
import FavoritesSelect from './FavoritesSelect'

const designFilterKeys = ['solid', 'pattern', 'details', 'lace-up', 'ripped-off']
const nonVisualFilterKeys = [...designFilterKeys, 'color', 'material']

const AdvancedFilter = ({ category, lastBodyPart, config, filters, style, onChange, onBodyPartChange }) => {
  // split filters based on its type
  const styleFilter = omit(filters, nonVisualFilterKeys)
  const designFilter = pick(filters, designFilterKeys)
  const colorFilter = (filters.color || '').split(',')
  const materialFilter = (filters.material || '').split(',')

  const handleFilterChange = (name, value) => {
    let updatedFilters = {
      ...filters
    }

    switch (name) {
      case 'material':
      case 'color':
        const valueJoin = value.join(',')
        updatedFilters = {
          ...updatedFilters,
          [name]: valueJoin.slice(0, 1) === ',' ? valueJoin.slice(1) : valueJoin
        }
        break
      case 'favorite':
        updatedFilters = value
        break
      default:
        updatedFilters = {
          ...updatedFilters,
          ...value
        }
    }

    onChange(updatedFilters)
  }

  return (
    <AdvancedFilterTabs tabs={tabs} style={style}>
      <TabItem tabKey='styles' style={{ padding: 0 }}>
        <StylesSelect
          name='style'
          value={styleFilter}
          category={category}
          lastBodyPart={lastBodyPart}
          config={config}
          onChange={handleFilterChange}
          onBodyPartChange={onBodyPartChange}
        />
      </TabItem>

      <TabItem tabKey='design'>
        <DesignSelect name='design' category={category} value={designFilter} onChange={handleFilterChange} />
      </TabItem>

      <TabItem tabKey='colors'>
        <ColorPallete values={colorFilter} onColorClick={(values) => handleFilterChange('color', values)} />
      </TabItem>

      <TabItem tabKey='materials'>
        <MaterialSelect name='material' category={category} values={materialFilter} onChange={handleFilterChange} />
      </TabItem>

      <TabItem tabKey='favorite'>
        <FavoritesSelect name='favorite' category={category} value={filters} onChange={handleFilterChange} />
      </TabItem>
    </AdvancedFilterTabs>
  )
}

const tabs = [
  { label: 'Styles', key: 'styles' },
  { label: 'Design', key: 'design' },
  { label: 'Colors', key: 'colors' },
  { label: 'Materials', key: 'materials' },
  { label: 'My Tops', key: 'favorite' }
]

AdvancedFilter.propTypes = {
  category: PropTypes.string.isRequired,
  lastBodyPart: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  filters: PropTypes.object,
  style: PropTypes.object,
  onChange: PropTypes.func,
  onBodyPartChange: PropTypes.func.isRequired
}

AdvancedFilter.defaultProps = {
  config: {},
  filters: {},
  onChange: (filters) => {}
}

export default AdvancedFilter
