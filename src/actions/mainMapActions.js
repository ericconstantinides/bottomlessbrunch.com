import _ from 'lodash'
import constants from './types'
// import { parsePath } from '../lib/myHelpers'
import {
  getViewportOffset,
  getMarginBounds,
  getRegionByPath,
  parsePath,
  timeWithin,
  dayWithin,
  priceWithin
} from '../lib/myHelpers'

// I will get the slug from the path and also the storage to figure
// out the initial map state:
export function getInitialMapLocation (coords, regions, history, drawer) {
  const region = getRegionByPath(regions, history.location.pathname)
  if (region) {
    return setMainMapByRegion(region, coords, drawer, 'path')
  }
  const mainMapCoords = window.localStorage.getItem('mainMap')
  if (!mainMapCoords) return unsetMainMap()
  return {
    type: constants.MAIN_MAP_INITIAL_SET,
    initialCoordsFrom: 'storage',
    payload: JSON.parse(mainMapCoords)
  }
}

export function setMainMap (coords) {
  // this is where I want to figure out the marginBounds:
  const marginCoords = getMarginBounds(coords.bounds, coords.size)

  coords = { ...coords, ...marginCoords }

  window.localStorage.setItem('mainMap', JSON.stringify(coords))
  return {
    type: constants.MAIN_MAP_SET,
    payload: coords
  }
}

export function setMainMapByRegion (region, coords, drawer, initialCoordsFrom) {
  // get the width and height if it's not known yet:
  coords.size.width = drawer.brwsrWidth
  coords.size.height = drawer.brwsrHeight

  const fitted = getViewportOffset(region.bounds, drawer)
  const newCoords = { ...coords, ...fitted }

  window.localStorage.setItem('mainMap', JSON.stringify(coords))
  if (initialCoordsFrom) {
    return {
      type: constants.MAIN_MAP_INITIAL_SET,
      initialCoordsFrom: 'path',
      payload: newCoords
    }
  }
  return {
    type: constants.MAIN_MAP_SET,
    payload: newCoords
  }
}

export function unsetMainMap () {
  window.localStorage.removeItem('mainMap')
  return {
    type: constants.MAIN_MAP_UNSET,
    payload: null
  }
}
// size = {width: n, height: n}
export function updateMainMapSize (mapSize) {
  return {
    type: constants.MAIN_MAP_UPDATE_SIZE,
    payload: mapSize
  }
}

