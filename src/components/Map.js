import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withGoogleMap, GoogleMap, InfoWindow, Marker } from 'react-google-maps'
import * as actions from '../actions'

class Map extends Component {
  constructor () {
    super()
    this.state = {
      map: null
    }
  }

  mapMoved () {
    console.log('Map Moved: ', JSON.stringify(this.state.map.getCenter()))
  }
  mapLoaded (map) {
    // This is how we can save the map:
    if (this.state.map !== null) return false
    console.log('Map Loaded: ', JSON.stringify(map.getCenter()))
    this.setState({ map })
  }
  onMarkerClick () {
    console.log('click.')
  }
  // Toggle to 'true' to show InfoWindow and re-renders component
  handleMarkerHover (targetMarker) {
    console.log('hover')
    // this.setState({
    //   markers: this.state.markers.map(marker => {
    //     if (marker === targetMarker) return { ...marker, showInfo: true }
    //     return marker
    //   })
    // })
  }

  handleMarkerClose (targetMarker) {
    console.log('off-hover')
    // this.setState({
    //   markers: this.state.markers.map(marker => {
    //     if (marker === targetMarker) return { ...marker, showInfo: false }
    //     return marker
    //   })
    // })
  }
  renderMarkers () {
    if (!this.props.markers) return ''
    return this.props.markers.map((marker, i) => (
      <Marker
        key={i}
        onMouseOver={() => this.props.showInfoVenue(marker.id, 'on')}
        onMouseOut={() => this.props.showInfoVenue(marker.id, 'off')}
        onClick={() => this.props.openVenue(marker.id)}
        {...marker}
      >
        {marker.showInfo &&
          <InfoWindow>
            <div>
              <h4>
                {marker.name}
              </h4>
              <p>
                {marker.address.city}
              </p>
            </div>
          </InfoWindow>}
      </Marker>
    ))
  }

  render () {
    return (
      <GoogleMap
        ref={this.mapLoaded.bind(this)}
        onDragEnd={this.mapMoved.bind(this)}
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center}
      >
        {this.renderMarkers()}
      </GoogleMap>
    )
  }
}

export default connect(null, actions)(withGoogleMap(Map))
