import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, InfoWindow, Marker } from 'react-google-maps'

class RegionMap extends Component {
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

  render () {
    const markers = this.props.markers || []
    return (
      <GoogleMap
        ref={this.mapLoaded.bind(this)}
        onDragEnd={this.mapMoved.bind(this)}
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center}
      >
        {markers.map((marker, i) => (
          <Marker
            key={i}
            onMouseOver={() => this.handleMarkerHover(marker)}
            onMouseOut={() => this.handleMarkerClose(marker)}
            {...marker}
          >
            {marker.showInfo &&
              <InfoWindow>
                <div>{marker.infoContent}</div>
              </InfoWindow>}
          </Marker>
        ))}
      </GoogleMap>
    )
  }
}

export default withGoogleMap(RegionMap)
