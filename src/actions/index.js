import { FETCH_VENUES, HOVER_VENUE_ON, HOVER_VENUE_OFF } from './types'
import venuesJson from '../content/venues.json'

export function fetchVenues () {
  return {
    type: FETCH_VENUES,
    payload: { data: venuesJson }
  }
}

export function hoverVenue (id, direction) {
  if (direction === 'on') {
    return {
      type: HOVER_VENUE_ON,
      payload: {id}
    }
  }
  return {
    type: HOVER_VENUE_OFF,
    payload: {id}
  }
}
