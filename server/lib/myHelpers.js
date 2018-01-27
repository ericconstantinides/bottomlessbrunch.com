const sitemapCreator = require('sitemap')

exports.camelize = function (str) {
  return (
    str
      // Remove any - or _ characters with a space
      .replace(/[-_]+/g, ' ')
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase()
      })
      .replace(/\s+/g, '')
  )
}

/**
 * slugify turns normal text into a lowercase slug suitable for a URI
 *
 * @export
 * @param {String} str
 * @returns {String} slugified string
 */
exports.slugify = function (str) {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of string
    .replace(/-+$/, '') // Trim - from end of string
}

/**
 * booleanArrayOrString determines if a string is:
 *                     yes => return true
 *                      no => return false
 * commma separated values => return array of values
 *
 * @param {String} str
 * @returns {Boolean or Array}
 */
exports.booleanArrayOrString = function (str) {
  if (str.toLowerCase() === 'yes') return true
  if (str.toLowerCase() === 'no') return false
  const arrayStr = str.split(', ')
  if (arrayStr.length > 1) return arrayStr
  return str
}

exports.generateJsonSitemap = function (regions, venues) {
  let activeRegions = []
  // get all the slugs for the regions:
  const regionsWithSlug = regions.map(region => {
    region.slug = exports.slugify(region.name)
    return region
  })
  // get all the slugs for the venues
  const sortedVenues = venues
    .filter(venue => !venue.unpublish)
    .map(venue => {
      const nameSlug = exports.slugify(venue.name)
      const neighSlug = venue.neighborhood
        ? '-' + exports.slugify(venue.neighborhood)
        : ''
      // add the region to the active regions:
      const regionSlug = regionsWithSlug
        .filter(region => {
          return region._id.toString() === venue.regionId.toString()
        })
        .map(region => {
          return region.slug
        })[0]
      // add the regionSlug to the activeRegions
      activeRegions.push(regionSlug)
      return regionSlug + '/' + nameSlug + neighSlug
    })
    .sort()
  // make the activeRegions unique and sorted:
  const sortedRegions = [...new Set(activeRegions)].sort()
  // create the regions at 1.0 priorty:
  const regionUrls = sortedRegions.map(slug => ({url: slug, priority: 1}))
  // create the venues at 0.5 priority
  const venueUrls = sortedVenues.map(slug => ({url: slug, priority: 0.5}))
  // combine the arrays:
  const urls = [...regionUrls, ...venueUrls]

  const sitemap = sitemapCreator.createSitemap({
    hostname: process.env.DOMAIN,
    cacheTime: 600000, // 600 sec - cache purge period
    urls
  })
  return sitemap
}
