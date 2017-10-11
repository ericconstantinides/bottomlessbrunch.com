import constants from '../actions/types'

export * from './regions'
export * from './venues'
export * from './gData'
export * from './yData'
export * from './ui'

// TODO: THIS DOESN'T WORK EITHER
export function apiError (error) {
  return {
    type: constants.API_ERROR,
    payload: error
  }
}

export function resetEditVenue () {
  return {
    type: constants.EDIT_VENUE_RESET,
    payload: null
  }
}
