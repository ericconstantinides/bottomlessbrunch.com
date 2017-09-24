/* global google */
import slugify from '../lib/Slug'
import constants from '../actions/types'
import venues from '../content/venues.json'
import regions from '../content/regions.json'
import { fetchTimeout } from '../config'

let fetchTimeoutMs = fetchTimeout * 1000 * 60

const googlePlaces = new google.maps.places.PlacesService(
  document.createElement('div')
)

export function fetchRegions () {
  return {
    type: constants.REGIONS_FETCH,
    payload: { data: regions }
  }
}

export function addRegion () {
  return {
    type: constants.REGION_ADD,
    payload: { data: regions }
  }
}

export function fetchVenues () {
  // let's add the slug here:
  // <place name>-<neighborhood>
  const venuesWithSlug = venues.map(venue => {
    venue.slug = slugify(venue.name) + '-' + slugify(venue.neighborhood)
    return venue
  })
  return {
    type: constants.VENUES_FETCH,
    payload: { data: venuesWithSlug }
  }
}

export function fetchVenueDetail ({ id, googePlacesData, googlePlacesId }) {
  // check the fetchedTime and don't refetch if fewer than fetchTimeout:
  if (
    !googePlacesData ||
    !googePlacesData.fetchedTime ||
    new Date(googePlacesData.fetchedTime.getTime() + fetchTimeoutMs) <
      new Date()
  ) {
    return dispatch => {
      googlePlaces.getDetails({ placeId: googlePlacesId }, (place, status) => {
        if (status === 'OK') {
          return dispatch(setVenueDetail(id, place))
        }
        // TODO: this needs to return a DISPATCH to an API error.
        // See: udemy-advanced-redux-auth/client/src/actions/index.js
        throw new Error(`Error thrown: ${status}`)
      })
    }
  }
  return dispatch => dispatch(cancelFetchVenueDetail())
}

export function cancelFetchVenueDetail () {
  return {
    type: constants.VENUE_FETCH_DETAIL_CANCEL,
    payload: 'already have the data'
  }
}

function setVenueDetail (id, place) {
  return {
    type: constants.VENUE_FETCH_DETAIL,
    id: id,
    payload: { ...place, fetchedTime: new Date() }
  }
}

export function setRegionUi (regionId) {
  return {
    type: constants.UI_SET_REGION,
    payload: { regionId }
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
