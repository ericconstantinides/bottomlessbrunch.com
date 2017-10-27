import constants from '../actions/types'
import { USA_MAP } from '../config'

const initialState = {
  bounds: USA_MAP.bounds,
  center: USA_MAP.center,
  marginBounds: USA_MAP.bounds,
  size: { width: 0, height: 0 },
  zoom: USA_MAP.zoom,
  loaded: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.MAIN_MAP_SET:
      return { ...action.payload, loaded: true }
    default:
      return state
  }
}
