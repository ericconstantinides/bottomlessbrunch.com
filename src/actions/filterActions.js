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
