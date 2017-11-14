import React, { Component } from 'react'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import _ from 'lodash'

// import { getRegionCoordsByViewport, checkMap } from '../../lib/myHelpers'
import * as actions from '../../actions'
import mapStyle from '../../mapStyles/bottomlessbrunch.json'

import VenueTeaser from './VenueTeaser'
import RegionMarker from '../common/RegionMarker'

const MBounder = props => {
  return (
    <div className={`MBounder is-${props.title}`}
      key={props.key}
      lat={props.lat}
      lng={props.lng}
    >
      <div className='MBounder__title'>
        {props.title}
      </div>
    </div>
  )
}

class Map extends Component {
  // mapLoaded = ({ map, maps }) => {
  //   this.setState({ map })
  // }
  /*   componentDidMount = () => {
    console.log(this.props.ui.activeRegion)
    if (this.props.ui.activeRegion) {
      const { zoom, lat, lng } = this.props.ui.activeRegion
      this.props.setMainMap({ zoom, center: { lat, lng } })
    }
  } */
  /*   componentWillReceiveProps (nextProps) {
    // update the state's region if the UI region changes:
    if (
      !_.isEmpty(nextProps.ui.activeRegion) &&
      nextProps.ui.activeRegion._id !== this.props.ui.activeRegion._id
    ) {
      // why am I updating it to my redux value and not the value of the region?
      // this.updateMapAndDrawer({ size: this.props.mainMap.coords.size })
      const { zoom, lat, lng } = nextProps.ui.activeRegion
      this.props.setMainMap({ zoom, center: { lat, lng } })
    }
  } */

  handleMapChange = coords => {
    // console.log('handleMapChange:', coords)
    // update the maps size if the coords size has changed:
    if (!_.isEqual(this.props.mainMap.coords.size, coords.size)) {
      this.props.updateMainMapSize(coords.size)
    }
    this.props.setMainMap(coords)
    this.props.getMainMapVisibleVenues(
      this.props.venues,
      this.props.regions,
      coords,
      this.props.fetchVenueDetail,
      this.props.history
    )
    // checkMap(this.props.venues, coords)
    // this.updateMapAndDrawer(coords)
  }
  handleMapClick = props => {
    // props = {x, y, lat, lng, event}
    if (this.props.hoveredVenue) {
      this.props.clearMarkers()
    }
  }
  /*   updateMapAndDrawer = mapCoords => {
    const { size } = mapCoords
    const { activeRegion: region } = this.props.ui
    const coords = !_.isEmpty(region.bounds)
      ? getRegionCoordsByViewport(region, size)
      : this.props.ui.activeRegion
    // update redux:
    this.props.setMainMap(coords)
    if (this.props.venues) {
      checkMap(this.props.venues, coords)
    }
  } */
  handleRegionClick = _id => event => {
    console.log('go to this region:', this.props.regions[_id].name)
  }
  renderVenueTeasers = () => {
    let mapItemVenueTeasers = []
    _.map(this.props.venues, venue => {
      // check if its in visible regions and only render it then:
      if (
        this.props.mainMap.visibleRegionsObj &&
        this.props.mainMap.visibleRegionsObj[venue.regionId]
      ) {
        mapItemVenueTeasers.push(
          <VenueTeaser
            key={venue._id}
            ref={venue._id}
            altClass='MapItem'
            {...venue}
            lat={venue.lat}
            lng={venue.lng}
            size={this.props.mainMap.coords.size}
            handleMouseOver={this.props.handleMouseOver}
            handleMouseLeave={this.props.handleMouseLeave}
            toggleMarkerClick={this.props.toggleMarkerClick}
            hoveredVenue={this.props.hoveredVenue}
            venue={venue}
            regionSlug={this.props.regions[venue.regionId].slug}
            handleVenueTeaserLinkClick={this.props.handleVenueTeaserLinkClick}
          />
        )
      }
    })
    return mapItemVenueTeasers
  }
  renderRegionMarkers = () => {
    let regionMarkers = []
    // render region markers for all the other regions:
    // console.log(this.props.mainMap.visibleRegionsObj)
    _.map(this.props.regions, region => {
      // if no visibleRegions at all - OR - this region is not visible
      if (
        (!this.props.mainMap.visibleRegionsObj ||
        !this.props.mainMap.visibleRegionsObj[region._id]) &&
        region.venuesAvailable
      ) {
        regionMarkers.push(
          <RegionMarker
            key={region._id}
            lat={region.lat}
            lng={region.lng}
            regionId={region._id}
            regionName={region.name}
            handleRegionSelect={this.props.handleRegionSelect}
          />
        )
      }
    })
    return regionMarkers
  }
  debugMarginBounds = () => {
    if (this.props.mainMap.coords && this.props.mainMap.coords.marginBounds) {
      return _.map(this.props.mainMap.coords.marginBounds, (mBounder, key) => (
        <MBounder
          key={key}
          title={key}
          lat={mBounder.lat}
          lng={mBounder.lng}
        />
      ))
    }
  }
  debugMarginCenter = () => {
    if (this.props.mainMap.marginCenter) {
      return (
        <MBounder
          key='center'
          title='center'
          lat={this.props.mainMap.marginCenter.lat}
          lng={this.props.mainMap.marginCenter.lng}
        />
      )
    }
  }
  render () {
    if (!this.props.mainMap) {
      return <div>Loading...</div>
    }
    return (
      <GoogleMapReact
        zoom={this.props.mainMap.coords.zoom}
        center={this.props.mainMap.coords.center}
        options={{
          fullscreenControl: false,
          zoomControl: false,
          styles: mapStyle
        }}
        onChange={this.handleMapChange}
        onClick={this.handleMapClick}
      >
        {this.renderVenueTeasers()}
        {this.renderRegionMarkers()}
        {this.debugMarginBounds()}
        {this.debugMarginCenter()}
      </GoogleMapReact>
    )
  }
}

function mapStateToProps ({ ui, regions, venues, mainMap }) {
  return { ui, regions, venues, mainMap }
}

export default connect(mapStateToProps, actions)(Map)
