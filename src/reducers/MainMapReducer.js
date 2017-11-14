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
  visibleRegionsObj: {},
  regionTitle: '',
  regionReset: ''
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.MAIN_MAP_SET:
      return { ...action.payload, loaded: true }
    case constants.MAIN_MAP_UNSET:
      return initialState
    case constants.MAIN_MAP_UPDATE_SIZE:
      return { ...state, size: action.payload, loaded: true }
    case constants.MAIN_MAP_SET_VISIBLE_VENUES_AND_REGIONS:
      const {
        visibleVenuesArr,
        visibleRegionsObj,
        regionTitle,
        regionReset
      } = action.payload
      return {
        ...state,
        visibleVenuesArr,
        visibleRegionsObj,
        regionTitle,
        regionReset
      }
    case constants.MAIN_MAP_SET_ONLY_REGIONS:
      return {
        ...state,
        visibleVenuesArr: [],
        visibleRegionsObj: {},
        regionTitle: action.payload,
        regionReset: ''
      }
    default:
      return state
  }
}
