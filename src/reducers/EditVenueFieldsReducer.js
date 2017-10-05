import constants from '../actions/types'

export default (state = {}, action) => {
  switch (action.type) {
    case constants.EDIT_VENUE_FETCH_GOOGLE_PLACES_DETAIL:
      console.log(action.payload)
      return {...state, gData: action.payload}
    case constants.EDIT_VENUE_FETCH_YELP_PHONE_SEARCH_DETAIL:
      return {...state, yData: action.payload}
    case constants.EDIT_VENUE_FETCH_YELP_META_DETAIL:
      return {...state, yMeta: action.payload}
    case constants.EDIT_VENUE_RESET:
      return {}
    case constants.EDIT_VENUE_FETCH_GOOGLE_PLACES_DETAIL_CANCEL:
      return state
    default:
      return state
  }
}
