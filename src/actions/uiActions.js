import constants from '../actions/types'
import { getDrawerSize } from '../lib/myHelpers'

export function activateUiSite () {
  return {
    type: constants.UI_ACTIVATE_SITE,
    payload: true
  }
}

export function setDrawer () {
  const { innerWidth: brwsrWidth, innerHeight: brwsrHeight } = window
  return {
    type: constants.UI_SET_DRAWER,
    payload: {
      ...getDrawerSize(brwsrWidth, brwsrHeight),
      brwsrWidth,
      brwsrHeight
    }
  }
}

export function setUiActiveRegion (regionId) {
  return {
    type: constants.UI_SET_ACTIVE_REGION,
    payload: regionId
  }
}

export function setUiVenueSliderPosition (_id, visVenues, venues, history) {
  let pointer
  visVenues.forEach((venue, i) => {
    if (venue._id === _id) {
      pointer = i
    }
  })
  if (history) {
    history.push('/' + venues[_id].slug)
  }
  return {
    type: constants.UI_SET_VENUE_SLIDER_POINTER,
    _id,
    payload: pointer
  }
}

export function unsetUiVenueSliderPosition () {
  return {
    type: constants.UI_UNSET_VENUE_SLIDER_POINTER,
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

export function showUiResetRegion () {
  return {
    type: constants.UI_CHANGE_RESET_REGION_BUTTON,
    payload: true
  }
}

export function hideUiResetRegion () {
  return {
    type: constants.UI_CHANGE_RESET_REGION_BUTTON,
    payload: false
  }
}
