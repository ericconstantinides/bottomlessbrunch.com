import axios from 'axios'

import constants from '../actions/types'
import { slugify } from '../lib/myHelpers'
import { ROOT_URL } from '../config'
import { apiError } from './index'

export function fetchVenues (callback) {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/venues`).then(response => {
      // filter out the unpublished venues and add slugs:
      const venuesWithSlug = response.data
        .filter(venue => !venue.unpublish)
        .map(venue => {
          const nameSlug = slugify(venue.name)
          const neighSlug = venue.neighborhood
            ? '-' + slugify(venue.neighborhood)
            : ''
          venue.slug = nameSlug + neighSlug
          return venue
        })
      // calling calcRegionsBoundsByVenues for all intents and purposes:
      if (callback) {
        callback(venuesWithSlug)
      }
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
