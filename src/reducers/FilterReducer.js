import constants from '../actions/types'
import { drinks } from '../lib/enumerables'
import { toCheckboxObj } from '../lib/myHelpers'

const initialState = {
  timeMin: 7,
  timeMax: 17,
  timeStart: 7,
  timeEnd: 17,
  dayMin: 0,
  dayMax: 6,
  dayStart: 0,
  dayEnd: 6,
  priceMin: 0,
  priceMax: 60,
  priceStart: 0,
  priceEnd: 60,
  includeDrinkWithMealPrices: { disabled: false, checked: true },
  drinks: toCheckboxObj([...drinks, 'All'])
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
