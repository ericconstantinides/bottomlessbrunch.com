import _ from 'lodash'
import constants from '../actions/types'
import { initialState } from '../reducers/FilterReducer'

export const setFilters = () => {
  return {
    type: constants.FILTER_SET
  }
}

export const updateFilter = filtersObj => {
  return {
    type: constants.FILTER_UPDATE,
    payload: filtersObj
  }
}

export const togglePriceMeta = oldIncludeDrinkWithMealPrices => {
  const includeDrinkWithMealPrices = {
    ...oldIncludeDrinkWithMealPrices,
    checked: !oldIncludeDrinkWithMealPrices.checked
  }
  return {
    type: constants.FILTER_UPDATE,
    payload: { includeDrinkWithMealPrices }
  }
}

export const toggleDrink = (oldDrinks, drinkName) => {
  const drinkChecked = !oldDrinks[drinkName].checked
  const drinkDisabled = oldDrinks[drinkName].disabled
  let drinks = {}
  if (drinkName === 'All') {
    Object.keys(oldDrinks).forEach(drink => {
      drinks[drink] = {
        disabled: drinkDisabled,
        checked: drinkChecked
      }
    })
  } else {
    drinks = {
      ...oldDrinks,
      [drinkName]: {
        disabled: drinkDisabled,
        checked: drinkChecked
      }
    }
    // now double check the status of All and if it needs to be updated:
    const allSame = Object.keys(drinks).every(drink => {
      if (drink === 'All') return true
      return drinks[drink].checked === drinkChecked
    })
    drinks = {
      ...oldDrinks,
      [drinkName]: {
        disabled: drinkDisabled,
        checked: drinkChecked
      },
      All: {
        disabled: false,
        checked: allSame ? drinkChecked : false
      }
    }
  }
  return {
    type: constants.FILTER_UPDATE,
    payload: { drinks }
  }
}

export const constructFilters = (oldFilters, venues, visibleVenues) => {
  console.log('[filterActions.js]: constructFilters()')
  // now I have to cycle through all the visible venues to aggregate the data:
  const fltrs = _.cloneDeep(initialState)
  visibleVenues.forEach(({ _id }) => {
    const { normalizedTimes, normalizedDrinks } = venues[_id]
    normalizedTimes.forEach(day => {
      fltrs.timeMin = fltrs.timeMin === -1 || day.startTime < fltrs.timeMin
        ? day.startTime
        : fltrs.timeMin
      fltrs.timeMax = fltrs.timeMax === -1 || day.endTime > fltrs.timeMax
        ? day.endTime
        : fltrs.timeMax
      fltrs.dayMin = fltrs.dayMin === -1 || day.day < fltrs.dayMin
        ? day.day
        : fltrs.dayMin
      fltrs.dayMax = fltrs.dayMin === -1 || day.day > fltrs.dayMax
        ? day.day
        : fltrs.dayMax
    })
    normalizedDrinks.forEach(drinkObj => {
      fltrs.priceMax = fltrs.priceMax === -1 || drinkObj.price > fltrs.priceMax
        ? drinkObj.price
        : fltrs.priceMax
      fltrs.includeDrinkWithMealPrices = {
        disabled: !(fltrs.includeDrinkWithMealPrices.checked ||
          drinkObj.priceIncludesFood),
        checked: fltrs.includeDrinkWithMealPrices.checked ||
          drinkObj.priceIncludesFood
      }
      fltrs.drinks[drinkObj.drink] = {
        disabled: !(fltrs.drinks[drinkObj.drink].checked || drinkObj.drink),
        checked: fltrs.drinks[drinkObj.drink].checked || drinkObj.drink
      }
    })
  })
  fltrs.timeMin = Math.floor(fltrs.timeMin)
  fltrs.timeStart = fltrs.timeMin
  fltrs.timeMax = Math.ceil(fltrs.timeMax)
  fltrs.timeEnd = fltrs.timeMax
  fltrs.dayStart = fltrs.dayMin
  fltrs.dayEnd = fltrs.dayMax
  fltrs.priceMax = fltrs.priceMax + (10 - fltrs.priceMax % 10)
  fltrs.priceEnd = fltrs.priceMax
  // console.log(fltrs)
  return {
    type: constants.FILTER_UPDATE,
    payload: { ...fltrs, ready: true }
  }
}
