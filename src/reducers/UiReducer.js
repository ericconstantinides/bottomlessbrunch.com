import constants from '../actions/types'
import _ from 'lodash'

const initialState = {
  sliderPosition: false,
  regionVenues: {},
  leftNavOpen: true,
  activeRegion: {},
  siteDataReady: false,
  drawer: {},
  // appClass possible values are:
  // [introPage, mapPage, venue, admin, adminVenue, adminRegion, regionModal]
  appClass: [],
  regionsModalActive: false,
  regionResetButton: true
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.UI_ACTIVATE_SITE:
      return { ...state, siteDataReady: true }
    case constants.UI_SET_DRAWER:
      return { ...state, drawer: action.payload }
    case constants.UI_SET_VENUE_SLIDER_POINTER:
      return { ...state, sliderPosition: action.payload }
    case constants.UI_UNSET_VENUE_SLIDER_POINTER:
      return { ...state, sliderPosition: false }
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
    case constants.UI_CHANGE_RESET_REGION_BUTTON:
      return { ...state, regionResetButton: action.payload }
    default:
      return state
  }
}
