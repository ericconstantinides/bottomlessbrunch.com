import {
  REGIONS_FETCH
} from '../actions/types'

export default function (state = [], action) {
  switch (action.type) {
    case REGIONS_FETCH:
      return action.payload.data
    default:
      return state
  }
}
