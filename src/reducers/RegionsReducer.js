import constants from '../actions/types'

export default function (state = [], action) {
  switch (action.type) {
    case constants.REGIONS_FETCH:
      return action.payload.data
    default:
      return state
  }
}
