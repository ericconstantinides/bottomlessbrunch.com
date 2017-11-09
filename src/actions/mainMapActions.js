import constants from './types'

export function setMainMap (coords) {
  // console.log('settings coords:', coords)
  return {
    type: constants.MAIN_MAP_SET,
    payload: coords
  }
}
// size = {width: n, height: n}
export function updateMainMapSize (size) {
  return {
    type: constants.MAIN_MAP_UPDATE_SIZE,
    payload: size
  }
}
