import React, { Component } from 'react'
import RegionSelect from './components/RegionSelect'
import RegionMap from './components/RegionMap'
import VenueList from './components/VenueList'
import './App.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <h1>Bottomless Brunch</h1>
        <div className='App__container'>
          <div className='App__column'>
            <RegionSelect />
            <VenueList />
          </div>
          <div className='App__column'>
            <RegionMap />
          </div>
        </div>
      </div>
    )
  }
}

export default App
