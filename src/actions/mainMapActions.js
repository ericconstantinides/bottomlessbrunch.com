import _ from 'lodash'
import constants from './types'
// import { parsePath } from '../lib/myHelpers'
import {
  getViewportOffset,
  getMarginBounds,
  getRegionByPath,
  parsePath
} from '../lib/myHelpers'

// export function initMainMap (regions, history) {
//   return {
//     type: constants.MAIN_MAP_SET,
//     payload: JSON.parse(mainMapCoords)
//   }
// }

// I will get the slug from the path and also the storage to figure
// out the initial map state:
export function getInitialMapLocation (coords, regions, history, drawer) {
  const region = getRegionByPath(regions, history.location.pathname)
  if (region) {
    return setMainMapByRegion(region, coords, drawer)
  }
  const mainMapCoords = window.localStorage.getItem('mainMap')
  if (!mainMapCoords) return unsetMainMap()
  return {
    type: constants.MAIN_MAP_SET,
    payload: JSON.parse(mainMapCoords)
  }
}

export function setMainMap (coords) {
  // this is where I want to figure out the marginBounds:
  const marginCoords = getMarginBounds(coords.bounds, coords.size)

  coords = { ...coords, ...marginCoords }

  window.localStorage.setItem('mainMap', JSON.stringify(coords))
  return {
    type: constants.MAIN_MAP_SET,
    payload: coords
  }
}

export function setMainMapByRegion (region, coords, drawer) {
  // get the width and height if it's not known yet:
  coords.size.width = coords.size.width === 0
    ? window.innerWidth
    : coords.size.width
  coords.size.height = coords.size.height === 0
    ? window.innerHeight
    : coords.size.height

  const fitted = getViewportOffset(region.bounds, coords.size, drawer)
  const newCoords = { ...coords, ...fitted }

  window.localStorage.setItem('mainMap', JSON.stringify(coords))
  return {
    type: constants.MAIN_MAP_SET,
    payload: newCoords
  }
}

export function unsetMainMap () {
  window.localStorage.removeItem('mainMap')
  return {
    type: constants.MAIN_MAP_UNSET,
    payload: null
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
  history,
  drawer
) {
  const parsedPath = parsePath(history.location.pathname)
  let regionTitle = 'Choose Region'
  if (coords.zoom >= drawer.show_venues_zoom_level) {
    let regionReset = ''
    const { ne, sw } = coords.marginBounds
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
        // check if this region has been recorded yet:
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
        const center = coords.marginCenter ? coords.marginCenter : coords.center
        if (
          region.bounds &&
          center.lat <= region.bounds.north &&
          center.lat >= region.bounds.south &&
          center.lng <= region.bounds.east &&
          center.lng >= region.bounds.west
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
    // check visibleRegionsObj again if it changed from right above:
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
          const slug = regions[visibleRegionsObj[keys[0]]._id].slug
          if (parsedPath.length <= 1 && parsedPath[0] !== slug) {
            history.push(slug)
          }
          regionReset = keys[0]
          regionTitle = visibleRegionsObj[keys[0]].name
        } else {
          // FULL SINGLE REGION:
          const slug = regions[visibleRegionsObj[keys[0]]._id].slug
          if (parsedPath.length <= 1 && parsedPath[0] !== slug) {
            history.push(slug)
          }
          // This should only show when the coords are different:
          regionReset = keys[0]
          regionTitle = visibleRegionsObj[keys[0]].name
        }
      } else {
        // MULTIPLE REGIONS
        if (parsedPath.length === 1) {
          history.replace('/')
        }
        regionTitle = 'Multiple Regions'
      }
    }
    visibleVenuesArr.sort((idA, idB) => (
        (Math.abs(venues[idB].lat) + Math.abs(venues[idB].lng)) -
        (Math.abs(venues[idA].lat) + Math.abs(venues[idA].lng))
    ))
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
    if (history.location.pathname !== '/') {
      history.replace('/')
    }
    return {
      type: constants.MAIN_MAP_SET_ONLY_REGIONS,
      payload: regionTitle
    }
  }
}
