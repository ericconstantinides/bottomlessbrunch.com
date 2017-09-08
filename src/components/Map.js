import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export class Map extends Component {
  constructor (props) {
    super(props)
    const { lat, lng } = this.props.initialCenter
    this.state = {
      currentLocation: { lat, lng }
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap()
    }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap()
    }
  }

  recenterMap () {
    const map = this.map
    const curr = this.state.currentLocation

    const google = this.props.google
    const maps = google.maps

    if (map) {
      let center = new maps.LatLng(curr.lat, curr.lng)
      map.panTo(center)
    }
  }

  componentDidMount () {
    if (this.props.centerAroundCurrentLocation) {
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            }
          })
        })
      }
    }
    this.loadMap()
  }

  loadMap () {
    if (this.props && this.props.google) {
      // google is available
      const { google } = this.props
      const maps = google.maps

      const mapRef = this.refs.map
      const node = ReactDOM.findDOMNode(mapRef)

      let { zoom } = this.props
      const { lat, lng } = this.state.currentLocation
      const center = new maps.LatLng(lat, lng)
      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom
        }
      )
      this.map = new maps.Map(node, mapConfig)
    }
  }

  render () {
    return (
      <div ref='map'>
        Loading map...
      </div>
    )
  }
}

// Validate the proptypes:
Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
  centerAroundCurrentLocation: PropTypes.bool
}

// Initialize the props with default values:
Map.defaultProps = {
  zoom: 13,
  initialCenter: {
    lat: 37.2458846,
    // lng: -121.8053488
    lng: -121.000
  },
  centerAroundCurrentLocation: true
}