export function getMainMapVisibleVenues (
  venues,
  regions,
  coords,
  oldVisibleVenues,
  fetchVenueDetail,
  history,
  drawer,
  setUiActiveRegion,
  constructFilters,
  oldVisibleRegionsObj
) {
  const parsedPath = parsePath(history.location.pathname)
  let regionTitle = 'Choose Region'
  if (coords.zoom >= drawer.show_venues_zoom_level) {
    let regionReset = ''
    const { ne, sw } = coords.marginBounds
    let activeVenues = []
    let visibleRegionsObj = {}
    // loop through all the venues:
    _.map(venues, venue => {
      // check if the venue is within the map's coords:
      if (
        venue.lat <= ne.lat &&
        venue.lat >= sw.lat &&
        venue.lng <= ne.lng &&
        venue.lng >= sw.lng
      ) {
        // add the venue to the activeVenues:
        activeVenues.push({
          _id: venue._id,
          visible: true,
          filtered: oldVisibleVenues.some(
            prevVenue => prevVenue._id === venue._id && prevVenue.filtered
          )
        })
        // VISIBLE REGIONS LOGIC:
        // check if this region has been recorded yet:
        if (!visibleRegionsObj[venue.regionId]) {
          // if not, add it to visibleRegionsObj
          visibleRegionsObj[venue.regionId] = {
            name: regions[venue.regionId].name,
            _id: venue.regionId,
            venuesVisible: 1
          }
        } else {
          // just increment the venuesVisible:
          visibleRegionsObj[venue.regionId].venuesVisible++
        }
        // finally, since the venue is visible, we need to get more data for it:
        if (venue.fetchedLevel !== 'full') {
          fetchVenueDetail(venue._id, 'full')
        }
      }
    })
    // POST VENUE CHECKING:
    // check if we're inside a region, just no venues are currently visible:
    if (!Object.entries(visibleRegionsObj).length) {
      _.map(regions, region => {
        const center = coords.marginCenter ? coords.marginCenter : coords.center
        if (
          region.bounds &&
          center.lat <= region.bounds.north &&
          center.lat >= region.bounds.south &&
          center.lng <= region.bounds.east &&
          center.lng >= region.bounds.west
        ) {
          // SINGLE REGION
          visibleRegionsObj[region._id] = {
            name: region.name,
            _id: region._id,
            venuesVisible: 0
          }
        }
      })
    }
    // check visibleRegionsObj again if it changed from right above:
    if (Object.entries(visibleRegionsObj).length) {
      // visibleRegionsObj has data. let's do some checks on it:
      const rIds = Object.keys(visibleRegionsObj)

      // update activeVenues to include all the not currently visible venues:
      rIds.forEach(rId => {
        Object.entries(venues).forEach(([vId, venue]) => {
          if (
            venue.regionId === rId &&
            !activeVenues.some(({ _id }) => _id === vId)
          ) {
            // add the venue to the activeVenues but don't make it visible:
            activeVenues.push({
              _id: venue._id,
              visible: false,
              filtered: oldVisibleVenues.some(
                prevVenue => prevVenue._id === venue._id && prevVenue.filtered
              )
            })
          }
        })
      })
      if (rIds.length === 1) {
        // we have only 1 region visible
        // let's check if we're showing less than all the venues:
        if (
          visibleRegionsObj[rIds[0]].venuesVisible <
          regions[rIds[0]].venuesAvailable
        ) {
          // PARTIAL SINGLE REGION:
          const slug = regions[visibleRegionsObj[rIds[0]]._id].slug
          setUiActiveRegion(visibleRegionsObj[rIds[0]]._id)
          if (parsedPath.length <= 1 && parsedPath[0] !== slug) {
            history.push(slug)
          }
          regionReset = rIds[0]
          regionTitle = visibleRegionsObj[rIds[0]].name
        } else {
          // FULL SINGLE REGION:
          const slug = regions[visibleRegionsObj[rIds[0]]._id].slug
          setUiActiveRegion(visibleRegionsObj[rIds[0]]._id)
          if (parsedPath.length <= 1 && parsedPath[0] !== slug) {
            history.push(slug)
          }
          // This should only show when the coords are different:
          regionReset = rIds[0]
          regionTitle = visibleRegionsObj[rIds[0]].name
        }
      } else {
        // MULTIPLE REGIONS
        setUiActiveRegion(false)
        if (parsedPath.length === 1) {
          history.replace('/')
        }
        regionTitle = 'Multiple Regions'
      }
    } else {
      // NO REGION:
      setUiActiveRegion(false)
      if (history.location.pathname !== '/') {
        history.replace('/')
      }
    }
    activeVenues.sort(
      (idA, idB) =>
        Math.abs(venues[idB._id].lat) +
        Math.abs(venues[idB._id].lng) -
        (Math.abs(venues[idA._id].lat) + Math.abs(venues[idA._id].lng))
    )
    // Construct the filters if the visible regions have changed:
    if (
      Object.entries(oldVisibleRegionsObj).length !==
        Object.entries(visibleRegionsObj).length ||
      !Object.entries(oldVisibleRegionsObj).every(
        ([_id]) => visibleRegionsObj[_id]
      )
    ) {
      constructFilters(venues, activeVenues)
    }
    return {
      type: constants.MAIN_MAP_SET_VISIBLE_VENUES_AND_REGIONS,
      payload: {
        activeVenues,
        visibleRegionsObj,
        regionTitle,
        regionReset
      }
    }
  } else {
    setUiActiveRegion(false)
    if (history.location.pathname !== '/') {
      history.replace('/')
    }
    return {
      type: constants.MAIN_MAP_SET_ONLY_REGIONS,
      payload: regionTitle
    }
  }
}

export const filterMainMapVenues = (filters, venues, visibleVenues) => {
  const filteredVenues = visibleVenues.map(({ _id, visible }) => {
    const { normalizedTimes, normalizedDrinks } = venues[_id]
    let newFiltered
    // Filter out by Time:
    if (normalizedTimes && normalizedTimes.length) {
      newFiltered = normalizedTimes.every(day =>
        timeWithin(
          day.startTime,
          day.endTime,
          filters.timeStart,
          filters.timeEnd
        )
      )
      if (newFiltered) return { _id, visible, filtered: newFiltered }
      // Filter out by Day:
      newFiltered = normalizedTimes.every(day =>
        dayWithin(day.day, filters.dayStart, filters.dayEnd)
      )
      if (newFiltered) return { _id, visible, filtered: newFiltered }
    }

    // Filter out by Price:
    if (normalizedDrinks && normalizedDrinks.length) {
      newFiltered = normalizedDrinks.every(drink =>
        priceWithin(drink.price, filters.priceStart, filters.priceEnd)
      )
      if (newFiltered) return { _id, visible, filtered: newFiltered }

      // Filter out by priceMeta:
      if (!filters.includeDrinkWithMealPrices.checked) {
        newFiltered = normalizedDrinks.every(drink => drink.priceIncludesFood)
        if (newFiltered) return { _id, visible, filtered: newFiltered }
      }
      // Filter out by drinks:
      // console.log(normalizedDrinks)
      if (filters.checkedDrink !== 'All') {
        newFiltered = normalizedDrinks.every(
          drink => filters.checkedDrink !== drink.drink
        )
        if (newFiltered) return { _id, visible, filtered: newFiltered }
      }
    }

    // return what we got:
    return { _id, visible, filtered: false }
  })
  return {
    type: constants.MAIN_MAP_FILTER_VENUES,
    payload: filteredVenues
  }
}
