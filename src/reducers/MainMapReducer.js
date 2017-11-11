import constants from '../actions/types'
import { USA_MAP } from '../config'

const initialState = {
  center: USA_MAP.center,
  bounds: USA_MAP.bounds,
  marginBounds: USA_MAP.bounds,
  size: { width: 0, height: 0 },
  zoom: USA_MAP.zoom,
  loaded: false,
  visibleVenuesArr: [],
  visibleRegionsObj: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.MAIN_MAP_SET:
      return { ...action.payload, loaded: true }
    case constants.MAIN_MAP_UPDATE_SIZE:
      return { ...state, size: action.payload, loaded: true }
    case constants.MAIN_MAP_SET_VISIBLE_VENUES:
      const { visibleVenuesArr, visibleRegionsObj } = action.payload
      return { ...state, visibleVenuesArr, visibleRegionsObj }
    default:
      return state
  }
}
