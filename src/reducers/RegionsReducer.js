import _ from 'lodash'
import constants from '../actions/types'

export default (state = {}, action) => {
  switch (action.type) {
    case constants.REGIONS_FETCH:
      return _.mapKeys(action.payload, '_id')
    case constants.REGION_ADD:
      return {...state, [action.payload._id]: action.payload}
    default:
      return state
  }
}
