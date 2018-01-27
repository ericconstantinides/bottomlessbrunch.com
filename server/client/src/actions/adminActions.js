import axios from 'axios'
import { ROOT_URL } from '../config'
import constants from '../actions/types'

export function fetchEnvironment () {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/methods/environment`).then(res => {
      const isAdmin = res.data.environment === 'dev'
      dispatch({
        type: constants.ADMIN_SET,
        payload: isAdmin
      })
    })
  }
}
