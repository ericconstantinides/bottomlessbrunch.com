import constants from '../actions/types'
import { USA_MAP } from '../config'

const initialState = {
  lat: USA_MAP.lat,
  lng: USA_MAP.lng,
  zoom: USA_MAP.zoom,
  bounds: USA_MAP.bounds,
  loaded: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.MAIN_MAP_SET:
      const { lat, lng, zoom, bounds } = action.payload
      return { ...state, lat, lng, zoom, bounds, loaded: true }
    default:
      return state
  }
}
