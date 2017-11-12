import React from 'react'

import _ from 'lodash'

const RegionsModal = props => {
  const regions = _
    .chain(props.regions)
    // only choose regions which have bounds
    // (regions with venues are the only ones with bounds)
    .filter(region => region.bounds)
    .map(region => (
      <div
        key={region._id}
        className='RegionsModal__link'
        onClick={props.handleRegionSelect(region._id)}
      >
        {region.name}
      </div>
    ))
    .value()
  return (
    <div
      className='RegionsModal__container'
      onClick={props.handleCloseRegionsModalClick}
    >
      <h2 className='RegionsModal__subheader'>
        I'm thirsty for<br />
        brunch in...
      </h2>
      <div className='RegionsModal'>
        {regions}
      </div>
    </div>
  )
}

export default RegionsModal
