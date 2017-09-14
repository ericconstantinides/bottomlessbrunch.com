import slug from '../lib/Slug'
import {
  VENUES_FETCH,
  VENUE_SHOWINFO,
  VENUE_HIDEINFO,
  VENUE_OPEN,
  VENUE_CLOSE
} from './types'
import venuesJson from '../content/san-francisco-venues.json'

export function fetchVenues () {
  // let's add the slug here:
  // <region>/<place name>-<neighborhood>
  const venuesJsonWithSlug = venuesJson.map(venue => {
    venue.slug = slug(venue.region, venue.name, venue.neighborhood)
    return venue
  })
  return {
    type: VENUES_FETCH,
    payload: { data: venuesJsonWithSlug }
  }
}

export function showInfoVenue (id) {
  return {
    type: VENUE_SHOWINFO,
    payload: {id}
  }
}

export function hideInfoVenue (id) {
  return {
    type: VENUE_HIDEINFO,
    payload: {id}
  }
}

export function openVenue (id) {
  return {
    type: VENUE_OPEN,
    payload: {id}
  }
}

export function closeVenue (id) {
  return {
    type: VENUE_CLOSE,
    payload: {id}
  }
}
