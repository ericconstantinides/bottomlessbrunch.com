import { reducer as formReducer } from 'redux-form'
import RegionsReducer from './RegionsReducer'
import VenuesReducer from './VenuesReducer'
import EditVenueFieldsReducer from './EditVenueFieldsReducer'
import UiReducer from './UiReducer'
import MainMapReducer from './MainMapReducer'
import AdminReducer from './AdminReducer'

const reducers = {
  regions: RegionsReducer,
  venues: VenuesReducer,
  editVenueFields: EditVenueFieldsReducer,
  form: formReducer,
  ui: UiReducer,
  mainMap: MainMapReducer,
  admin: AdminReducer
}

export default reducers
