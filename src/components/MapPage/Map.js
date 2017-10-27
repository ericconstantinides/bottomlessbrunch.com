import React, { Component } from 'react'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import _ from 'lodash'

import { getMapCoordsByViewport } from '../../lib/myHelpers'
import * as actions from '../../actions'
import VenueTeaser from './VenueTeaser'

class Map extends Component {
  constructor () {
    super()
    this.item = ''
    this.state = {
      address: '',
      map: {}
    }
  }
  mapLoaded = ({ map, maps }) => {
    this.setState({ map })
  }
  // componentDidMount = () => {
  //   this.updateMapAndDrawer()
  // }
  componentDidUpdate (prevProps, prevState) {
    // update the state's region if the UI region changes:
    if (
      !_.isEmpty(this.props.ui.activeRegion) &&
      (this.props.ui.activeRegion._id !== prevProps.ui.activeRegion._id ||
        this.props.ui.browserSize.width !== prevProps.ui.browserSize.width ||
        this.props.ui.browserSize.height !== prevProps.ui.browserSize.height)
    ) {
      this.updateMapAndDrawer({ size: this.props.mainMap.size })
    }
  }
  handleMapChange = coords => {
    this.updateMapAndDrawer(coords)
  }
  handleMapClick = props => {
    // props = {x, y, lat, lng, event}
    if (this.props.hoveredVenue) {
      this.props.clearMarkers()
    }
  }
  updateMapAndDrawer = ({size}) => {
    const { activeRegion: region } = this.props.ui
    const coords = !_.isEmpty(region.bounds)
      ? getMapCoordsByViewport(region, size)
      : this.props.ui.activeRegion
    
    this.props.setMainMap(coords)
  }
  render () {
    return (
      <GoogleMapReact
        zoom={this.props.mainMap.zoom}
        center={this.props.mainMap.center}
        options={{ fullscreenControl: false }}
        onChange={this.handleMapChange}
        onClick={this.handleMapClick}
      >
        {_.map(this.props.venues, venue => (
          <VenueTeaser
            key={venue._id}
            ref={venue._id}
            altClass='MapItem'
            {...venue}
            lat={venue.lat}
            lng={venue.lng}
            mainMap={this.props.mainMap}
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

function mapStateToProps ({ ui, regions, mainMap }) {
  return { ui, regions, mainMap }
}

export default connect(mapStateToProps, actions)(Map)
