import React, { Component } from 'react'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import * as actions from '../actions'
import VenueTeaser from './VenueTeaser'

class Map extends Component {
  constructor () {
    super()
    this.state = {
      map: null,
      loaded: false
    }
  }
  mapMoved () {
    console.log('Map Moved: ', JSON.stringify(this.state.map.getCenter()))
  }
  mapLoaded (map) {
    // This is how we can save the map:
    if (this.state.map !== null) return false
    // console.log('Map Loaded: ', JSON.stringify(map.getCenter()))
    this.setState({ map })
  }
  handleMouseOver = id => event => {
    this.props.showInfoVenue(id)
  }
  handleMouseLeave = id => event => {
    this.props.hideInfoVenue(id)
  }
  handleClick = id => event => {
    this.props.openVenue(id)
  }
  componentDidMount () {
    this.setState({ loaded: true })
  }
  render () {
    return (
      <GoogleMapReact
        ref={this.mapLoaded.bind(this)}
        onDragEnd={this.mapMoved.bind(this)}
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center}
      >
        {this.props.venues.map((venue, i) => (
          <VenueTeaser
            key={i}
            altClass='MapItem'
            {...venue}
            lat={venue.position.lat}
            lng={venue.position.lng}
            handleMouseOver={this.handleMouseOver}
            handleMouseLeave={this.handleMouseLeave}
            handleClick={this.handleClick}
            venue={venue}
          />
        ))}
      </GoogleMapReact>
    )
  }
}

export default connect(null, actions)(Map)
