import constants from '../actions/types'
import _ from 'lodash'

const initialState = {
  venueOpenId: false,
  venueNextId: false,
  venuePrevId: false,
  regionVenues: {},
  leftNavOpen: true,
  activeRegion: {},
  // appClass possible values are:
  // [introPage, mapPage, venue, admin, adminVenue, adminRegion, regionModal]
  appClass: [],
  regionsModalActive: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.UI_SET_VENUE:
      return {
        ...state,
        venueOpenId: action.payload.openId,
        venueNextId: action.payload.nextId,
        venuePrevId: action.payload.prevId
      }
    case constants.UI_UNSET_VENUE:
      return {
        ...state,
        venueOpenId: false,
        venueNextId: false,
        venuePrevId: false
      }
    case constants.UI_UNSET_REGION:
      return { ...state, activeRegion: {} }
    case constants.UI_SET_REGION_VENUES:
      return { ...state, regionVenues: action.payload }
    case constants.UI_UNSET_REGION_VENUES:
      return { ...state, regionVenues: {} }
    case constants.UI_SHOW_REGIONS_MODAL:
      return { ...state, regionsModalActive: true }
    case constants.UI_HIDE_REGIONS_MODAL:
      return { ...state, regionsModalActive: false }
    case constants.UI_SET_APP_CLASS:
      return { ...state, appClass: action.payload }
    case constants.UI_ADD_TO_APP_CLASS:
      return { ...state, appClass: _.union(state.appClass, action.payload) }
    case constants.UI_REMOVE_FROM_APP_CLASS:
      return { ...state, appClass: _.pull(state.appClass, ...action.payload) }
    default:
      return state
  }
}
