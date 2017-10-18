/* global google */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import { fitBounds } from 'google-map-react/utils'
import _ from 'lodash'

import { getRegionBoundsByVenues } from '../../lib/myHelpers'
import { usaMap, DRAWER, PAD_DEGREES } from '../../config'
import * as actions from '../../actions'
import VenueTeaser from './VenueTeaser'

class Map extends Component {
  constructor () {
    super()
    this.state = {
      browserWidth: 0,
      browserHeight: 0,
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
  updateBrowserSize = () => {
    this.setState({
      browserWidth: window.innerWidth,
      browserHeight: window.innerHeight
    })
  }
  mapLoaded (map) {
    // This is how we can save the map:
    if (this.state.map !== null) return false
    this.setState({ map })
    // recenter map:
    // debugger
    // console.log(map)
    // const recenter = offsetCenter(this.props.center, this.props.zoom, -320, 0)
    // console.dir(recenter)

    // get these values from the DOM:
    // to start I'll hard code these in...
  }
  mapLoaded2 = ({ map, maps }) => {
    // console.log(map, maps)
    // maps.event.addListenerOnce(this.state.map, 'projection_changed', () => {
    //   console.log('hello')
    //   console.log(maps)
    // })
  }
  handleMouseOver = venue => event => {
    this.props.hoverVenueUi(venue)
  }
  handleMouseLeave = venue => event => {
    this.props.hoverVenueUi()
  }
  componentWillMount = () => {
    this.updateBrowserSize()
  }
  componentDidMount = () => {

    const regionsBounds = getRegionBoundsByVenues(this.props.venues)

    const browserWidth = this.state.browserWidth
    const browserHeight = this.state.browserHeight
    let drawer
    if (browserWidth >= DRAWER.sm.starts && browserWidth <= DRAWER.sm.ends) {
      drawer = DRAWER.sm
    } else if (
      browserWidth >= DRAWER.md.starts &&
      browserWidth <= DRAWER.md.ends
    ) {
      drawer = DRAWER.md
    } else {
      drawer = DRAWER.lg
    }

    const miniWidthPx = browserWidth - drawer.width
    const miniHeightPx = browserHeight - drawer.height

    // figure out the ratio differences
    const drawerWidthRatio = 1 - miniWidthPx / browserWidth
    const drawerHeightRatio = 1 - miniHeightPx / browserHeight
    // debugger

    const myRegion = regionsBounds[this.props.ui.region]

    const totalLat = myRegion.north - myRegion.south
    const totalLng = myRegion.east - myRegion.west

    const minibounds = {
      nw: {
        lat: myRegion.north + PAD_DEGREES,
        lng: myRegion.west - totalLng * (drawerWidthRatio * 2) - PAD_DEGREES
      },
      se: {
        lat: myRegion.south - totalLat * (drawerHeightRatio * 2) - PAD_DEGREES,
        lng: myRegion.east + PAD_DEGREES
      }
    }

    const miniCenter = fitBounds(minibounds, {
      width: browserWidth,
      height: browserHeight
    })

    this.setState({
      loaded: true,
      lat: miniCenter.center.lat,
      lng: miniCenter.center.lng,
      zoom: miniCenter.zoom
    })
  }
  render () {
    return (
      <GoogleMapReact
        ref={this.mapLoaded.bind(this)}
        zoom={this.state.zoom}
        center={{ lat: this.state.lat, lng: this.state.lng }}
        options={{ fullscreenControl: false }}
        onGoogleApiLoaded={this.mapLoaded2}
        yesIWantToUseGoogleMapApiInternals
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
