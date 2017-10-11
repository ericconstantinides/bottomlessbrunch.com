import constants from '../actions/types'

const initialState = {
  venueOpenId: '',
  leftNavOpen: true,
  region: '',
  venueHover: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.UI_VENUE_OPEN:
      return {...state, venueOpenId: action.payload.id}
    case constants.UI_VENUE_CLOSE:
      return {...state, venueOpenId: false}
    case constants.UI_SET_REGION:
      return {...state, region: action.payload}
    case constants.UI_UNSET_REGION:
      return {...state, region: ''}
    case constants.UI_SET_VENUE:
      return {...state, venueOpenId: action.payload}
    case constants.UI_UNSET_VENUE:
      return {...state, venueOpenId: ''}
    case constants.UI_VENUE_HOVER_ON:
      return {...state, venueHover: action.payload.venue}
    case constants.UI_VENUE_HOVER_OFF:
      return {...state, venueHover: {}}

    default:
      return state
  }
}
