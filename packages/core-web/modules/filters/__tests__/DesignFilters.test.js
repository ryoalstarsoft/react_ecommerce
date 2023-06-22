import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import { DesignFilters, __Rewire__ as designFiltersRewire } from '../DesignFilters'
import { Switch } from '@yesplz/core-web/ui-kits/forms/Switch'

describe('<DesignFilters />', () => {
  let wrapper
  let props = {
    solid: false,
    pattern: false,
    details: false,
    onChange: sinon.spy()
  }

  beforeAll(() => {
    // mock control label
    const FormControlLabel = ({ control }) => (
      <div className='SwitchWrapper'>
        {control}
      </div>
    )
    designFiltersRewire('Switch', Switch)
    designFiltersRewire('FormControlLabel', FormControlLabel)
  })

  beforeEach(() => {
    wrapper = shallow(<DesignFilters {...props} />)
  })

  describe('on initial render', () => {
    it('should contains Solid switch', () => {
      const controlLabel = wrapper.find('FormControlLabel').at(0)
      const switchField = controlLabel.props().control

      // use 'Solid' label
      expect(controlLabel.props().label).to.equal('Solid')
      // make sure it's using Switch
      expect(switchField.type).to.equal(Switch)
      // should contain 'solid' value
      expect(switchField.props.value).to.equal('solid')
      // initial checked value as defined in props
      expect(switchField.props.checked).to.be.false
    })

    it('should contains Pattern switch', () => {
      const controlLabel = wrapper.find('FormControlLabel').at(1)
      const switchField = controlLabel.props().control

      // use 'Pattern' label
      expect(controlLabel.props().label).to.equal('Pattern')
      // make sure it's using Switch
      expect(switchField.type).to.equal(Switch)
      // should contain 'pattern' value
      expect(switchField.props.value).to.equal('pattern')
      // initial checked value as defined in props
      expect(switchField.props.checked).to.be.false
    })

    it('should contains Detail switch', () => {
      const controlLabel = wrapper.find('FormControlLabel').at(2)
      const switchField = controlLabel.props().control

      // use 'Detail' label
      expect(controlLabel.props().label).to.equal('Detail')
      // make sure it's using Switch
      expect(switchField.type).to.equal(Switch)
      // should contain 'details' value
      expect(switchField.props.value).to.equal('details')
      // initial checked value as defined in props
      expect(switchField.props.checked).to.be.false
    })
  })

  describe('when clicking on Solid switch', () => {
    let controlLabelWrapper
    it('should set it to active', () => {
      controlLabelWrapper = wrapper.find('FormControlLabel').at(0).shallow()

      controlLabelWrapper.find(Switch).simulate('change', {
        target: {
          checked: !controlLabelWrapper.find(Switch).props().checked,
          value: controlLabelWrapper.find(Switch).props().value
        }
      })

      expect(props.onChange.calledWith(true, 'solid')).to.be.true
    })

    it('should set pattern to false', () => {
      setTimeout(() => {
        expect(props.onChange.calledWith(false, 'pattern')).to.be.true
      }, 100)
    })
  })

  describe('when clicking on Pattern switch', () => {
    let controlLabelWrapper
    it('should set it to active', () => {
      controlLabelWrapper = wrapper.find('FormControlLabel').at(1).shallow()

      controlLabelWrapper.find(Switch).simulate('change', {
        target: {
          checked: !controlLabelWrapper.find(Switch).props().checked,
          value: controlLabelWrapper.find(Switch).props().value
        }
      })

      expect(props.onChange.calledWith(true, 'pattern')).to.be.true
    })

    it('should set solid to false', () => {
      setTimeout(() => {
        expect(props.onChange.calledWith(false, 'solid')).to.be.true
      }, 100)
    })
  })

  describe('when clicking on Detail switch', () => {
    let controlLabelWrapper
    it('should set it to active', () => {
      controlLabelWrapper = wrapper.find('FormControlLabel').at(2).shallow()

      controlLabelWrapper.find(Switch).simulate('change', {
        target: {
          checked: !controlLabelWrapper.find(Switch).props().checked,
          value: controlLabelWrapper.find(Switch).props().value
        }
      })

      expect(props.onChange.calledWith(true, 'pattern')).to.be.true
    })
  })
})
