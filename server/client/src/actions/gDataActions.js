/* global google */
import constants from '../actions/types'
// import { fetchTimeout } from '../config'
// let fetchNum = 1

// let fetchTimeoutMs = fetchTimeout * 1000 * 60

const googlePlaces = new google.maps.places.PlacesService(
  document.createElement('div')
)

export function fetchGooglePlacesVenueDetail (venue) {
  // const { _id, googlePlacesData, gpId } = venue
  const { _id, gpId } = venue
  // check the fetchedTime and don't refetch if fewer than fetchTimeout:
  // if (
  //   !googlePlacesData ||
  //   !googlePlacesData.fetchedTime ||
  //   new Date(googlePlacesData.fetchedTime.getTime() + fetchTimeoutMs) <
  //     new Date()
  // ) {
  return dispatch => {
    googlePlaces.getDetails({ placeId: gpId }, (place, status) => {
      if (status === 'OK') {
        return dispatch(setGooglePlacesVenueDetail(_id, place))
      }
      // TODO: this needs to return a DISPATCH to an API error.
      // See: udemy-advanced-redux-auth/client/src/actions/index.js
      throw new Error(`Error thrown: ${status}`)
    })
  }
  // }
  // return dispatch => dispatch(cancelFetchGooglePlacesVenueDetail())
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
    payload: { _id, googlePlacesData: place, fetchedTime: new Date() }
  }
}

/**
 * Fetch Google Places Venue Details
 * https://medium.com/collaborne-engineering/returning-promises-from-redux-action-creators-3035f34fa74b
 *
 * @export
 * @param {string} gpId
 * @param {function} fetchYelpPhoneSearchEditVenueDetail callback
 * @param {function} fetchYelpMetaEditVenueDetail callback
 * @returns {Promise}
 */
export const fetchGooglePlacesEditVenueDetail = gpId => dispatch =>
  new Promise((resolve, reject) => {
    googlePlaces.getDetails({ placeId: gpId }, (place, status) => {
      if (status === 'OK') {
        if (place.international_phone_number) {
          resolve(place.international_phone_number)
        }
        return dispatch(fetchGooglePlacesEditVenuePhotos(place))
      }
      reject(new Error())
    })
  })

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
