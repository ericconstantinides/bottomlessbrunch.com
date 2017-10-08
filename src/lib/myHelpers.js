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
        const { days, startTime, endTime } = fun
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
  if (gData && gData.opening_hours && gData.opening_hours.weekday_text) {
    const niceTimes = gData.opening_hours.weekday_text.map((day, i) => {
      // split string up at the `colon space`
      const [weekday, rest] = day.split(': ')
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
        const weekday = accumulatedDays.join(', ')
        condensedTimes.push({weekday, time: prevTime})
        accumulatedDays = []
      }
      if (i >= (niceTimes.length - 1)) {
        // it's the last one and not picked up so...
        accumulatedDays.push(dayObj.weekday)
        prevTime = dayObj.time
        const weekday = accumulatedDays.join(', ')
        condensedTimes.push({weekday, time: prevTime})
      }
      accumulatedDays.push(dayObj.weekday)
      prevTime = dayObj.time
    })
    const nicerTimes = condensedTimes.map(dayObj => {
      if (dayObj.weekday === 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday') {
        return {weekday: 'Everyday', time: dayObj.time}
      }
      if (dayObj.weekday === 'Monday, Tuesday, Wednesday, Thursday, Friday') {
        return {weekday: 'Weekdays', time: dayObj.time}
      }
      if (dayObj.weekday === 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday') {
        return {weekday: 'Monday - Saturday', time: dayObj.time}
      }
      if (dayObj.weekday === 'Monday, Tuesday, Wednesday, Thursday') {
        return {weekday: 'Monday - Thursday', time: dayObj.time}
      }
      if (dayObj.weekday === 'Tuesday, Wednesday, Thursday, Friday') {
        return {weekday: 'Tuesday - Friday', time: dayObj.time}
      }
      if (dayObj.weekday === 'Wednesday, Thursday, Friday, Saturday') {
        return {weekday: 'Wednesday - Saturday', time: dayObj.time}
      }
      if (dayObj.weekday === 'Monday, Tuesday, Wednesday') {
        return {weekday: 'Monday - Wednesday', time: dayObj.time}
      }
      if (dayObj.weekday === 'Tuesday, Wednesday, Thursday') {
        return {weekday: 'Tuesday - Thursday', time: dayObj.time}
      }
      if (dayObj.weekday === 'Thursday, Friday, Saturday') {
        return {weekday: 'Thursday - Saturday', time: dayObj.time}
      }
      if (dayObj.weekday === 'Saturday, Sunday') {
        return {weekday: 'Weekends', time: dayObj.time}
      }
      if (dayObj.weekday === 'Friday, Saturday') {
        return {weekday: 'Friday & Saturday', time: dayObj.time}
      }
      if (dayObj.weekday === 'Thursday, Friday') {
        return {weekday: 'Thursday & Friday', time: dayObj.time}
      }
      if (dayObj.weekday === 'Tuesday, Wednesday') {
        return {weekday: 'Tuesday & Wednesday', time: dayObj.time}
      }
      if (dayObj.weekday === 'Monday, Tuesday') {
        return {weekday: 'Monday & Tuesday', time: dayObj.time}
      }
      if (dayObj.weekday === 'Wednesday, Thursday') {
        return {weekday: 'Wednesday & Thursday', time: dayObj.time}
      }
      return dayObj
    })
    return nicerTimes
  }
}
