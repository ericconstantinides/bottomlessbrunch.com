import constants from '../actions/types'

const initialState = {
  venueOpenId: '',
  leftNavOpen: true,
  activeRegion: {}, // <- this is temporary name
  regionsModalActive: false,
  browserSize: {
    width: 0,
    height: 0
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.UI_VENUE_OPEN:
      return { ...state, venueOpenId: action.payload.id }
    case constants.UI_VENUE_CLOSE:
      return { ...state, venueOpenId: false }
    case constants.UI_SET_REGION:
      return { ...state, activeRegion: action.payload }
    case constants.UI_UNSET_REGION:
      return { ...state, activeRegion: {} }
    case constants.UI_SET_VENUE:
      return { ...state, venueOpenId: action.payload }
    case constants.UI_UNSET_VENUE:
      return { ...state, venueOpenId: '' }
    case constants.UI_SET_BROWSER_SIZE:
      return {
        ...state,
        browserSize: {
          width: action.payload.width,
          height: action.payload.height
        }
      }
    case constants.UI_SHOW_REGIONS_MODAL:
      return {...state, regionsModalActive: true}
    case constants.UI_HIDE_REGIONS_MODAL:
      return {...state, regionsModalActive: false}
    default:
      return state
  }
}
