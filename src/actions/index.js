/* global google */
import axios from 'axios'
import slugify from '../lib/Slug'
import constants from '../actions/types'
import { stripDashesSpaces } from '../lib/myHelpers'
import {
  fetchTimeout,
  ROOT_URL
} from '../config'

let fetchTimeoutMs = fetchTimeout * 1000 * 60

const googlePlaces = new google.maps.places.PlacesService(
  document.createElement('div')
)

export function fetchRegions () {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/regions`).then(response => {
      const regionsWithSlug = response.data.map(region => {
        region.slug = slugify(region.name)
        return region
      })
      dispatch({
        type: constants.REGIONS_FETCH,
        payload: regionsWithSlug
      })
    })
  }
}

export function addRegion (values, history) {
  return function (dispatch) {
    axios
      .post(`${ROOT_URL}/api/v1/regions`, values)
      .then(response => {
        dispatch({
          type: constants.REGION_ADD,
          payload: response.data
        })
        history.push('/admin/regions')
      })
      // TODO: fix error stuff. It doesn't work:
      .catch(error => dispatch(apiError(error.response.data.error)))
  }
}

export function editRegion (id, values, history) {
  return function (dispatch) {
    axios
      .put(`${ROOT_URL}/api/v1/regions/${id}`, values)
      .then(response => {
        dispatch({
          type: constants.REGION_EDIT,
          payload: response.data
        })
        history.push('/admin/regions')
      })
      // TODO: fix error stuff. It doesn't work:
      .catch(error => dispatch(apiError(error.response.data.error)))
  }
}

export function deleteRegion (region, history) {
  return function (dispatch) {
    axios
      .delete(`${ROOT_URL}/api/v1/regions/${region}`)
      .then(response => {
        dispatch({
          type: constants.REGION_DELETE,
          payload: region
        })
        history.push('/admin/regions')
      })
      // TODO: fix error stuff. It doesn't work:
      .catch(error => dispatch(apiError(error.response.data.error)))
  }
}

export function fetchVenues () {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/venues`).then(response => {
      const venuesWithSlug = response.data.map(venue => {
        venue.slug = slugify(venue.name) + '-' + slugify(venue.neighborhood)
        return venue
      })
      dispatch({
        type: constants.VENUES_FETCH,
        payload: venuesWithSlug
      })
    })
  }
}

export function addVenue (values, history) {
  return function (dispatch) {
    axios
      .post(`${ROOT_URL}/api/v1/venues`, values)
      .then(response => {
        dispatch({
          type: constants.VENUE_ADD,
          payload: response.data
        })
        history.push('/admin/venues')
      })
      // TODO: fix error stuff. It doesn't work:
      .catch(error => dispatch(apiError(error.response.data.error)))
  }
}

export function editVenue (id, values, history) {
  return function (dispatch) {
    axios
      .put(`${ROOT_URL}/api/v1/venues/${id}`, values)
      .then(response => {
        dispatch({
          type: constants.VENUE_EDIT,
          payload: response.data
        })
        history.push('/admin/venues')
      })
      // TODO: fix error stuff. It doesn't work:
      .catch(error => dispatch(apiError(error.response.data.error)))
  }
}

export function deleteVenue (venueId, history) {
  return function (dispatch) {
    axios
      .delete(`${ROOT_URL}/api/v1/venues/${venueId}`)
      .then(response => {
        dispatch({
          type: constants.VENUE_DELETE,
          payload: venueId
        })
        history.push('/admin/venues')
      })
      // TODO: fix error stuff. It doesn't work:
      .catch(error => dispatch(apiError(error.response.data.error)))
  }
}

// TODO: THIS DOESN'T WORK EITHER
export function apiError (error) {
  return {
    type: constants.API_ERROR,
    payload: error
  }
}

export function fetchGooglePlacesVenueDetail ({ _id, googePlacesData, gpId }) {
  // check the fetchedTime and don't refetch if fewer than fetchTimeout:
  if (
    !googePlacesData ||
    !googePlacesData.fetchedTime ||
    new Date(googePlacesData.fetchedTime.getTime() + fetchTimeoutMs) <
      new Date()
  ) {
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
        if (callback1) {
          callback1(place, callback2)
        }
        return dispatch(setGooglePlacesEditVenueDetail(place))
      }
      // TODO: this needs to return a DISPATCH to an API error.
      // See: udemy-advanced-redux-auth/client/src/actions/index.js
      throw new Error(`Error thrown: ${status}`)
    })
  }
}

function setGooglePlacesEditVenueDetail (place) {
  return {
    type: constants.EDIT_VENUE_FETCH_GOOGLE_PLACES_DETAIL,
    payload: { ...place }
  }
}

export function fetchYelpPhoneSearchEditVenueDetail (place, callback) {
  const phone = encodeURI(stripDashesSpaces(place.international_phone_number))
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/methods/yelpPhoneSearch?phone=${phone}`)
      .then(results => {
        if (results.data) {
          if (callback) {
            callback(results.data[0].id)
          }
          dispatch({
            type: constants.EDIT_VENUE_FETCH_YELP_PHONE_SEARCH_DETAIL,
            payload: results.data[0]
          })
        }
      })
  }
}

export function fetchYelpMetaEditVenueDetail (id) {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/methods/yelpMetaSearch?id=${id}`)
      .then(results => {
        if (results.data) {
          dispatch({
            type: constants.EDIT_VENUE_FETCH_YELP_META_DETAIL,
            payload: results.data
          })
        }
      })
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
