import constants from '../actions/types'
import { drinkIncludesFull, drinks } from '../lib/enumerables'
import { toCheckboxObj } from '../lib/myHelpers'

const initialState = {
  timeMin: 7,
  timeMax: 13,
  timeStart: 7,
  timeEnd: 13,
  dayMin: 0,
  dayMax: 6,
  dayStart: 0,
  dayEnd: 6,
  priceMin: 0,
  priceMax: 60,
  priceStart: 0,
  priceEnd: 60,
  priceMeta: drinkIncludesFull,
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
