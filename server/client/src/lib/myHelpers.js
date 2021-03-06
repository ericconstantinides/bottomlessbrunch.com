import { fitBounds } from 'google-map-react/utils'
import { DRAWER } from '../config'
import { drinkIncludes, days } from '../lib/enumerables'
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
 * getViewportOffset returns a revised mapCenter (lat, lng, zoom)
 * taking into account the drawer (if any), sidebar, and viewport
 *
 * @export
 * @param {object} region
 * @param {object} size: browser width and height
 * @returns { { lat, lng, zoom } } mapCenter
 */
export function getViewportOffset (bounds, drawer) {
  const { brwsrWidth, brwsrHeight } = drawer

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
  pBounds.ne = { lat: bounds.ne.lat + pad, lng: bounds.ne.lng + pad }
  pBounds.nw = { lat: bounds.nw.lat + pad, lng: bounds.nw.lng - pad }
  pBounds.se = { lat: bounds.se.lat - pad, lng: bounds.se.lng + pad }
  pBounds.sw = { lat: bounds.sw.lat - pad, lng: bounds.sw.lng - pad }

  const fitted = fitBounds(pBounds, size)

  const returnCenter = {
    lat: fitted.center.lat - fudgeLat,
    lng: fitted.center.lng - fudgeLng
  }
  return { center: returnCenter, zoom: fitted.zoom }
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
  return Math.abs(numberA - numberB) <= difference
}

/**
 * Extrapolates out each drink within the drinks Object
 *
 * @param {array} drinks
 * @returns {array}
 */
export const extrapolateDrinks = drinks => {
  if (!drinks || !drinks.length) return
  const output = []
  drinks.forEach(drinkItem => {
    if (!drinkItem.drink || !drinkItem.drink.length) return
    drinkItem.drink.forEach(drink => {
      const newDrink = {
        drink,
        includes: drinkItem.includes,
        price: drinkItem.price
      }
      if (drinkItem.remarks) {
        newDrink.remarks = drinkItem.remarks
      }
      output.push(newDrink)
    })
  })
  return output
}
/**
 * Extrapolates the included titles into separate objects
 *
 * @param {array} drinkIncludes
 * @param {array} cleansedDrinks
 * @returns {array} of drinks separated by the drinkIncludes title
 */
export const extrapolateIncludes = cleansedDrinks => {
  const output = []
  drinkIncludes.forEach(title => {
    const items = cleansedDrinks.filter(drink => drink.includes === title)
    if (items.length) {
      const fixedTitle = title
        .replace('Drink', 'Drinks')
        .replace(' Only', '')
        .replace('Full Course Meal', 'Prix Fixe')
      output.push({
        title: 'Bottomless ' + fixedTitle,
        items
      })
    }
  })
  return output
}
const makeAsterisks = asterisksLength => {
  let output = ''
  for (let i = 0; i < asterisksLength; i++) {
    output += '*'
  }
  return output
}
export const extrapolateAsterisks = drinks => {
  let items = []
  let asterisks = []
  // go through each meta type:
  drinkIncludes.forEach(incTitle => {
    const thisMetaItems = drinks.filter(drink => drink.includes === incTitle)
    if (thisMetaItems.length) {
      if (incTitle === 'Drink Only') {
        items = [ ...thisMetaItems, ...items ]
        return
      }
      const asterisk = makeAsterisks(asterisks.length + 1)
      asterisks.push({
        asterisk,
        title: incTitle
      })
      const newItems = thisMetaItems.map(item => ({
        ...item,
        asterisk
      }))
      items = [ ...items, ...newItems ]
    }
  })
  return { items, asterisks }
}
/**
 * Extrapolates the date and times into flatter data
 *
 * @param {array} times
 * @param {array} cleansedDrinks
 * @returns {array} of drinks separated by the drinkIncludes title
 */
export const extrapolateTimes = (times, daysEnm, cat = 'Bottomless Brunch') => {
  if (!times) return
  let output = []
  times.forEach(timeItem => {
    timeItem.days.forEach(day => {
      if (timeItem.category !== cat) return
      output.push({
        category: timeItem.category,
        day: stringDayToNum(day, daysEnm),
        startTime: stringTimeToNumber(timeItem.startTime),
        endTime: stringTimeToNumber(timeItem.endTime)
      })
    })
  })
  return output
}

