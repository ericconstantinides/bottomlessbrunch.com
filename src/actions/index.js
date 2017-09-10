import { FETCH_VENUES } from './types'
import venuesJson from '../content/venues.json'

export function fetchVenues () {
  return {
    type: FETCH_VENUES,
    payload: { data: venuesJson }
  }
}
