/* global google */
import slugify from '../lib/Slug'
import constants from '../actions/types'
import venues from '../content/venues.json'
import regions from '../content/regions.json'

var googlePlaces = new google.maps.places.PlacesService(
  document.createElement('div')
)

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

export function fetchVenueDetail (id, placeId) {
  return (dispatch) => {
    googlePlaces.getDetails({ placeId }, (place, status) => {
      dispatch(setVenueDetail(id, place))
    })
  }
}

function setVenueDetail (id, place) {
  return {
    type: constants.VENUE_FETCH_DETAIL,
    id: id,
    payload: place
  }
}

export function setRegionUi (regionId) {
  return {
    type: constants.UI_SET_REGION,
    payload: { regionId }
  }
}

export function hoverVenueUi (venue) {
  if (venue) {
    return {
      type: constants.UI_VENUE_HOVER_ON,
      payload: { venue }
    }
  }
  return {
    type: constants.UI_VENUE_HOVER_OFF,
    payload: null
  }
}
