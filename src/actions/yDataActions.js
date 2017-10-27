import axios from 'axios'

import constants from '../actions/types'
import { stripDashesSpaces } from '../lib/myHelpers'

import { ROOT_URL } from '../config'

export function fetchYelpPhoneSearchEditVenueDetail (place, callback) {
  const phone = place.international_phone_number
  if (phone) {
    const formattedPhone = encodeURI(stripDashesSpaces(phone))
    return function (dispatch) {
      axios
        .get(
          `${ROOT_URL}/api/v1/methods/yelpPhoneSearch?phone=${formattedPhone}`
        )
        .then(results => {
          if (results.data) {
            if (callback && results.data[0] && results.data[0].id) {
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
}

export function fetchYelpMetaEditVenueDetail (yId) {
  return function (dispatch) {
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
