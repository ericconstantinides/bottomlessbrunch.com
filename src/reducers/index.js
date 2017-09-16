import { combineReducers } from 'redux'
import RegionsReducer from './RegionsReducer'
import VenuesReducer from './VenuesReducer'

const rootReducer = combineReducers({
  regions: RegionsReducer,
  venues: VenuesReducer
})

export default rootReducer
