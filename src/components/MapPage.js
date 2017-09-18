import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import RegionSelect from './RegionSelect'
import Map from './Map'
import VenueList from './VenueList'
import './MapPage.css'

class MapPage extends Component {
  render () {
    const region = this.props.regions.filter(
      region => region.id === this.props.ui.region
    )[0]
    const styles = { height: `100%`, width: `100%` }
    return (
      <div className='MapPage'>
        <h1>Bottomless Brunch</h1>
        <div className='MapPage__container'>
          <div className='MapPage__column'>
            <RegionSelect region={this.props.ui.region} />
            <VenueList region={this.props.ui.region} />
          </div>
          <div className='MapPage__column Map__container'>
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

function mapStateToProps ({ regions, venues, ui }) {
  return { regions, venues, ui }
}

export default connect(mapStateToProps, actions)(MapPage)
