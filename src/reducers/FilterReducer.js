import constants from '../actions/types'
import { drinkIncludesFull, drinks } from '../lib/enumerables'
import { toCheckboxObj } from '../lib/myHelpers'

const initialState = {
  timeStart: 7,
  timeEnd: 13,
  dayStart: 0,
  dayEnd: 6,
  priceStart: 0,
  priceEnd: 60,
  priceMeta: drinkIncludesFull,
  drinks: toCheckboxObj(drinks)
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.FILTER_SET:
      return initialState
    default:
      return state
  }
}
