import React, { Component } from 'react'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import _ from 'lodash'

import { USA_MAP } from '../../config'
import { getMapCoordsByViewport } from '../../lib/myHelpers'
import * as actions from '../../actions'
import VenueTeaser from './VenueTeaser'

class Map extends Component {
  constructor () {
    super()
    this.state = {
      zoom: USA_MAP.zoom,
      lat: USA_MAP.lat,
      lng: USA_MAP.lng,
      address: '',
      loaded: false,
      mapSize: {
        width: 0,
        height: 0
      }
    }
  }
  mapLoaded = ({ map, maps }) => {
    this.setState({ map })
  }
  componentDidMount = () => {
    this.updateMapAndDrawer()
  }
  componentDidUpdate (prevProps, prevState) {
    // update the state's region if the UI region changes:
    if (
      !_.isEmpty(this.props.ui.activeRegion) &&
      (this.props.ui.activeRegion._id !== prevProps.ui.activeRegion._id ||
        this.props.ui.browserSize.width !== prevProps.ui.browserSize.width ||
        this.props.ui.browserSize.height !== prevProps.ui.browserSize.height)
    ) {
      this.updateMapAndDrawer()
    }
  }
  handleMapClick = props => {
    // props = {x, y, lat, lng, event}
    if (this.props.hoveredVenue) {
      this.props.clearMarkers()
    }
  }
  updateMapAndDrawer = () => {
    const { activeRegion: region, browserSize } = this.props.ui
    const { lat, lng, zoom } = !_.isEmpty(region.bounds)
      ? getMapCoordsByViewport(region, browserSize)
      : this.props.ui.activeRegion
    this.setState({ loaded: true, lat, lng, zoom })
  }
  render () {
    return (
      <GoogleMapReact
        zoom={this.state.zoom}
        center={{ lat: this.state.lat, lng: this.state.lng }}
        options={{ fullscreenControl: false }}
        onGoogleApiLoaded={this.mapLoaded}
        yesIWantToUseGoogleMapApiInternals
        onClick={this.handleMapClick}
      >
        {_.map(this.props.venues, venue => (
          <VenueTeaser
            key={venue._id}
            altClass='MapItem'
            {...venue}
            lat={venue.lat}
            lng={venue.lng}
            handleMouseOver={this.props.handleMouseOver}
            handleMouseLeave={this.props.handleMouseLeave}
            toggleMarkerClick={this.props.toggleMarkerClick}
            hoveredVenue={this.props.hoveredVenue}
            venue={venue}
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
