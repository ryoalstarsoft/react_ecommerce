// import axios from 'axios'
import {
  CATEGORY_TOPS,
  CATEGORY_SHOES,
  CATEGORY_PANTS
  // SIZES
} from '@yesplz/core-web/config/constants'

const UPDATE_SIZES = 'profile/UPDATE_SIZES'

const defaultState = {
  sizes: {
    [CATEGORY_TOPS]: {
      regular: {
        normal: null
      },
      plus: {
        normal: null
      },
      petite: {
        normal: null
      }
    },
    [CATEGORY_PANTS]: {
      regular: {
        normal: null,
        waist: null
      },
      plus: {
        normal: null
      },
      petite: {
        normal: null,
        waist: null
      }
    },
    [CATEGORY_SHOES]: {
      regular: {
        normal: null,
        width: null
      }
    }
  }
}

export default function reducer (state = defaultState, action = {}) {
  const { type, payload } = action
  switch (type) {
    case UPDATE_SIZES: {
      return {
        ...state,
        sizes: payload
      }
    }
    default: return state
  }
}

// Actions creator
export function updateSizes (sizes) {
  return { type: UPDATE_SIZES, payload: sizes }
}
