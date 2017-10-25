import React from 'react'
import { Link } from 'react-router-dom'

import _ from 'lodash'

const RegionsModal = props => {
  const regions = _
    .chain(props.regions)
    // only choose regions which have bounds
    // (regions with venues are the only ones with bounds)
    .filter(region => region.bounds)
    .map(region => (
      <Link
        key={region._id}
        className='RegionsModal__link'
        to={`/${region.slug}`}
        onClick={props.handleCloseRegionsModalClick}
      >
        {region.name}
      </Link>
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
