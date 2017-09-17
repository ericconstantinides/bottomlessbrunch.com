import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import RegionSelect from './RegionSelect'
import Map from './Map'
import VenueList from './VenueList'

class Home extends Component {
  render () {
    // default to San Francisco (ID: 0) region:
    const region = this.props.regions.filter(region => region.id === 0)[0]
    const styles = { height: `100%`, width: `100%` }
    return (
      <div className='Home'>
        <h1>Bottomless Brunch</h1>
        <div className='App__container'>
          <div className='App__column'>
            <RegionSelect />
            <VenueList />
          </div>
          <div className='App__column Map__container'>
            <Map
              cursorPos={this.props.cursorPos}
              center={region.position}
              zoom={region.zoom}
              minZoom={4}
              venues={this.props.venues}
              containerElement={<div style={styles} />}
              mapElement={<div style={styles} />}
            />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ regions, venues }) {
  return { regions, venues }
}

export default connect(mapStateToProps, actions)(Home)
