import { FETCH_VENUES } from '../actions/types'
// import _ from 'lodash'

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_VENUES:
      // change it from an array to an object:
      // (will maybe do this later)
      // return _.mapKeys(action.payload.data, 'id')
      return action.payload.data
    default:
      return state
  }
}
