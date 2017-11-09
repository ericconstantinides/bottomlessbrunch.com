import _ from 'lodash'
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

export function getMainMapVisibleVenues (venues, coords) {
  const { ne, sw } = coords.bounds
  const visibleVenues = _.pickBy(venues, venue => {
    return (
      venue.lat <= ne.lat &&
      venue.lat >= sw.lat &&
      venue.lng <= ne.lng &&
      venue.lng >= sw.lng
    )
  })
  console.log(visibleVenues)
  // now from the visibleVenues, we need to determine the visibleVenues
  const visibleRegions = 'tbd'
  return {
    type: constants.MAIN_MAP_SET_VISIBLE_VENUES,
    payload: {visibleVenues, visibleRegions}
  }
}
