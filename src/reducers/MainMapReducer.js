import constants from '../actions/types'
import { USA_MAP_COORDS } from '../config'

const initialState = {
  coords: USA_MAP_COORDS,
  loaded: false,
  visibleVenuesArr: [],
  visibleRegionsObj: {},
  regionTitle: '',
  regionReset: ''
}

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.MAIN_MAP_SET:
      return { ...state, coords: action.payload, loaded: true }
    case constants.MAIN_MAP_UNSET:
      return initialState
    case constants.MAIN_MAP_UPDATE_SIZE:
      return {
        ...state,
        coords: { ...state.coords, size: action.payload },
        loaded: true
      }
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
