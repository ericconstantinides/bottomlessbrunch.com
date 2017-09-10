import { combineReducers } from 'redux'
import VenuesReducer from './VenuesReducer'

const rootReducer = combineReducers({
  venues: VenuesReducer
  // this is just a placeholder:
  // state: (state = {}) => state
})

export default rootReducer
