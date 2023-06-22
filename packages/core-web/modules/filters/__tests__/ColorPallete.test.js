import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import without from 'lodash/without'
import { ColorPallete } from '../ColorPallete'

describe('<ColorPallete />', () => {
  let wrapper
  let props = {
    values: ['purple', 'blue'],
    onColorClick: sinon.spy()
  }

  beforeEach(() => {
    wrapper = shallow(<ColorPallete {...props} />)
  })

  describe('on initial render', () => {
    it('should show color buttons', () => {
      let expectedColors = [ '#E03E3E', '#ECD5C0', '#7F3EE0', '#3E60E0', '#3EE059', '#E0D03E', '#000000', '#663300',
        '#F0A4BD', 'linear-gradient(-145deg, #FEF7A3 4%, #E8F7AC 21%, #83F5D7 52%, #F19EC2 98%, #C683F2 98%)', '#E08F3E',
        '#999999', '#FFFFFF' ]
      expect(
        wrapper.find('ColorButton').map(node => node.props().color)
      ).to.deep.equal(expectedColors)
    })

    it('should show clear button', () => {
      expect(wrapper.find('Button')).to.exist
      expect(wrapper.find('Button').shallow().text()).to.equal('Clear')
    })

    it('should select the defined color values from props', () => {
      // check for defined values from state
      expect(wrapper.state('values')).to.deep.equal(props.values)
      // check for rendered `ColorButton`
      expect(
        wrapper.find('ColorButton')
          .filterWhere(node => node.props().active)
          .map(node => node.props().name)
      ).to.deep.equal(props.values)
    })
  })

  describe('clicking on the color button', () => {
    let button
    it('should activate the color button', () => {
      button = wrapper.find('ColorButton').at(0) // red
      // check for color button active props, should be inactive / unselected
      expect(button.props().active).to.be.false
      // clicking the color button
      button.shallow().find('button').simulate('click')
      wrapper.update()
      // the button should now be active
      expect(wrapper.find('ColorButton').at(0).props().active).to.be.true
    })

    it('should call the `onColorClick` prop with new color values', () => {
      expect(props.onColorClick.calledWith([
        ...props.values, button.props().name // previous values and new clicked name
      ])).to.be.true
    })
  })

  describe('clicking on the active color button', () => {
    let button
    it('should deactivate the color button', () => {
      button = wrapper.find('ColorButton').at(2) // purple
      // check for color button active props, should be an active button
      expect(button.props().active).to.be.true
      // clicking the color button
      button.shallow().find('button').simulate('click')
      wrapper.update()
      // the button should now be inactive
      expect(wrapper.find('ColorButton').at(0).props().active).to.be.false
    })

    it('should call the `onColorClick` prop with new color values', () => {
      // should be called without the button name
      expect(props.onColorClick.calledWith(without(props.values, 'purple'))).to.be.true
    })
  })

  describe('clicking on the clear button', () => {
    it('should remove all the color selections', () => {
      // clicking the clear button
      wrapper.find('Button').simulate('click')

      // the values should now contain empty array
      expect(wrapper.state('values')).to.deep.equal([])
    })

    it('should call the `onColorClick` prop with color values', () => {
      expect(props.onColorClick.calledWith([]))
    })
  })
})
