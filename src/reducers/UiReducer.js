import constants from '../actions/types'

// default to San Francisco (ID: 0) region:
const initialState = {
  venueOpenId: -1,
  leftNavOpen: true,
  region: 0,
  venueHover: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.UI_VENUE_OPEN:
      return Object.assign({}, state, {
        venueOpenId: action.payload.id
      })

    case constants.UI_SET_REGION:
      return Object.assign({}, state, {
        region: action.payload.regionId
      })

    case constants.UI_VENUE_HOVER_ON:
      return {...state, venueHover: action.payload.venue}

    case constants.UI_VENUE_HOVER_OFF:
      return {...state, venueHover: {}}

    default:
      return state
  }
}
