import constants from '../actions/types'
import { parsePath } from '../lib/myHelpers'

export function fetchUiRegion (regions, history) {
  const parsedHistory = parsePath(history.location.pathname)
  // first check if the region is in the path and set it
  if (parsedHistory[0]) {
    const pickedPathRegion = regions.filter(
      region => region.slug === parsedHistory[0]
    )
    if (pickedPathRegion.length) {
      return setUiRegion(pickedPathRegion[0]._id)
    }
  }
  // second see if region is in local storage and set it:
  const pickedStorageRegionId = window.localStorage.getItem('regionId')
  const pickedStorageRegion = regions.filter(
    region => region._id === pickedStorageRegionId
  )
  if (pickedStorageRegion.length) {
    return setUiRegion(
      pickedStorageRegionId,
      pickedStorageRegion[0].slug,
      history
    )
  }
  // none of this exists, so we show an intro page:
  return unsetUiRegion()
}

export function setUiRegion (regionId, location, history) {
  window.localStorage.setItem('regionId', regionId)
  if (
    location &&
    history &&
    parsePath(history.location.pathname)[0] !== 'admin'
  ) {
    history.push('/' + location)
  }
  return {
    type: constants.UI_SET_REGION,
    payload: regionId
  }
}

export function unsetUiRegion () {
  window.localStorage.removeItem('regionId')
  return {
    type: constants.UI_UNSET_REGION,
    payload: null
  }
}

export function setUiVenue (venueId) {
  return {
    type: constants.UI_SET_VENUE,
    payload: venueId
  }
}

export function unsetUiVenue () {
  return {
    type: constants.UI_UNSET_VENUE,
    payload: null
  }
}

export function setUiBrowserSize () {
  return {
    type: constants.UI_SET_BROWSER_SIZE,
    payload: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
}

export function hoverVenueUi (venue) {
  if (venue) {
    return {
      type: constants.UI_VENUE_HOVER_ON,
      payload: { venue }
    }
  }
  return {
    type: constants.UI_VENUE_HOVER_OFF,
    payload: null
  }
}
