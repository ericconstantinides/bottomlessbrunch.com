import slugify from '../lib/Slug'
import constants from '../actions/types'
import venues from '../content/venues.json'
import regions from '../content/regions.json'

export function fetchRegions () {
  return {
    type: constants.REGIONS_FETCH,
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
    type: constants.VENUES_FETCH,
    payload: { data: venuesWithSlug }
  }
}

export function showInfoVenue (id) {
  return {
    type: constants.VENUE_SHOWINFO,
    payload: {id}
  }
}

export function hideInfoVenue (id) {
  return {
    type: constants.VENUE_HIDEINFO,
    payload: {id}
  }
}

export function openVenue (id) {
  return {
    type: constants.VENUE_OPEN,
    payload: {id}
  }
}

export function closeVenue (id) {
  return {
    type: constants.VENUE_CLOSE,
    payload: {id}
  }
}

export function setRegionUi (slug) {
  return {
    type: constants.UI_SET_REGION,
    payload: {slug}
  }
}
