import {
  VENUES_FETCH,
  VENUE_SHOWINFO,
  VENUE_HIDEINFO,
  VENUE_OPEN
} from '../actions/types'
// import _ from 'lodash'

export default (state = [], action) => {
  switch (action.type) {
    case VENUES_FETCH:
      // change it from an array to an object:
      // (will maybe do this later)
      // return _.mapKeys(action.payload.data, 'id')
      return action.payload.data
    case VENUE_SHOWINFO:
      return state.map(venue => {
        if (venue.id === action.payload.id) {
          venue.showInfo = true
        }
        return venue
      })
    case VENUE_HIDEINFO:
      return state.map(venue => {
        venue.showInfo = false
        return venue
      })
    case VENUE_OPEN:
      return state.map(venue => {
        if (venue.id === action.payload.id) {
          venue.open = true
        }
        return venue
      })
    default:
      return state
  }
}
