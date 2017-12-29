import axios from 'axios'

import constants from '../actions/types'
import { extrapolateDrinks, extrapolateTimes } from '../lib/myHelpers'
import { days } from '../lib/enumerables'
import { ROOT_URL } from '../config'
import { apiError } from './index'

export function fetchVenues (calcRegionsMeta) {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/venues`).then(response => {
      // add the minimal fetched level:
      const venues = response.data.map(venue => {
        venue.fetchedLevel = 'minimal'
        return venue
      })
      // calling calcRegionsMeta
      calcRegionsMeta(venues)
      dispatch({
        type: constants.VENUES_FETCH,
        payload: venues
      })
    })
  }
}
export function fetchVenueDetail (
  id,
  detailLevel = 'full',
  fetchGooglePlacesVenueDetail
) {
  return dispatch => {
    axios
      .get(`${ROOT_URL}/api/v1/venues/${id}?detailLevel=${detailLevel}`)
      .then(response => {
        response.data.fetchedLevel = detailLevel
        if (fetchGooglePlacesVenueDetail) {
          fetchGooglePlacesVenueDetail(response.data)
        }
        dispatch({
          type: constants.VENUE_FETCH_DETAIL,
          payload: makeFilterReady(response.data)
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

const makeFilterReady = venue => {
  venue.normalizedDrinks = extrapolateDrinks(venue.funItems)
  venue.normalizedTimes = extrapolateTimes(venue.funTimes, days)
  return venue
}
