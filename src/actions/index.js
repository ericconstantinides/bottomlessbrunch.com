import slugify from '../lib/Slug'
import {
  REGIONS_FETCH,
  VENUES_FETCH,
  VENUE_SHOWINFO,
  VENUE_HIDEINFO,
  VENUE_OPEN,
  VENUE_CLOSE
} from './types'
import venues from '../content/venues.json'
import regions from '../content/regions.json'

export function fetchRegions () {
  return {
    type: REGIONS_FETCH,
    payload: { data: regions }
  }
}

export function fetchVenues () {
  // let's add the slug here:
  // <place name>-<neighborhood>
  const venuesWithSlug = venues.map(venue => {
    venue.slug = slugify(venue.name) + '-' + slugify(venue.neighborhood)
    return venue
  })
  return {
    type: VENUES_FETCH,
    payload: { data: venuesWithSlug }
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
