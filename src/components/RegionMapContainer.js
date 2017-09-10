import React from 'react'
import RegionMap from './RegionMap'
import venuesJson from '../content/venues.json'

const RegionMapContainer = () => {
  const styles = { height: `100%`, width: `100%` }
  return (
    <RegionMap
      center={{ lat: 37.318835055903456, lng: -121.9353463464844 }}
      zoom={11}
      markers={venuesJson}
      containerElement={<div style={styles} />}
      mapElement={<div style={styles} />}
    />
  )
}

export default RegionMapContainer
