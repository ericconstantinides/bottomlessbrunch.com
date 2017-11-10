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

export function getMainMapVisibleVenues (venues, coords, fetchVenueDetail) {
  const { ne, sw } = coords.bounds
  let visibleVenues = []
  _.map(venues, venue => {
    if (
      venue.lat <= ne.lat &&
      venue.lat >= sw.lat &&
      venue.lng <= ne.lng &&
      venue.lng >= sw.lng
    ) {
      visibleVenues.push(venue._id)
      if (venue.fetchedLevel === 'minimal') {
        fetchVenueDetail(venue._id, 'teaser')
      }
    }
  })
  // now from the visibleVenues, we need to determine the visibleVenues
  const visibleRegions = 'tbd'
  return {
    type: constants.MAIN_MAP_SET_VISIBLE_VENUES,
    payload: {visibleVenues, visibleRegions}
  }
}
