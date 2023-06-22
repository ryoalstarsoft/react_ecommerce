import { expect } from 'chai'
import sinon from 'sinon'
import each from 'lodash/each'
import VisualFilter from '../VisualFilter'

describe('VisualFilter Onboarding', () => {
  let vf = null
  let contructorStub
  let fakeFn = {
    showGroup: sinon.spy(),
    hideGroup: sinon.spy(),
    changePropSelection: sinon.spy(),
    updateThumbnailSelectionBox: sinon.spy(),
    handleBodyPartClick: sinon.spy(),
    initializeClickHitMap: sinon.spy()
  }
  let fakeSaveConfig = sinon.spy()

  beforeAll(() => {
    VisualFilter.__Rewire__('setTimeout', () => {}) // don't run set delayed func
    contructorStub = sinon.stub(VisualFilter, 'constructor').callsFake(() => {})
    stubFakeFunctions(VisualFilter, fakeFn)
    // spy saveConfig
    sinon.stub(VisualFilter, 'saveConfig').callsFake(fakeSaveConfig)

    vf = new VisualFilter()
  })

  describe('on initialization', () => {
    it('should start from the beginning', () => {
      expect(vf.onboardingStage).to.equal(0)
    })
  })

  describe('on stage 1', () => {
    it('should show onboarding touch point', () => {
      vf.handleOnBoardingClick()
      expect(fakeFn.showGroup.calledWith('mini_onboarding_touch')).to.be.true
    })

    it('should show onboarding group 1', () => {
      expect(fakeFn.showGroup.calledWith('mini_onboarding_1')).to.be.true
    })

    it('should change selection to shoulder 3', () => {
      expect(fakeFn.changePropSelection.calledWith('shoulder', 3)).to.be.true
    })

    it('should show shoulder thumbnails', () => {
      expect(fakeFn.updateThumbnailSelectionBox.calledWith('shoulder')).to.be.true
    })

    it('should be able to move to next stage', () => {
      expect(vf.onboardingStage).to.equal(1)
    })
  })

  describe('on stage 2', () => {
    it('should hide onboarding group 1', () => {
      vf.handleOnBoardingClick()
      expect(fakeFn.hideGroup.calledWith('mini_onboarding_1')).to.be.true
    })

    it('should show onboarding group 2', () => {
      expect(fakeFn.showGroup.calledWith('mini_onboarding_2')).to.be.true
    })

    it('should click on the shoulder part', () => {
      expect(fakeFn.handleBodyPartClick.calledWith('shoulder')).to.be.true
    })
  })

  describe('on stage 3', () => {
    it('should hide onboarding group 2', () => {
      vf.handleOnBoardingClick()
      expect(fakeFn.hideGroup.calledWith('mini_onboarding_2')).to.be.true
    })

    it('should show onboarding group 3', () => {
      expect(fakeFn.showGroup.calledWith('mini_onboarding_3')).to.be.true
    })

    it('should click on the shoulder part', () => {
      expect(fakeFn.handleBodyPartClick.calledWith('shoulder')).to.be.true
    })

    describe('on stage 4', () => {
      it('should hide touch point', () => {
        vf.handleOnBoardingClick()
        expect(fakeFn.hideGroup.calledWith('mini_onboarding_touch')).to.be.true
      })

      it('should hide onboarding group 3', () => {
        expect(fakeFn.hideGroup.calledWith('mini_onboarding_3')).to.be.true
      })

      it('should initialize visual filter event', () => {
        expect(fakeFn.initializeClickHitMap.calledOnce).to.be.true
      })

      it('should set onboarding_completed flag to 1', () => {
        expect(fakeSaveConfig.calledWith('onboarding_completed', 1)).to.be.true
      })
    })
  })

  afterAll(() => {
    contructorStub.restore()
    restoreFakeStubs()
    VisualFilter.__ResetDependency__('setTimeout')
  })
})

describe('Visual Filter', () => {
  let vf = null
  let contructorStub
  let fakeFn = {
    showGroup: sinon.spy(),
    hideGroup: sinon.spy()
  }

  beforeAll(() => {
    contructorStub = sinon.stub(VisualFilter, 'constructor').callsFake(() => {})
    stubFakeFunctions(VisualFilter, fakeFn)
    vf = new VisualFilter()
    vf.currentPropState = {
      coretype: 2,
      neckline: 0,
      shoulder: 0,
      sleeve_length: 5,
      top_length: 1
    }
  })

  /**
     * Special handling for tank top
     * ---
     * When coretype is moving to 0, change top_length to 0 (save current top_length value)
     * When coretype is moving to 1 / 2 / 3 / all, restore saved top_length value
     * When top_length is moving to 1 / 2 / 3 / all and core type is is 0, change coretype to 1
     */
  describe('When coretype is moving to 0', () => {
    it('show top_length 0', () => {
      vf.changePropSelection('coretype', '0', false)
      expect(vf.currentPropState.top_length.toString()).to.equal('0')
      expect(vf.showGroup.calledWith('length_0')).to.be.true
    })
    it('hide previous top_length selection group', () => {
      expect(fakeFn.hideGroup.calledWith('length_1')).to.be.true
    })
    it('save previous top_length value', () => {
      expect(vf.savedTopLength.toString()).to.equal('1')
    })
  })

  describe('When coretype is moving away from 0 to 1 / 2 / 3 / all', () => {
    it('restore previous saved top_length value', () => {
      vf.changePropSelection('coretype', '1', false)
      expect(vf.currentPropState.top_length.toString()).to.equal('1')
      expect(fakeFn.showGroup.calledWith('length_1')).to.be.true
    })
  })

  describe('When top_length is moving to 1 / 2 / 3 / all and core type is is 0', () => {
    it('show coretype 1', () => {
      vf.currentPropState.coretype = 0
      vf.currentPropState.top_length = 0

      vf.changePropSelection('top_length', '1', false)
      expect(fakeFn.showGroup.calledWith('top_core_1')).to.be.true
    })
    it('should hide previous coretype group', () => {
      expect(fakeFn.hideGroup.calledWith('top_core_0')).to.be.true
    })
  })

  afterAll(() => {
    contructorStub.restore()
    restoreFakeStubs()
  })
})

let fakeFnStub = {}

/**
 * stub VisualFilter with all function from fakeFn
 * @param {Object} target
 * @param {Object} fakeFn
 */
const stubFakeFunctions = (target, fakeFn) => (
  each(fakeFn, (spy, name) => {
    fakeFnStub[name] = sinon.stub(target.prototype, name).callsFake(spy)
  })
)

/**
 * stub VisualFilter with all function from fakeFn
 * @param {Object} fakeFn
 */
const restoreFakeStubs = (fakeFn) => (
  each(fakeFnStub, (stub) => {
    stub.restore()
  })
)
