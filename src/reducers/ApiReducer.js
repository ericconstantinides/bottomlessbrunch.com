import constants from '../actions/types'

export default (state = {}, action) => {
  switch (action.type) {
    case constants.API_ERROR:
      // console.log(action)
      return { ...state, error: action.payload }
    default:
      return state
  }
}
