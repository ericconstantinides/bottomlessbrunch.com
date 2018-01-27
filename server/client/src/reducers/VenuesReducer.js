import _ from 'lodash'
import constants from '../actions/types'

export default (state = {}, action) => {
  switch (action.type) {
    case constants.VENUES_FETCH:
      return _.mapKeys(action.payload, '_id')
    case constants.VENUE_FETCH_DETAIL:
      return { ...state, [action.payload._id]: action.payload }
    case constants.VENUE_ADD:
      return { ...state, [action.payload._id]: action.payload }
    case constants.VENUE_EDIT:
      return { ...state, [action.payload._id]: action.payload }
    case constants.VENUE_DELETE:
      return _.omit(state, action.payload)
    case constants.VENUE_FETCH_GOOGLE_PLACES_DETAIL:
      return {
        ...state,
        [action.payload._id]: {
          ...state[action.payload._id],
          googlePlacesData: action.payload.googlePlacesData
        }
      }
    case constants.VENUE_FETCH_GOOGLE_PLACES_DETAIL_CANCEL:
      return state
    default:
      return state
  }
}
