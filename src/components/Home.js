import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import RegionSelect from './RegionSelect'
import MapContainer from './MapContainer'
import VenueList from './VenueList'

class Home extends Component {
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
            <MapContainer cursorPos={this.props.cursorPos} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(null, actions)(Home)
