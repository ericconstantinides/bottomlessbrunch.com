import { fitBounds } from 'google-map-react/utils'
import { DRAWER } from '../config'
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

export function getRegionByPath (regions, path) {
  const parsedPath = parsePath(path)
  if (parsedPath.length >= 1) {
    const region = _.filter(regions, region => {
      if (parsedPath[0] === region.slug) return region
    })[0]
    if (region) return region
  }
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
 * movePointer loops through an array to find the next or previous index
 *
 * @export
 * @param {Array} arr is the original array
 * @param {Integer} currIndex is current position
 * @param {String} goTo is either 'next' or 'prev'
 * @returns {Integer}
 */
export function movePointer (arr, currIndex, goTo = 'next') {
  const topIndex = arr.length - 1
  if (goTo === 'next') {
    if (currIndex >= topIndex) {
      return 0
    }
    return currIndex + 1
  }
  // previous:
  if (currIndex <= 0) {
    return topIndex
  }
  return currIndex - 1
}

export function getDrawerSize (brwsrWidth, brwsrHeight) {
  let drawer
  if (brwsrWidth >= DRAWER.sm.bp_starts && brwsrWidth <= DRAWER.sm.bp_ends) {
    drawer = DRAWER.sm
  } else if (
    brwsrWidth >= DRAWER.md.bp_starts &&
    brwsrWidth <= DRAWER.md.bp_ends
  ) {
    drawer = DRAWER.md
  } else {
    drawer = DRAWER.lg
  }
  return drawer
}

/**
 * getRegionCoordsByViewport returns a revised mapCenter (lat, lng, zoom)
 * taking into account the drawer (if any), sidebar, and viewport
 *
 * @export
 * @param {object} region
 * @param {object} size: browser width and height
 * @returns { { lat, lng, zoom } } mapCenter
 */
export function getViewportOffset (bounds, browserSize, drawer) {
  const { width: brwsrWidth, height: brwsrHeight } = browserSize

  // figure out the visible hole you're putting the area into:
  const visibleWidth = brwsrWidth - drawer.offset_left - drawer.offset_right
  const visibleHeight = brwsrHeight - drawer.offset_top - drawer.offset_bottom

  const size = { width: visibleWidth, height: visibleHeight }
  // I only really care about the fitted.zoom in fitted:

  const fittedPrePadding = fitBounds(bounds, size)

  // fudging starts at zoom 20, so we subtract from 20 to see how much to mult.
  const fudgeMultiplier = 20 - fittedPrePadding.zoom
  let fudgeLat = drawer.fudge_lat_at_zoom_twenty
  let fudgeLng = drawer.fudge_lng_at_zoom_twenty
  let pad = 0.000048828125
  if (fudgeMultiplier > 1) {
    for (let index = 0; index < fudgeMultiplier; index++) {
      fudgeLat = fudgeLat * 2
      fudgeLng = fudgeLng * 2
      pad = pad * 2
    }
  }
  // don't pad zoom <= 10 so that small devices don't get a zoomed out view:
  pad = fittedPrePadding.zoom <= 10 ? 0 : pad
  // now we add some padding and run fitzoom again:

  const pBounds = {}
  pBounds.ne = {lat: bounds.ne.lat + pad, lng: bounds.ne.lng + pad}
  pBounds.nw = {lat: bounds.nw.lat + pad, lng: bounds.nw.lng - pad}
  pBounds.se = {lat: bounds.se.lat - pad, lng: bounds.se.lng + pad}
  pBounds.sw = {lat: bounds.sw.lat - pad, lng: bounds.sw.lng - pad}

  const fitted = fitBounds(pBounds, size)

  const returnCenter = {
    lat: fitted.center.lat - fudgeLat,
    lng: fitted.center.lng - fudgeLng
  }
  return {center: returnCenter, zoom: fitted.zoom}
}

export function getMarginBounds (bounds, browserSize) {
  // console.log({bounds})
  const { width: brwsrWidth, height: brwsrHeight } = browserSize
  const drawer = getDrawerSize(brwsrWidth, brwsrHeight)

  const {
    ne: { lat: north, lng: east },
    sw: { lat: south, lng: west }
  } = bounds

  drawer.width = brwsrWidth - drawer.offset_left - drawer.offset_right
  drawer.height = brwsrHeight - drawer.offset_bottom

  // figure out the drawer ratio:
  drawer.widthRatio = 1 - drawer.width / brwsrWidth
  drawer.heightRatio = 1 - drawer.height / brwsrHeight

  drawer.offset_top_ratio = drawer.offset_top / brwsrHeight
  // get the total latitude and longitude width and height:
  const totalLat = north - south
  const totalLng = east - west

  const marginNorth = north - totalLat * drawer.offset_top_ratio
  const marginSouth = south + totalLat * drawer.heightRatio
  const marginWest = west + totalLng * drawer.widthRatio
  const marginEast = east

  // now we'll create the marginCenter:
  const coords = {}
  coords.marginCenter = {
    lat: marginSouth + (marginNorth - marginSouth) / 2,
    lng: marginEast - (marginEast - marginWest) / 2
  }
  // coords.center = coords.marginCenter

  coords.marginBounds = {
    ne: { lat: marginNorth, lng: marginEast },
    nw: { lat: marginNorth, lng: marginWest },
    se: { lat: marginSouth, lng: marginEast },
    sw: { lat: marginSouth, lng: marginWest }
  }
  return coords
}

export function closeEnough (numberA, numberB, difference = 0.00001) {
  if (Math.abs(numberA - numberB) <= difference) {
    return true
  }
  return false
}
