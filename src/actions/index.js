import { FETCH_VENUES } from './types'

export function fetchVenues (regionId) {
  return {
    type: FETCH_VENUES,
    payload: regionId
  }
}
