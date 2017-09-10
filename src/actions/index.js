import { FETCH_VENUES } from './types'
import venuesJson from '../content/venues.json'

export function fetchVenues () {
  console.log('fetching')
  return {
    type: FETCH_VENUES,
    payload: { data: venuesJson }
  }
}