export const simplifyIncludes = drinks => {
  if (!drinks || !drinks.length) return
  return drinks.map(drink => (
    {...drink, priceIncludesFood: drink.includes !== 'Drink Only'}
  ))
}

export const makeTimeMarks = (start, end) => {
  const hours = {}
  for (let i = start; i <= end; i++) {
    hours[i] = numTimeToString(i, true)
  }
  return hours
}

export const makePriceMarks = (start, end, increment = 10) => {
  const prices = {}
  for (let i = start; i <= end; i += increment) {
    prices[i] = '$' + i
  }
  return prices
}

/**
 * Coverts a time string like "8:30PM" to a float like 20.5
 *
 * @export function
 * @param {string} str
 * @returns {float}
 */
export const stringTimeToNumber = str => {
  const decimalToAdd = str.includes(':30') ? 0.5 : 0
  const milTimeToAdd = str.includes('12:') && str.includes('AM')
    ? -12
    : (str.includes('12:') && str.includes('PM')) || str.includes('AM') ? 0 : 12
  const strippedTime = str.replace(':00', '').replace(':30', '')
  const intTime = parseInt(strippedTime, 10)
  return intTime + decimalToAdd + milTimeToAdd
}
/**
 * Coverts a number time like 20.5 to a string like "8:30PM"
 *
 * @export function
 * @param {float} num
 * @param {boolean} short
 * @returns {string}
 */
export const numTimeToString = (num, short = false) => {
  const colonPlus = num % 1 !== 0 ? ':30' : short ? '' : ':00'
  const fNum = Math.floor(num)
  const nonMilTime = fNum === 0 ? 12 + fNum : fNum > 12 ? fNum - 12 : fNum
  const amOrPm = num < 12 ? 'AM' : 'PM'
  return nonMilTime + colonPlus + amOrPm
}

/**
 * Coverts a day string like "Saturday" to string like 6
 *
 * @export function
 * @param {string} day
 * @param {array} array of days
 * @returns {integer}
 */
export const stringDayToNum = (day, allDays) => {
  const smallDays = allDays.map(aDay => aDay.substring(0, 2).toLowerCase())
  const thisSmallDay = day.substring(0, 2).toLowerCase()
  return smallDays.indexOf(thisSmallDay)
}

/**
 * Coverts a day number like 6 to a string like "Saturday"
 *
 * @export function
 * @param {integer} number
 * @param {array} array of days
 * @param {length} - optional - length of day string
 * @returns {string} day
 */
export const numDayToStr = (num, allDays, length) => {
  if (length === undefined) return allDays[num]
  return allDays[num].substring(0, length)
}

/**
 * Make an array of labels into an object of checkbox-ready items
 *
 * @export function
 * @param {array} arr
 * @returns {object}
 */
export const toCheckboxObj = arr => {
  const checkboxObj = {}
  arr.forEach(item => {
    checkboxObj[item] = {
      label: item,
      disabled: true
    }
  })
  return checkboxObj
}

export const makeDayMarks = (days, length) => {
  const output = {}
  days.forEach((day, i) => {
    output[i] = day.substring(0, length)
  })
  return output
}

export const makeFilterReady = (venue, callback) => {
  if (!venue.normalizedDrinks) {
    venue.normalizedDrinks = simplifyIncludes(extrapolateDrinks(venue.funItems))
  }
  if (!venue.normalizedTimes) {
    venue.normalizedTimes = extrapolateTimes(venue.funTimes, days)
  }
  if (callback) {
    callback(venue)
  }
  return venue
}

export const checkFiltered = (visVenuesArr, _id) => {
  return visVenuesArr.some(venue => (venue._id === _id && venue.filtered))
}

export const timeWithin = (a, b, rangeLow, rangeHi) => {
  return rangeLow >= b || rangeHi <= a
}

export const dayWithin = (day, dayLow, dayHi) => {
  return dayLow > day || dayHi < day
}

export const priceWithin = (price, priceLow, priceHi) => {
  return priceLow > price || priceHi < price
}

export const drinkWithin = (drink, drinkFilters) => {
  return !drinkFilters[drink].checked
}
