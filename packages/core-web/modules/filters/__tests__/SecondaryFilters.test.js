import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import SecondaryFilters from '../SecondaryFilters'
import { DesignFilters } from '../DesignFilters'
import { ColorPallete } from '../ColorPallete'

describe('<SecondaryFilters />', () => {
  let wrapper
  let props = {
    sale: 0,
    fabricFilters: {
      color: null,
      details: 0,
      pattern: 0,
      solid: 0
    },
    onChange: sinon.spy()
  }

  beforeEach(() => {
    wrapper = shallow(<SecondaryFilters {...props} />)
  })

  describe('on initial render', () => {
    it('should show Sale button', () => {
      // first button is Sale
      expect(wrapper.find('Button').at(0).shallow().text()).to.equal('Sale')
    })
    it('should show Design button', () => {
      // second button is Design
      expect(wrapper.find('Button').at(1).shallow().text()).to.equal('Design')
    })
    it('should show Color button', () => {
      // third button is Color
      expect(wrapper.find('Button').at(2).shallow().text()).to.equal('Color')
    })
  })

  describe('clicking on the Sale button', () => {
    it('should call `onChange` prop with updated `sale` filter', () => {
      // simulate click Sale button
      wrapper.find('Button').at(0).simulate('click')

      // previous sale is 0, changed to 1 after click event
      const expectedFilters = { sale: 1, ...props.fabricFilters }

      expect(props.onChange.calledWith(expectedFilters)).to.be.true
    })
  })

  beforeAll(() => {
    // change `DesignFilters` and `ColorPallete` with original element without hoc
    // design filters
    SecondaryFilters.__Rewire__('DesignFilters', DesignFilters)
    // color pallete
    SecondaryFilters.__Rewire__('ColorPallete', ColorPallete)
  })

  describe('clicking on the Design button', () => {
    it('should show fabric filters panel', () => {
      // check previous condition before click
      expect(wrapper.state('designFiltersVisible')).to.be.false

      // simulate click Design button
      wrapper.find('Button').at(1).simulate('click')

      // panel must be shown after clicking on the button
      expect(wrapper.state('designFiltersVisible')).to.be.true
      expect(wrapper.find('Transition').at(0).props().show).to.be.true
      expect(wrapper.find('DesignFilters')).to.be.exist
    })
  })

  describe('clicking on the Color button', () => {
    it('should show color pallete', () => {
      // check previous condition before click
      expect(wrapper.state('collorPalleteVisible')).to.be.false

      // simulate click Design button
      wrapper.find('Button').at(2).simulate('click')

      // color pallete must be shown after clicking on the button
      expect(wrapper.state('collorPalleteVisible')).to.be.true
      expect(wrapper.find('Transition').at(1).props().show).to.be.true
      expect(wrapper.find('ColorPallete')).to.be.exist
    })
  })
})
