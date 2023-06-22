import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'

import FilterPanel from '../FilterPanel'

const wtopDefaultFilters = {
  coretype: 0,
  details: 0,
  neckline: 1,
  pattern: 0,
  shoulder: 0,
  sleeve_length: 2,
  solid: 0,
  top_length: 0,
  favorite: true
}

const wshoesDefaultFilters = {
  toes: 0,
  covers: 0,
  counters: 0,
  bottoms: 0,
  shafts: 0
}

const wpantsDefaultFilters = {
  thigh: 0,
  knee: 0,
  ankle: 0
}

storiesOf('filters/FilterPanel', module)
/*  .add(
    'mobile default',
    withInfo(`
      mobile visual filter panel
    `)(() => (
      <FilterPanel
        category='wtop'
        filters={wtopDefaultFilters}
        lastBodyPart='coretype'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
      />))
  )
  .add(
    'mobile touch debug',
    withInfo(`
    mobile touch debug
    `)(() => (
      <FilterPanel
        category='wtop'
        filters={wtopDefaultFilters}
        lastBodyPart='coretype'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
        debugTouchArea
      />))
  )
*/
  .add(
    'desktop wtop default',
    withInfo(`
      desktop visual filter panel
    `)(() => (
      <FilterPanel
        category='wtop'
        filters={wtopDefaultFilters}
        lastBodyPart='coretype'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
      />))
  )
  .add(
    'desktop wtop touch',
    withInfo(`
      desktop visual filter panel
    `)(() => (
      <FilterPanel
        category='wtop'
        filters={wtopDefaultFilters}
        lastBodyPart='coretype'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
        debugTouchArea
      />))
  )
  .add(
    'desktop wshoes default',
    withInfo(`
      mobile visual filter panel
    `)(() => (
      <FilterPanel
        category='wshoes'
        filters={wshoesDefaultFilters}
        lastBodyPart='bottoms'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
      />))
  )
  .add(
    'desktop wshoes touch',
    withInfo(`
      mobile visual filter panel
    `)(() => (
      <FilterPanel
        category='wshoes'
        filters={wshoesDefaultFilters}
        lastBodyPart='bottoms'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
        debugTouchArea
      />))
  )
  .add(
    'desktop wpants',
    withInfo(`
      desktop wpants visual filter panel
    `)(() => (
      <FilterPanel
        category='wpants'
        filters={wpantsDefaultFilters}
        lastBodyPart='length'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
      />))
  )
  .add(
    'desktop wpants touch',
    withInfo(`
      desktop wpants visual filter panel
    `)(() => (
      <FilterPanel
        category='wpants'
        filters={wpantsDefaultFilters}
        lastBodyPart='length'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
        debugTouchArea
      />))
  )
