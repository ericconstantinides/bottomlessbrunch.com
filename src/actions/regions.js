import axios from 'axios'

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
