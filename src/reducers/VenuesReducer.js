import _ from 'lodash'
import constants from '../actions/types'

export default (state = {}, action) => {
  switch (action.type) {
    case constants.VENUES_FETCH:
      return _.mapKeys(action.payload.data, 'id')
    case constants.VENUE_FETCH_DETAIL:
      const venueState = {...state[action.id], googePlacesData: action.payload}
      return {...state, [action.id]: venueState}
    default:
      return state
  }
}
