import { reducer as formReducer } from 'redux-form'
import RegionsReducer from './RegionsReducer'
import VenuesReducer from './VenuesReducer'
import UiReducer from './UiReducer'

const reducers = {
  regions: RegionsReducer,
  venues: VenuesReducer,
  form: formReducer,
  ui: UiReducer
}

export default reducers
