import _ from 'lodash'
import constants from '../actions/types'

export default (state = {}, action) => {
  switch (action.type) {
    case constants.REGIONS_FETCH:
      return _.mapKeys(action.payload, '_id')
    case constants.REGION_ADD:
      // TODO: ADD THIS TO STATE
      console.log(action.payload)
      return state
    default:
      return state
  }
}
