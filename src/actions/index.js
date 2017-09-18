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

export function setRegionUi (regionId) {
  return {
    type: constants.UI_SET_REGION,
    payload: {regionId}
  }
}

export function hoverVenueUi (venue) {
  if (venue) {
    return {
      type: constants.UI_VENUE_HOVER_ON,
      payload: {venue}
    }
  }
  return {
    type: constants.UI_VENUE_HOVER_OFF,
    payload: null
  }
}
