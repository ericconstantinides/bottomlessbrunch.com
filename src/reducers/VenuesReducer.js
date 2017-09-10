import { FETCH_VENUES, HOVER_VENUE_ON, HOVER_VENUE_OFF } from '../actions/types'
// import _ from 'lodash'

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_VENUES:
      // change it from an array to an object:
      // (will maybe do this later)
      // return _.mapKeys(action.payload.data, 'id')
      return action.payload.data
    case HOVER_VENUE_ON:
      return state.map(venue => {
        if (venue.id === action.payload.id) {
          venue.showInfo = true
        }
        return venue
      })
    case HOVER_VENUE_OFF:
      return state.map(venue => {
        venue.showInfo = false
        return venue
      })
    default:
      return state
  }
}
