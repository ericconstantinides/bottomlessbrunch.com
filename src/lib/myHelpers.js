import { fitBounds } from 'google-map-react/utils'
import _ from 'lodash'

/**
 * Reduces list of Venues by a Region
 * @param {Object} venues
 * @param {String} regionId
 * @return {Object}
 */
export function reduceVenuesByRegion (venues, regionId) {
  const reduced = _.filter(venues, venue => {
    if (venue.regionId === regionId) return venue
  })
  return _.mapKeys(reduced, '_id')
}

/**
 * Rounds the number to nearest half decimal
 * @param {Number} num
 * @return {Number}
 */
export function roundHalf (num) {
  return Math.round(num * 2) / 2
}

/**
 * Parses a pathName and returns it as an array
 * @param {String} fullPath
 * @return {Array}
 */
export function parsePath (fullPath) {
  const trimFront = fullPath.substring(0, 1) === '/'
    ? fullPath.substring(1)
    : fullPath
  const trimmed = trimFront.substring(trimFront.length - 1, 1) === '/'
    ? trimFront.substring(1)
    : trimFront
  return trimmed.split('/')
}

/**
 * Takes coordinates and creates object with regular bounds
 * @param {Number} LatNorth
 * @param {Number} latSouth
 * @param {Number} lngWest
 * @param {Number} lngEast
 * @return {Object} Object with nw, ne, se, sw
 */
export function convertToBounds (latNorth, latSouth, lngWest, lngEast) {
  return {
    nw: { lat: latNorth, lng: lngWest },
    ne: { lat: latNorth, lng: lngEast },
    se: { lat: latSouth, lng: lngEast },
    sw: { lat: latSouth, lng: lngWest }
  }
}

/**
 * Takes fitBounds() values and makes it ready right away for Google Map
 * @param {object} myBounds Bounds w/ either nw && se -OR- ne && sw
 * @param {object} size Object with 'width' and 'height'
 * @return {Object} Object ready for Google Maps
 */
export function fitBoundsGoogleReady (myBounds, size) {
  const { center: position, newBounds: bounds, zoom } = fitBounds(
    myBounds,
    size
  )
  return { bounds, position, zoom }
}

/**
 * Finds the closest region
 * @param {object} position with lat and lng
 * @param {object} regions
 * @return {string} String of the regionId
 */
export function findClosestRegion ({ lat, lng }, regions) {
  let closestMatchRegionId = null
  let closestMatchDiff = null
  _.map(regions, region => {
    const diff = Math.abs(region.lat - lat) + Math.abs(region.lng - lng)
    if (!closestMatchDiff || diff < closestMatchDiff) {
      closestMatchDiff = diff
      closestMatchRegionId = region._id
    }
  })
  return closestMatchRegionId
}

/**
 * Extract From Address gets value from a google places address_component
 *
 * @param {array} addressArr
 * @param {string} reqType
 * @param {string} fldLength
 * @return {string}
 */
export function getAddy (addressArr, reqType, fldLength = 'short_name') {
  let toReturn
  addressArr.forEach(component =>
    component.types.forEach(type => {
      if (type === reqType) {
        toReturn = component[fldLength]
      }
    })
  )
  return toReturn
}
