// Actions
const SET_STEP = 'tutorial_onboarding/SET_STEP_TUTORIAL_ONBOARDING'

const defaultState = {
  step: 1
}

// Reducer
export default function reducer (state = defaultState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case SET_STEP:
      return {step: payload}
    default: return state
  }
}

// Actions creator
export function setStep (step = 1) {
  return { type: SET_STEP, payload: step }
}
