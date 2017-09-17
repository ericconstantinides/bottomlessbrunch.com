import constants from '../actions/types'

const initialState = {
  venueOpenId: -1,
  leftNavOpen: true
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.UI_VENUE_OPEN:
      return Object.assign({}, state, {
        venueOpenId: action.payload.id
      })
    default:
      return state
  }
}
