import _ from 'lodash'
import constants from '../actions/types'

export default (state = {}, action) => {
  switch (action.type) {
    case constants.REGIONS_FETCH:
      return _.mapKeys(action.payload, '_id')
    case constants.REGION_ADD:
      return {...state, [action.payload._id]: action.payload}
    case constants.REGION_EDIT:
      return {...state, [action.payload._id]: action.payload}
    case constants.REGION_DELETE:
      return _.omit(state, action.payload)
    case constants.REGIONS_CALC_META:
      let newState = {}
      // cycle through all the regions adding the bounds:
      _.map(state, (region, id) => {
        newState[id] = region
        if (action.payload[id] && action.payload[id].bounds) {
          newState[id].bounds = action.payload[id].bounds
          newState[id].calcCenter = action.payload[id].calcCenter
          newState[id].venuesAvailable = action.payload[id].venuesAvailable
        }
      })
      return newState
    default:
      return state
  }
}
