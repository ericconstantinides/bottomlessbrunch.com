import React from 'react'

const RegionMarker = props => (
  <div
    className='RegionMarker'
    onClick={props.handleRegionSelect(props.regionId)}
  >
    <div className='RegionMarker__marker' />
    <h3 className='RegionMarker__title'>
      {props.regionName}
    </h3>
  </div>
)

export default RegionMarker
