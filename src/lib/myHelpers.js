import { fitBounds } from 'google-map-react/utils'
import { DRAWER, PAD_DEGREES } from '../config'
import _ from 'lodash'

/**
 * Reduces list of Venues by a Region
 * @param {Object} venues
 * @param {String} regionId
 * @return {Object}
 */
export function reduceVenuesByRegion (venues, regionId) {
  const reduced = _.filter(venues, venue => {
    if (venue.regionId === regionId && !venue.unpublish) return venue
  })
  const reducedWithIndex = reduced.map((venue, index) => {
    venue.index = index
    return venue
  })
  return _.mapKeys(reducedWithIndex, '_id')
}

export function getVenueBySlug (venues, slug) {
  const venue = _.filter(venues, venue => {
    if (venue.slug === slug) return venue
  })
  return venue[0]
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
 * slugify turns normal text into a lowercase slug suitable for a URI
 *
 * @export
 * @param {String} str
 * @returns {String} slugified string
 */
export function slugify (str) {
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
 * camelize creates a camelCase from a string
 *
 * @export
 * @param {String} str
 * @returns {String}
 */
export function camelize (str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
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
  let fieldValue = ''
  addressArr.forEach(component =>
    component.types.forEach(type => {
      if (type === reqType) {
        fieldValue = component[fldLength]
      }
    })
  )
  return fieldValue
}

/**
 * Removes dashes and spaces from some text
 *
 * @export
 * @param {string} text
 * @returns {string}
 */
export function stripDashesSpaces (text) {
  if (!text) return
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '') // Replace spaces with ''
    .replace(/-/g, '') // Replace - with ''
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

/**
 * Breaks out the days from inside funTimes so every day of category is shown
 *
 * @export
 * @param {Array} funTimes
 * @param {String} category
 * @returns {Array}
 */
export function compileDays (funTimes, category) {
  if (funTimes.length) {
    return funTimes
      .filter(fun => category === fun.category)
      .map(fun => {
        const { days, startTime: start, endTime: end } = fun
        const startTime = start.split(':00').join('')
        const endTime = end.split(':00').join('')
        return days.map(day => ({ day, category, startTime, endTime }))
      })
      .reduce((totalFun, fun) => [...totalFun, ...fun])
  }
}

/**
 * Takes the hours from Google and makes them nicer
 *
 * @export
 * @param {Object} hours
 * @returns {Array}
 */
export function compileGoogleHours (gData) {
  function scrunchDays (daysArr) {
    if (daysArr.length === 1) return daysArr[0]
    if (daysArr.length === 2) {
      return daysArr[0] + ' & ' + daysArr[1]
    }
    return daysArr[0] + ' - ' + daysArr[daysArr.length - 1]
  }
  function abbrWeekday (day) {
    if (day === 'Monday') return 'Mon'
    if (day === 'Tuesday') return 'Tues'
    if (day === 'Wednesday') return 'Wed'
    if (day === 'Thursday') return 'Thurs'
    if (day === 'Friday') return 'Fri'
    if (day === 'Saturday') return 'Sat'
    if (day === 'Sunday') return 'Sun'
  }
  if (gData && gData.opening_hours && gData.opening_hours.weekday_text) {
    const niceTimes = gData.opening_hours.weekday_text.map((day, i) => {
      // split string up at the `colon space`
      let [weekday, rest] = day.split(': ')
      weekday = abbrWeekday(weekday)
      // rewrite the time to be more readable
      const time = rest
        .split(':00')
        .join('')
        .split(' AM')
        .join('AM')
        .split(' PM')
        .join('PM')
        .split(' – ')
        .join('–')
      return { weekday, time }
    })
    // now I'd like to condense the hours
    let condensedTimes = []
    let accumulatedDays = []
    let prevTime = ''
    niceTimes.forEach((dayObj, i) => {
      if (prevTime && prevTime !== dayObj.time) {
        const weekday = scrunchDays(accumulatedDays)
        condensedTimes.push({ weekday, time: prevTime })
        accumulatedDays = []
      }
      if (i >= niceTimes.length - 1) {
        // it's the last one and not picked up so...
        accumulatedDays.push(dayObj.weekday)
        prevTime = dayObj.time
        const weekday = scrunchDays(accumulatedDays)
        condensedTimes.push({ weekday, time: prevTime })
      }
      accumulatedDays.push(dayObj.weekday)
      prevTime = dayObj.time
    })
    const nicerTimes = condensedTimes.map(dayObj => {
      if (dayObj.weekday === 'Mon - Sun') {
        return { weekday: 'Everyday', time: dayObj.time }
      }
      if (dayObj.weekday === 'Mon - Fri') {
        return { weekday: 'Weekdays', time: dayObj.time }
      }
      if (dayObj.weekday === 'Sat & Sun') {
        return { weekday: 'Weekends', time: dayObj.time }
      }
      return dayObj
    })
    return nicerTimes
  }
}

// Object Helper Functions
/*
  objectFunctions.keys.next(someObj, 4)
  objectFunctions.keys.prev(someObj, 11)

*/
const objectFunctions = {}
objectFunctions.keys = {}

// get the next key in an object
objectFunctions.keys.next = function (myObject, id) {
  const stringId = id.toString()
  let keys = Object.keys(myObject)
  let index = keys.indexOf(stringId)
  let nextIndex = (index += 1)
  if (nextIndex >= keys.length) {
    // we're at the end, so return the first item
    return Object.keys(myObject)[0]
  }
  return keys[nextIndex]
}

// Get the prev key in an object.
objectFunctions.keys.prev = function (myObject, id) {
  const stringId = id.toString()
  let keys = Object.keys(myObject)
  let index = keys.indexOf(stringId)
  let prevIndex = (index -= 1)
  if (prevIndex < 0) {
    // we're at the beginning, so send the last:
    return Object.keys(myObject)[Object.keys(myObject).length - 1]
  }
  return keys[prevIndex]
}

export { objectFunctions }

/**
 * getMapCoordsByViewport returns a revised mapCenter (lat, lng, zoom)
 * taking into account the drawer (if any), sidebar, and viewport
 *
 * @export
 * @param {object} region
 * @param {object} size: browser width and height
 * @returns { { lat, lng, zoom } } mapCenter
 */
export function getMapCoordsByViewport (region, size) {
  const { width, height } = size
  let drawer
  if (width >= DRAWER.sm.starts && width <= DRAWER.sm.ends) {
    drawer = DRAWER.sm
  } else if (width >= DRAWER.md.starts && width <= DRAWER.md.ends) {
    drawer = DRAWER.md
  } else {
    drawer = DRAWER.lg
  }

  // figure out the drawer ratio:
  const drawerWidthRatio = 1 - (width - drawer.width) / width
  const drawerHeightRatio = 1 - (height - drawer.height) / height

  // get the total latitude and longitude width and height:
  const totalLat = region.bounds.north - region.bounds.south
  const totalLng = region.bounds.east - region.bounds.west

  const north = region.bounds.north + PAD_DEGREES
  const south =
    region.bounds.south - totalLat * (drawerHeightRatio * 2) - PAD_DEGREES
  const west =
    region.bounds.west - totalLng * (drawerWidthRatio * 2) - PAD_DEGREES
  const east = region.bounds.east + PAD_DEGREES

  const bounds = {
    ne: { lat: north, lng: east },
    nw: { lat: north, lng: west },
    se: { lat: south, lng: east },
    sw: { lat: south, lng: west }
  }
  const marginBounds = bounds

  const fitted = fitBounds(bounds, size)
  // UPDATE THIS WITH FULL MAINMAP REDUX SUPPORT
  // = { bounds, center, marginBounds, size: {width, height}, zoom }
  return {bounds, center: fitted.center, marginBounds, size, zoom: fitted.zoom}
}
