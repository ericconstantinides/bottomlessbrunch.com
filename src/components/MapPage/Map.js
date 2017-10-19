import React, { Component } from 'react'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import { fitBounds } from 'google-map-react/utils'
import _ from 'lodash'

import { usaMap, DRAWER, PAD_DEGREES } from '../../config'
import * as actions from '../../actions'
import VenueTeaser from './VenueTeaser'

class Map extends Component {
  constructor () {
    super()
    this.state = {
      zoom: usaMap.zoom,
      lat: usaMap.lat,
      lng: usaMap.lng,
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
  handleMouseOver = venue => event => {
    this.props.hoverVenueUi(venue)
  }
  handleMouseLeave = venue => event => {
    this.props.hoverVenueUi()
  }
  componentDidMount = () => {
    this.updateMapAndDrawer()
  }
  componentDidUpdate (prevProps, prevState) {
    // update the state's region if the UI region changes:
    if (
      this.props.ui.region !== prevProps.ui.region ||
      this.props.ui.browserSize.width !== prevProps.ui.browserSize.width ||
      this.props.ui.browserSize.height !== prevProps.ui.browserSize.height
    ) {
      this.updateMapAndDrawer()
    }
  }
  updateMapAndDrawer = () => {
    const { width, height } = this.props.ui.browserSize
    let drawer
    if (width >= DRAWER.sm.starts && width <= DRAWER.sm.ends) {
      drawer = DRAWER.sm
    } else if (width >= DRAWER.md.starts && width <= DRAWER.md.ends) {
      drawer = DRAWER.md
    } else {
      drawer = DRAWER.lg
    }

    // figure out the drawer ratio:
    const drawerWidthRatio = 1 - (width - drawer.width) / width
    const drawerHeightRatio = 1 - (height - drawer.height) / height

    const myRegion = this.props.regions[this.props.ui.region]

    if (myRegion.bounds) {
      // get the total latitude and longitude width and height:
      const totalLat = myRegion.bounds.north - myRegion.bounds.south
      const totalLng = myRegion.bounds.east - myRegion.bounds.west

      const bounds = {
        nw: {
          lat: myRegion.bounds.north + PAD_DEGREES,
          lng: myRegion.bounds.west -
            totalLng * (drawerWidthRatio * 2) -
            PAD_DEGREES
        },
        se: {
          lat: myRegion.bounds.south -
            totalLat * (drawerHeightRatio * 2) -
            PAD_DEGREES,
          lng: myRegion.bounds.east + PAD_DEGREES
        }
      }
      const mapCenter = fitBounds(bounds, { width, height })
      this.setState({
        loaded: true,
        lat: mapCenter.center.lat,
        lng: mapCenter.center.lng,
        zoom: mapCenter.zoom
      })
    } else {
      this.setState({
        loaded: true,
        lat: myRegion.lat,
        lng: myRegion.lng,
        zoom: myRegion.zoom
      })
    }
  }
  render () {
    return (
      <GoogleMapReact
        zoom={this.state.zoom}
        center={{ lat: this.state.lat, lng: this.state.lng }}
        options={{ fullscreenControl: false }}
        onGoogleApiLoaded={this.mapLoaded}
      >
        {_.map(this.props.venues, venue => (
          <VenueTeaser
            key={venue._id}
            altClass='MapItem'
            {...venue}
            lat={venue.lat}
            lng={venue.lng}
            handleMouseOver={this.handleMouseOver}
            handleMouseLeave={this.handleMouseLeave}
            venue={venue}
            hoveredId={this.props.ui.venueHover._id}
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
