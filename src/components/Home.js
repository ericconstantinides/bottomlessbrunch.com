import React, { Component } from 'react'
import RegionSelect from './RegionSelect'
import MapContainer from './MapContainer'
import VenueList from './VenueList'

export default class Home extends Component {
  render () {
    return (
      <div className='Home'>
        <h1>Bottomless Brunch</h1>
        <div className='App__container'>
          <div className='App__column'>
            <RegionSelect />
            <VenueList />
          </div>
          <div className='App__column Map__container'>
            <MapContainer />
          </div>
        </div>
      </div>
    )
  }
}
