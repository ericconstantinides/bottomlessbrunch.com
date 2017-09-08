import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { camelize } from '../lib/String'

const mapEvents = ['ready', 'click', 'dragend']

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
    const googleMap = this.googleMap
    const curr = this.state.currentLocation

    const google = this.props.google
    const googleMaps = google.maps

    if (googleMap) {
      let center = new googleMaps.LatLng(curr.lat, curr.lng)
      googleMap.panTo(center)
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
      const googleMaps = google.maps

      const mapRef = this.refs.map
      const node = ReactDOM.findDOMNode(mapRef)

      let { zoom } = this.props
      const { lat, lng } = this.state.currentLocation
      const center = new googleMaps.LatLng(lat, lng)
      const mapConfig = Object.assign({}, { center, zoom })
      this.googleMap = new googleMaps.Map(node, mapConfig)

      mapEvents.forEach(e => this.googleMap.addListener(e, this.handleEvent(e)))

      googleMaps.event.trigger(this.googleMap, 'ready')
    }
  }

  handleEvent (evtName) {
    let timeout
    const handlerName = `on${camelize(evtName)}`

    return e => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      timeout = setTimeout(() => {
        if (this.props[handlerName]) {
          this.props[handlerName](this.props, this.map, e)
        }
      }, 0)
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
mapEvents.forEach(e => Map.propTypes[camelize(e)] = PropTypes.func)

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
