import _ from 'lodash'
import constants from '../actions/types'

export default (state = {}, action) => {
  switch (action.type) {
    case constants.REGIONS_FETCH:
      // TODO: SWITCH TO DB
      return _.mapKeys(action.payload.data, 'id')
    case constants.REGION_ADD:
      // TODO: ADD THIS TO STATE
      console.log(action.payload)
      return state
    default:
      return state
  }
}
