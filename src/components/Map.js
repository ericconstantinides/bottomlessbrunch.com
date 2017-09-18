import React, { Component } from 'react'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import _ from 'lodash'
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
  handleMouseOver = venue => event => {
    this.props.hoverVenueUi(venue)
  }
  handleMouseLeave = venue => event => {
    this.props.hoverVenueUi()
  }
  componentDidMount () {
    this.setState({ loaded: true })
  }
  render () {
    return (
      <GoogleMapReact
        ref={this.mapLoaded.bind(this)}
        onDragEnd={this.mapMoved.bind(this)}
        zoom={this.props.zoom}
        center={this.props.center}
      >
        {_.map(this.props.venues, venue => (
          <VenueTeaser
            key={venue.id}
            altClass='MapItem'
            {...venue}
            lat={venue.position.lat}
            lng={venue.position.lng}
            handleMouseOver={this.handleMouseOver}
            handleMouseLeave={this.handleMouseLeave}
            handleClick={this.handleClick}
            venue={venue}
            hoveredId={this.props.ui.venueHover.id}
            regionSlug={this.props.regions[venue.regionId].slug}
          />
        ))}
      </GoogleMapReact>
    )
  }
}

function mapStateToProps ({ ui, regions }) {
  return { ui, regions }
}

export default connect(mapStateToProps, actions)(Map)
