import React from 'react'
import { Link } from 'react-router-dom'

import _ from 'lodash'

const RegionsModal = props => {
  const regions = _.map(props.regions, region => (
    <div key={region._id} className='RegionsModal__item'>
      <Link
        className='u-d-b'
        to={`/${region.slug}`}
        onClick={props.handleRegionsLinkClick}
      >
        {region.name}
      </Link>
    </div>
  ))
  return (
    <div className='RegionsModal__container'>
      <div className='RegionsModal'>
        {regions}
      </div>
    </div>
  )
}

export default RegionsModal
