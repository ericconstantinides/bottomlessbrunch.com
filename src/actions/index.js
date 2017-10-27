import constants from '../actions/types'

export * from './regionsActions'
export * from './venuesActions'
export * from './gDataActions'
export * from './yDataActions'
export * from './uiActions'
export * from './mainMapActions'

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
