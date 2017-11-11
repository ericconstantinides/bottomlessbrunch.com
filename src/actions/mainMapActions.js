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

export function getMainMapVisibleVenues (
  venues,
  regions,
  coords,
  fetchVenueDetail
) {
  const { ne, sw } = coords.bounds
  let visibleVenuesArr = []
  let visibleRegionsObj = {}
  _.map(venues, venue => {
    if (
      venue.lat <= ne.lat &&
      venue.lat >= sw.lat &&
      venue.lng <= ne.lng &&
      venue.lng >= sw.lng
    ) {
      visibleVenuesArr.push(venue._id)
      if (!visibleRegionsObj[venue.regionId]) {
        visibleRegionsObj[venue.regionId] = {
          name: regions[venue.regionId].name,
          _id: venue.regionId,
          venuesVisible: 1
        }
      } else {
        const venuesVisible = ++visibleRegionsObj[venue.regionId].venuesVisible
        visibleRegionsObj[venue.regionId].venuesVisible = venuesVisible
      }
      if (venue.fetchedLevel === 'minimal') {
        fetchVenueDetail(venue._id, 'teaser')
      }
    }
  })
  // check if we're inside a region, just no venues are visible here:
  if (_.isEmpty(visibleRegionsObj)) {
    _.map(regions, region => {
      if (
        region.bounds &&
        coords.center.lat <= region.bounds.north &&
        coords.center.lat >= region.bounds.south &&
        coords.center.lng <= region.bounds.east &&
        coords.center.lng >= region.bounds.west
      ) {
        visibleRegionsObj[region._id] = {
          name: region.name,
          _id: region._id,
          venuesVisible: 0
        }
      }
    })
  }
  // count how many venues are possible (this shouldn't be done here... we should move this to when I load the regions and venues...)
  _.map(visibleRegionsObj, region => {
    let venuesAvailable = 0
    _.map(venues, venue => {
      if (venue.regionId === region._id) {
        venuesAvailable++
      }
    })
    region.venuesAvailable = venuesAvailable
  })
  return {
    type: constants.MAIN_MAP_SET_VISIBLE_VENUES,
    payload: { visibleVenuesArr, visibleRegionsObj }
  }
}
