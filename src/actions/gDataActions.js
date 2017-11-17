/* global google */
import constants from '../actions/types'
import { fetchTimeout } from '../config'
// let fetchNum = 1

let fetchTimeoutMs = fetchTimeout * 1000 * 60

const googlePlaces = new google.maps.places.PlacesService(
  document.createElement('div')
)

export function fetchGooglePlacesVenueDetail ({ _id, googlePlacesData, gpId }) {
  // check the fetchedTime and don't refetch if fewer than fetchTimeout:
  if (
    !googlePlacesData ||
    !googlePlacesData.fetchedTime ||
    new Date(googlePlacesData.fetchedTime.getTime() + fetchTimeoutMs) <
      new Date()
  ) {
    return dispatch => {
      // console.log('fetchGooglePlacesVenueDetail:', fetchNum++)
      googlePlaces.getDetails({ placeId: gpId }, (place, status) => {
        if (status === 'OK') {
          return dispatch(setGooglePlacesVenueDetail(_id, place))
        }
        // TODO: this needs to return a DISPATCH to an API error.
        // See: udemy-advanced-redux-auth/client/src/actions/index.js
        throw new Error(`Error thrown: ${status}`)
      })
    }
  }
  return dispatch => dispatch(cancelFetchGooglePlacesVenueDetail())
}

export function cancelFetchGooglePlacesVenueDetail () {
  return {
    type: constants.VENUE_FETCH_GOOGLE_PLACES_DETAIL_CANCEL,
    payload: 'already have the data'
  }
}

function setGooglePlacesVenueDetail (_id, place) {
  return {
    type: constants.VENUE_FETCH_GOOGLE_PLACES_DETAIL,
    _id: _id,
    payload: { ...place, fetchedTime: new Date() }
  }
}

export function fetchGooglePlacesEditVenueDetail (gpId, callback1, callback2) {
  return dispatch => {
    googlePlaces.getDetails({ placeId: gpId }, (place, status) => {
      if (status === 'OK') {
        // I shouldn't have intl phone number here... but
        if (callback1 && place.international_phone_number) {
          callback1(place, callback2)
        }
        return dispatch(fetchGooglePlacesEditVenuePhotos(place))
      }
      // TODO: this needs to return a DISPATCH to an API error.
      // See: udemy-advanced-redux-auth/client/src/actions/index.js
      throw new Error(`Error thrown: ${status}`)
    })
  }
}

function fetchGooglePlacesEditVenuePhotos (place) {
  if (place.photos) {
    place.images = {}
    place.images.full = place.photos.map(photo => ({
      url: photo.getUrl({ maxWidth: photo.width, maxHeight: photo.height }),
      width: photo.width,
      height: photo.height
    }))
    place.images.thumb = place.photos.map(photo => ({
      url: photo.getUrl({ maxWidth: 320, maxHeight: 320 }),
      width: 320,
      height: 320
    }))
    place.images.large = place.photos.map(photo => ({
      url: photo.getUrl({ maxWidth: 800, maxHeight: 800 }),
      width: 800,
      height: 800
    }))
  }
  return dispatch => {
    return dispatch(setGooglePlacesEditVenueDetail(place))
  }
}

function setGooglePlacesEditVenueDetail (place) {
  return {
    type: constants.EDIT_VENUE_FETCH_GOOGLE_PLACES_DETAIL,
    payload: { ...place }
  }
}