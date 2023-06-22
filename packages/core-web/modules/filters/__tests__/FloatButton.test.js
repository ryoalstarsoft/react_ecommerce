import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import FloatButton from '../FloatButton'

describe('<FloatButton />', () => {
  let wrapper
  let props = {
    id: 'FloatButton',
    filters: {},
    onClick: sinon.spy()
  }

  beforeEach(() => {
    wrapper = mount(<FloatButton {...props} />)
  })

  describe('on initial render', () => {
    it('should renders svg', () => {
      expect(wrapper.find('svg')).to.be.exist
      expect(wrapper.find('svg').props().id).to.equal(props.id)
    })
    it('should show svg shadow', () => {
      expect(wrapper.find('.FloatButton').props().className).to.include('withShadow')
    })
  })

  describe('when `noShadow` is activated', () => {
    beforeAll(() => {
      props.noShadow = true
    })

    it('should show svg without shadow', () => {
      expect(wrapper.find('.FloatButton').props().className).to.not.include('withShadow')
    })
  })

  describe('when clicking on the button', () => {
    it('should call the `onClick` prop', () => {
      wrapper.find('.FloatButton').simulate('click')
      expect(props.onClick.calledOnce).to.be.true
    })
  })
})
