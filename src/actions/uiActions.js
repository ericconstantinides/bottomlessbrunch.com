import constants from '../actions/types'
import { reduceVenuesByRegion, movePointer } from '../lib/myHelpers'

export function setUiVenueTBD (openId, prevId, nextId) {
  return {
    type: constants.UI_SET_VENUE,
    payload: {
      openId, prevId, nextId
    }
  }
}

export function setUiVenue (venues, visVenues, currIndex, history) {
  const nextIndex = movePointer(visVenues, currIndex, 'next')
  const prevIndex = movePointer(visVenues, currIndex, 'prev')
  const openId = venues[visVenues[currIndex]]._id
  const prevId = venues[visVenues[prevIndex]]._id
  const nextId = venues[visVenues[nextIndex]]._id
  history.push('/' + venues[visVenues[currIndex]].slug)
  return {
    type: constants.UI_SET_VENUE,
    payload: { openId, prevId, nextId }
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
