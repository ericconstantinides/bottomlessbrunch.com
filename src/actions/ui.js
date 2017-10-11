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
  if (location && history && parsePath(history.location.pathname)[0] !== 'admin') {
    history.push(location)
  }
  return {
    type: constants.UI_SET_REGION,
    payload: regionId
  }
}

export function unsetUiRegion () {
  return {
    type: constants.UI_UNSET_REGION,
    payload: null
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
