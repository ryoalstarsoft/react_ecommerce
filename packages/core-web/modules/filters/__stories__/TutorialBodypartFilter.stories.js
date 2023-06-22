import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'

import TutorialBodypartFilter from '../TutorialBodypartFilter'

const filters = {
  coretype: 2,
  details: 0,
  neckline: 1,
  pattern: 0,
  shoulder: 1,
  sleeve_length: 0,
  top_length: 2,
  favorite: true
}

storiesOf('filters/TutorialBodypartFilter', module)
  .add(
    'tutorial anim',
    withInfo(`
      animate bodypart selections
    `)(() => (
      <TutorialBodypartFilter
        filters={filters}
        lastBodyPart='coretype'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
      />))
  )

storiesOf('filters/TutorialBodypartFilter', module)
  .add(
    'show touches points',
    withInfo(`
      show thouches points
    `)(() => (
      <TutorialBodypartFilter
        filters={filters}
        lastBodyPart='coretype'
        onFilterChange={action('filter changed')}
        onClose={action('close visual filter')}
        onFilterLike={action('favorite filter')}
        onBodyPartChange={action('body part changed')}
      />))
  )
