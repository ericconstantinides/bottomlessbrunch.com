import constants from '../actions/types'

export default (state = {}, action) => {
  switch (action.type) {
    case constants.EDIT_VENUE_FETCH_GOOGLE_PLACES_DETAIL:
      return {...state, gData: action.payload}
    case constants.EDIT_VENUE_FETCH_GOOGLE_PLACES_DETAIL_CANCEL:
      return state
    default:
      return state
  }
}
