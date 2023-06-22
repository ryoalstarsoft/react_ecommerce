import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import FilterPanel from '../FilterPanel'

describe('<FilterPanel />', () => {
  let wrapper
  let props = {
    filters: {
      color: 'blue,green',
      coretype: 3,
      details: 1,
      neckline: 2,
      pattern: 0,
      sale: 1,
      shoulder: 3,
      sleeve_length: 1,
      solid: 1,
      top_length: 0
    },
    favorite: false,
    className: '',
    closable: true,
    onFilterChange: sinon.spy(),
    onFilterLike: sinon.spy(),
    onClose: sinon.spy()
  }

  beforeEach(() => {
    wrapper = shallow(<FilterPanel {...props} />)
  })

  describe('on initial render', () => {
    it('should show VisualFilter svg', () => {
      expect(wrapper.find('svg#VisualFilter')).to.be.exist
    })

    it('should show secondary filters (Sale, Design, Color)', () => {
      expect(wrapper.find('SecondaryFilters')).to.be.exist
    })

    it('should show favorite button', () => {
      expect(wrapper.find('LikeButton')).to.be.exist
    })

    it('should close button', () => {
      expect(wrapper.find('.FilterPanel-close')).to.be.exist
      expect(wrapper.find('CloseButton')).to.be.exist
    })
  })

  describe('While clicking on favorite button', () => {
    it('should toggle the favorite by calling `onFilterLike` prop', () => {
      // simulate favorite click
      wrapper.find('LikeButton').simulate('click', { preventDefault: sinon.fake(), stopPropagation: sinon.fake() })
      // `onFilterLike` should be called with current filters value and next favorite state
      expect(props.onFilterLike.calledWith(props.filters, !props.favorite)).to.be.true
    })
  })

  describe('While clicking on close button', () => {
    it('should close the panel by calling `onClose` prop', () => {
      // simulate close click
      wrapper.find('.FilterPanel-close').simulate('click')
      // `onClose` should be called once
      expect(props.onClose.calledOnce).to.be.true
    })
  })
})
