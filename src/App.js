import React, { Component } from 'react'
import RegionSelect from './components/RegionSelect'
import RegionMapContainer from './components/RegionMapContainer'
import VenueList from './components/VenueList'
import './App.css'

class App extends Component {
  render () {
    // const dummyMarkers = [
    //   {
    //     position: { lat: 37.244396, lng: -121.8048837 }
    //   }
    // ]
    return (
      <div className='App'>
        <h1>Bottomless Brunch</h1>
        <div className='App__container'>
          <div className='App__column'>
            <RegionSelect />
            <VenueList />
          </div>
          <div className='App__column Map__container'>
            <RegionMapContainer />
          </div>
        </div>
      </div>
    )
  }
}

export default App
