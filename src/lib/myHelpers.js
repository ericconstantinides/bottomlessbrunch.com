import _ from 'lodash'

/**
 * Reduces list of Venues by a Region
 * @param {Object} venues
 * @param {Number} id
 * @return {Object}
 */
export function reduceVenuesByRegion (venues, regionId) {
  const reduced = _.filter(venues, venue => {
    if (venue.regionId === regionId) return venue
  })
  return _.mapKeys(reduced, 'id')
}

/**
 * Rounds the number to nearest half decimal
 * @param {Number} num
 * @return {Number}
 */
export function roundHalf (num) {
  return Math.round(num * 2) / 2
}
