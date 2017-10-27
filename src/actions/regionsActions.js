import axios from 'axios'
import _ from 'lodash'

import constants from '../actions/types'
import slugify from '../lib/Slug'
import { ROOT_URL } from '../config'
import { apiError } from './index'

export function fetchRegions (history, callback) {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/regions`).then(response => {
      const regionsWithSlug = response.data.map(region => {
        region.slug = slugify(region.name)
        return region
      })
      // calling fetchUiRegion for all intents and purposes:
      if (callback) {
        callback(regionsWithSlug, history)
      }
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

export function calcRegionsBoundsByVenues (venues) {
  let regionsObject = {}
  _.map(venues, venue => {
    if (!regionsObject[venue.regionId]) {
      regionsObject[venue.regionId] = {
        north: venue.lat,
        south: venue.lat,
        east: venue.lng,
        west: venue.lng
      }
    } else {
      const region = regionsObject[venue.regionId]
      if (venue.lat > region.north) {
        region.north = venue.lat
      } else if (venue.lat < region.south) {
        region.south = venue.lat
      }
      if (venue.lng > region.east) {
        region.east = venue.lng
      } else if (venue.lng < region.west) {
        region.west = venue.lng
      }
    }
  })
  return {
    type: constants.REGIONS_CALC_BOUNDS,
    payload: regionsObject
  }
}
