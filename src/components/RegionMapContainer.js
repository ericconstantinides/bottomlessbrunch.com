import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

class RegionMapContainer extends Component {
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
  render () {
    const markers = this.props.markers || []
    return (
      <GoogleMap
        ref={this.mapLoaded.bind(this)}
        onDragEnd={this.mapMoved.bind(this)}
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center}
        // Pass the map reference here as props
      >
        {markers.map((marker, index) => <Marker {...marker} />)}
      </GoogleMap>
    )
  }
}

export default withGoogleMap(RegionMapContainer)
