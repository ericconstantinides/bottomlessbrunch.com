import constants from './types'

export function setMainMap (coords) {
  return {
    type: constants.MAIN_MAP_SET,
    payload: coords
  }
}
