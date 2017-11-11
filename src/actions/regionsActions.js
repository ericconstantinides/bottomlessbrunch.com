import axios from 'axios'
import _ from 'lodash'

import constants from '../actions/types'
import { ROOT_URL } from '../config'
import { apiError } from './index'

export function fetchRegions (history, fetchUiRegion) {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/regions`).then(response => {
      const regions = response.data
      // calling fetchUiRegion:
      fetchUiRegion(regions, history)
      dispatch({
        type: constants.REGIONS_FETCH,
        payload: regions
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

export function calcRegionsMeta (venues) {
  // now I need to add how many venues per region:
  let regionsObject = {}
  _.map(venues, venue => {
    if (!regionsObject[venue.regionId]) {
      regionsObject[venue.regionId] = {
        venuesAvailable: 1,
        bounds: {
          north: (venue.lat),
          south: (venue.lat),
          east: (venue.lng),
          west: (venue.lng)
        }
      }
    } else {
      const region = regionsObject[venue.regionId]
      region.venuesAvailable = ++region.venuesAvailable
      if (venue.lat > region.bounds.north) {
        region.bounds.north = venue.lat
      } else if (venue.lat < region.bounds.south) {
        region.bounds.south = venue.lat
      }
      if (venue.lng > region.bounds.east) {
        region.bounds.east = venue.lng
      } else if (venue.lng < region.bounds.west) {
        region.bounds.west = venue.lng
      }
    }
  })
  return {
    type: constants.REGIONS_CALC_META,
    payload: regionsObject
  }
}
