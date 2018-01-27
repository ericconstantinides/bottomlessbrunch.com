import axios from 'axios'

import constants from '../actions/types'
import { stripDashesSpaces } from '../lib/myHelpers'

import { ROOT_URL } from '../config'

/**
 * Fetches Yelp's data based on the venue's phone number
 *
 * @export {function}
 * @param {object} place
 * @param {function} fetchYelpMetaEditVenueDetail callback
 * @returns {Promise}
 */
export const fetchYelpPhoneSearchEditVenueDetail = phone => dispatch =>
  new Promise((resolve, reject) => {
    const formattedPhone = encodeURI(stripDashesSpaces(phone))
    axios
      .get(`${ROOT_URL}/api/v1/methods/yelpPhoneSearch?phone=${formattedPhone}`)
      .then(results => {
        if (results.data) {
          // return the promise to fetchYelpMetaEditVenueDetail()
          resolve(results.data[0].id)
          dispatch({
            type: constants.EDIT_VENUE_FETCH_YELP_PHONE_SEARCH_DETAIL,
            payload: results.data[0]
          })
        }
        reject(new Error())
      })
  })

export function fetchYelpMetaEditVenueDetail (yId) {
  return dispatch => {
    axios
      .get(`${ROOT_URL}/api/v1/methods/yelpMetaSearch?id=${yId}`)
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
