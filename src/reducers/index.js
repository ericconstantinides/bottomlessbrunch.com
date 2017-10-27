import { reducer as formReducer } from 'redux-form'
import RegionsReducer from './RegionsReducer'
import VenuesReducer from './VenuesReducer'
import EditVenueFieldsReducer from './EditVenueFieldsReducer'
import UiReducer from './UiReducer'
import MainMapReducer from './MainMapReducer'

const reducers = {
  regions: RegionsReducer,
  venues: VenuesReducer,
  editVenueFields: EditVenueFieldsReducer,
  form: formReducer,
  ui: UiReducer,
  mainMap: MainMapReducer
}

export default reducers
