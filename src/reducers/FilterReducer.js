import constants from '../actions/types'
import { drinks } from '../lib/enumerables'
import { toCheckboxObj } from '../lib/myHelpers'

export const initialState = {
  timeMin: -1,
  timeMax: -1,
  timeStart: -1,
  timeEnd: -1,
  dayMin: 0,
  dayMax: 6,
  dayStart: -1,
  dayEnd: -1,
  priceMin: 0,
  priceMax: -1,
  priceStart: 0,
  priceEnd: -1,
  includeDrinkWithMealPrices: { disabled: true, checked: false },
  drinks: {
    ...toCheckboxObj(drinks),
    All: {
      label: 'All',
      disabled: false,
      checked: true
    }
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.FILTER_SET:
      return initialState
    case constants.FILTER_UPDATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
