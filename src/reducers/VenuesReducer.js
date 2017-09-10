import { FETCH_VENUES } from '../actions/types'

export default (state = {}, action) => {
  switch (action.type) {
    case FETCH_VENUES:
      // fix this ↓
      return state
    default:
      return state
  }
}
