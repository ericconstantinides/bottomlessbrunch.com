import _ from 'lodash'
import constants from './types'
import { getRegionCoordsByViewport } from '../lib/myHelpers'
import { SHOW_VENUES_ZOOM_LEVEL } from '../config'

export function setMainMap (coords) {
  window.localStorage.setItem('mainMap', JSON.stringify(coords))
  return {
    type: constants.MAIN_MAP_SET,
    payload: coords
  }
}

export function setMainMapByRegion (region, size) {
  // get the width and height if it's not known yet:
  size.width = size.width === 0 ? window.innerWidth : size.width
  size.height = size.height === 0 ? window.innerHeight : size.height

  const coords = getRegionCoordsByViewport(region, size)
  window.localStorage.setItem('mainMap', JSON.stringify(coords))
  return {
    type: constants.MAIN_MAP_SET,
    payload: coords
  }
}

export function unsetMainMap () {
  window.localStorage.removeItem('mainMap')
  return {
    type: constants.MAIN_MAP_UNSET,
    payload: null
  }
}
export function fetchMainMap () {
  const mainMap = window.localStorage.getItem('mainMap')
  if (!mainMap) return unsetMainMap()
  return {
    type: constants.MAIN_MAP_SET,
    payload: JSON.parse(mainMap)
  }
}
// size = {width: n, height: n}
export function updateMainMapSize (mapSize) {
  return {
    type: constants.MAIN_MAP_UPDATE_SIZE,
    payload: mapSize
  }
}

export function getMainMapVisibleVenues (
  venues,
  regions,
  coords,
  fetchVenueDetail,
  history
) {
  let regionTitle = 'Choose Region'
  if (coords.zoom >= SHOW_VENUES_ZOOM_LEVEL) {
    let regionReset = ''
    const { ne, sw } = coords.bounds
    let visibleVenuesArr = []
    let visibleRegionsObj = {}
    // loop through all the venues:
    _.map(venues, venue => {
      // check if the venue is within the map's coords:
      if (
        venue.lat <= ne.lat &&
        venue.lat >= sw.lat &&
        venue.lng <= ne.lng &&
        venue.lng >= sw.lng
      ) {
        // add the venue to the visibleVenuesArr:
        visibleVenuesArr.push(venue._id)
        // VISIBLE REGIONS LOGIC:
        // check if this region has been saved yet:
        if (!visibleRegionsObj[venue.regionId]) {
          // if not, add it to visibleRegionsObj
          visibleRegionsObj[venue.regionId] = {
            name: regions[venue.regionId].name,
            _id: venue.regionId,
            venuesVisible: 1
          }
        } else {
          // just increment the venuesVisible:
          visibleRegionsObj[venue.regionId].venuesVisible++
        }
        // finally, since the venue is visible, we need to get more data for it:
        if (venue.fetchedLevel !== 'full') {
          fetchVenueDetail(venue._id, 'full')
        }
      }
    })
    // POST VENUE CHECKING:
    // check if we're inside a region, just no venues are currently visible:
    if (_.isEmpty(visibleRegionsObj)) {
      _.map(regions, region => {
        // debugger
        if (
          region.bounds &&
          coords.center.lat <= region.bounds.north &&
          coords.center.lat >= region.bounds.south &&
          coords.center.lng <= region.bounds.east &&
          coords.center.lng >= region.bounds.west
        ) {
          // SINGLE REGION
          visibleRegionsObj[region._id] = {
            name: region.name,
            _id: region._id,
            venuesVisible: 0
          }
        } else {
          // NO REGION:
          if (history.location.pathname !== '/') {
            history.replace('/')
          }
        }
      })
    }
    // check it again if we filled something in from POST VENUE CHECKING:
    if (!_.isEmpty(visibleRegionsObj)) {
      // visibleRegionsObj has data. let's do some checks on it:
      const keys = _.keysIn(visibleRegionsObj)
      if (keys.length === 1) {
        // we have only 1 region visible
        // let's check if we're showing less than all the venues:
        if (
          visibleRegionsObj[keys[0]].venuesVisible <
          regions[keys[0]].venuesAvailable
        ) {
          // PARTIAL SINGLE REGION:
          const slug = '/' + regions[visibleRegionsObj[keys[0]]._id].slug
          if (history.location.pathname !== slug) {
            history.push(slug)
          }
          regionReset = keys[0]
          regionTitle = visibleRegionsObj[keys[0]].name
        } else {
          // FULL SINGLE REGION:
          const slug = '/' + regions[visibleRegionsObj[keys[0]]._id].slug
          if (history.location.pathname !== slug) {
            history.push(slug)
          }
          regionTitle = visibleRegionsObj[keys[0]].name
        }
      } else {
        // MULTIPLE REGIONS
        if (history.location.pathname !== '/') {
          history.replace('/')
        }
        regionTitle = 'Multiple Regions'
      }
    }
    return {
      type: constants.MAIN_MAP_SET_VISIBLE_VENUES_AND_REGIONS,
      payload: {
        visibleVenuesArr,
        visibleRegionsObj,
        regionTitle,
        regionReset
      }
    }
  } else {
    return {
      type: constants.MAIN_MAP_SET_ONLY_REGIONS,
      payload: regionTitle
    }
  }
}
