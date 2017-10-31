import constants from '../actions/types'

const initialState = {
  isFetched: false,
  isAdmin: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.ADMIN_SET:
      return { isAdmin: action.payload, isFetched: true }
    default:
      return state
  }
}
