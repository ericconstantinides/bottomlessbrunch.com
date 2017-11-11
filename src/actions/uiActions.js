import constants from '../actions/types'
import { parsePath, reduceVenuesByRegion } from '../lib/myHelpers'

export function fetchUiRegion (regionsArray, history) {
  const parsedHistory = parsePath(history.location.pathname)
  // first check if the region is in the path and set it
  if (parsedHistory[0]) {
    const pickedPathRegion = regionsArray.filter(
      region => region.slug === parsedHistory[0]
    )
    if (pickedPathRegion.length) {
      return setUiRegion(pickedPathRegion[0])
    }
  }
  // second see if region is in local storage and set it:
  const pickedStorageRegionId = window.localStorage.getItem('regionId')
  const pickedStorageRegion = regionsArray.filter(
    region => region._id === pickedStorageRegionId
  )
  if (pickedStorageRegion.length) {
    return setUiRegion(
      pickedStorageRegion[0],
      history
    )
  }
  // none of this exists, so we show an intro page:
  return unsetUiRegion()
}

export function setUiRegion (region, history) {
  window.localStorage.setItem('regionId', region._id)
  if (
    history &&
    parsePath(history.location.pathname)[0] !== 'admin'
  ) {
    history.push('/' + region.slug)
  }
  return {
    type: constants.UI_SET_REGION,
    payload: region
  }
}

export function unsetUiRegion () {
  window.localStorage.removeItem('regionId')
  return {
    type: constants.UI_UNSET_REGION,
    payload: null
  }
}

export function setUiVenue (openId, prevId, nextId) {
  return {
    type: constants.UI_SET_VENUE,
    payload: {
      openId, prevId, nextId
    }
  }
}

export function unsetUiVenue () {
  return {
    type: constants.UI_UNSET_VENUE,
    payload: null
  }
}

export function setUiRegionVenues (venues, region) {
  // get the reduced venues
  const reducedVenues = reduceVenuesByRegion(venues, region._id)
  return {
    type: constants.UI_SET_REGION_VENUES,
    payload: reducedVenues
  }
}

export function unsetUiRegionVenues () {
  return {
    type: constants.UI_UNSET_REGION_VENUES,
    payload: null
  }
}

export function showUiRegionsModal () {
  return { type: constants.UI_SHOW_REGIONS_MODAL }
}

export function hideUiRegionsModal () {
  return { type: constants.UI_HIDE_REGIONS_MODAL }
}

export function setUiAppClass (classes) {
  return {
    type: constants.UI_SET_APP_CLASS,
    payload: classes
  }
}

export function addUiAppClass (classes) {
  return {
    type: constants.UI_ADD_TO_APP_CLASS,
    payload: classes
  }
}

export function removeUiAppClass (classes) {
  return {
    type: constants.UI_REMOVE_FROM_APP_CLASS,
    payload: classes
  }
}
