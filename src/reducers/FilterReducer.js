import constants from '../actions/types'

const initialState = {}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.FILTER_SET:
      return { initialState }
    default:
      return state
  }
}
