import _ from 'lodash'

/**
 * Reduces list of Venues by a Region
 * @param {Object} venues
 * @param {Number} id
 * @return {Object}
 */
export function reduceVenuesByRegion (venues, regionId) {
  return _.filter(venues, venue => {
    if (venue.regionId === regionId) return venue
  })
}
