import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export class Map extends Component {
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap()
    }
  }

  loadMap () {
    if (this.props && this.props.google) {
      // google is available
      const {google} = this.props
      const maps = google.maps

      const mapRef = this.refs.map
      const node = ReactDOM.findDOMNode(mapRef)

      let {initialCenter, zoom} = this.props
      const {lat, lng} = initialCenter
      const center = new maps.LatLng(lat, lng)
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
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
  initialCenter: PropTypes.object
}

// Initialize the props with default values:
Map.defaultProps = {
  zoom: 13,
  // San Francisco, by default
  initialCenter: {
    lat: 37.2458846,
    lng: -121.8053488
  }
}
