import constants from '../actions/types'

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

export const togglePriceMeta = (oldPriceMeta, meta) => {
  const priceMeta = {
    ...oldPriceMeta,
    [meta]: { ...oldPriceMeta[meta], checked: !oldPriceMeta[meta].checked }
  }
  return {
    type: constants.FILTER_UPDATE,
    payload: { priceMeta }
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
