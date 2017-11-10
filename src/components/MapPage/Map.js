import React, { Component } from 'react'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import _ from 'lodash'

import { getMapCoordsByViewport, checkMap } from '../../lib/myHelpers'
import * as actions from '../../actions'
import VenueTeaser from './VenueTeaser'
import { SHOW_VENUES_ZOOM_LEVEL } from '../../config'

import mapStyle from '../../mapStyles/bottomlessbrunch.json'

class Map extends Component {
  constructor () {
    super()
    this.item = ''
    this.state = {
      address: '',
      map: {}
    }
  }
  // mapLoaded = ({ map, maps }) => {
  //   this.setState({ map })
  // }
  componentDidMount = () => {
    console.log(this.props.ui.activeRegion)
    if (this.props.ui.activeRegion) {
      const { zoom, lat, lng } = this.props.ui.activeRegion
      this.props.setMainMap({ zoom, center: { lat, lng } })
    }
  }
  componentWillReceiveProps (nextProps) {
    // update the state's region if the UI region changes:
    if (
      !_.isEmpty(nextProps.ui.activeRegion) &&
      nextProps.ui.activeRegion._id !== this.props.ui.activeRegion._id
    ) {
      // why am I updating it to my redux value and not the value of the region?
      // this.updateMapAndDrawer({ size: this.props.mainMap.size })
      const { zoom, lat, lng } = nextProps.ui.activeRegion
      this.props.setMainMap({ zoom, center: { lat, lng } })
    }
  }

  handleMapChange = coords => {
    console.log('handleMapChange', coords)
    // update the maps size if the coords size has changed:
    if (!_.isEqual(this.props.mainMap.size, coords.size)) {
      this.props.updateMainMapSize(coords.size)
    }
    if (coords.zoom >= SHOW_VENUES_ZOOM_LEVEL) {
      this.props.getMainMapVisibleVenues(
        this.props.venues,
        coords,
        this.props.fetchVenueDetail
      )
    } else {
      // RUN AN ACTION THAT HIDES ALL VENUES
    }
    // checkMap(this.props.venues, coords)
    // this.updateMapAndDrawer(coords)
  }
  handleMapClick = props => {
    // props = {x, y, lat, lng, event}
    if (this.props.hoveredVenue) {
      this.props.clearMarkers()
    }
  }
  updateMapAndDrawer = mapCoords => {
    console.log(mapCoords)
    const { size } = mapCoords
    const { activeRegion: region } = this.props.ui
    const coords = !_.isEmpty(region.bounds)
      ? getMapCoordsByViewport(region, size)
      : this.props.ui.activeRegion
    // update redux:
    this.props.setMainMap(coords)
    if (this.props.venues) {
      checkMap(this.props.venues, coords)
    }
  }
  render () {
    return (
      <GoogleMapReact
        zoom={this.props.mainMap.zoom}
        center={this.props.mainMap.center}
        options={{
          fullscreenControl: false,
          zoomControl: false,
          styles: mapStyle
        }}
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
            size={this.props.mainMap.size}
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

function mapStateToProps ({ ui, regions, venues, mainMap }) {
  return { ui, regions, venues, mainMap }
}

export default connect(mapStateToProps, actions)(Map)
