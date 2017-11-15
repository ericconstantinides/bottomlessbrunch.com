import React, { Component } from 'react'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import _ from 'lodash'

import * as actions from '../../actions'
import mapStyle from '../../mapStyles/bottomlessbrunch.json'

import VenueTeaser from './VenueTeaser'
import RegionMarker from '../common/RegionMarker'

const MBounder = props => {
  const className = 'MBounder is-' + props.title
  return (
    <div
      className={className}
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

  // shouldComponentUpdate (nextProps, nextState) {
    // debugger
    // return true
  // }
  
  componentWillReceiveProps (nextProps) {
    if (!_.isEqual(this.props.mainMap.coords, nextProps.mainMap.coords)) {
      nextProps.getMainMapVisibleVenues(
        nextProps.venues,
        nextProps.regions,
        nextProps.mainMap.coords,
        nextProps.fetchVenueDetail,
        nextProps.history
      )
    }
  }

  handleMapChange = coords => {
    // console.log('handleMapChange:', coords)
    // update the maps size if the coords size has changed:
    if (!_.isEqual(this.props.mainMap.coords.size, coords.size)) {
      this.props.updateMainMapSize(coords.size)
    }
    // console.log(coords)
    // coords.marginCenter = coords.center

    this.props.setMainMap(coords)

    this.props.getMainMapVisibleVenues(
      this.props.venues,
      this.props.regions,
      this.props.mainMap.coords,
      this.props.fetchVenueDetail,
      this.props.history
    )
  }
  handleMapClick = props => {
    // props = {x, y, lat, lng, event}
    if (this.props.hoveredVenue) {
      this.props.clearMarkers()
    }
  }
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
        <MBounder key={key} title={key} lat={mBounder.lat} lng={mBounder.lng} />
      ))
    }
  }
  debugRegionBounds = () => {
    if (!_.isEmpty(this.props.regions)) {
      return _.map(this.props.regions, (region, key) => {
        const regionDebugger = []
        if (!_.isEmpty(region.bounds) && !_.isEmpty(region.bounds.ne)) {
          regionDebugger.push(<MBounder
            key='r-ne'
            title='r-ne'
            lat={region.bounds.ne.lat}
            lng={region.bounds.ne.lng}
          />)
        }
        if (!_.isEmpty(region.bounds) && !_.isEmpty(region.bounds.nw)) {
          regionDebugger.push(<MBounder
            key='r-nw'
            title='r-nw'
            lat={region.bounds.nw.lat}
            lng={region.bounds.nw.lng}
          />)
        }
        if (!_.isEmpty(region.bounds) && !_.isEmpty(region.bounds.sw)) {
          regionDebugger.push(<MBounder
            key='r-sw'
            title='r-sw'
            lat={region.bounds.sw.lat}
            lng={region.bounds.sw.lng}
          />)
        }
        if (!_.isEmpty(region.bounds) && !_.isEmpty(region.bounds.se)) {
          regionDebugger.push(<MBounder
            key='r-se'
            title='r-se'
            lat={region.bounds.se.lat}
            lng={region.bounds.se.lng}
          />)
        }
        return regionDebugger
      })
    }
  }
  debugMarginCenter = () => {
    if (
      this.props.mainMap &&
      this.props.mainMap.coords &&
      this.props.mainMap.coords.marginCenter
    ) {
      return (
        <MBounder
          key='center'
          title='center'
          lat={this.props.mainMap.coords.marginCenter.lat}
          lng={this.props.mainMap.coords.marginCenter.lng}
        />
      )
    }
  }
  debugRegionCenter = () => {
    if (!_.isEmpty(this.props.regions)) {
      return _.map(this.props.regions, (region, key) => {
        const regionDebugger = []
        // console.log(region)
        if (!_.isEmpty(region.calcCenter)) {
          regionDebugger.push(<MBounder
            key='r-center'
            title='r-center'
            lat={region.calcCenter.lat}
            lng={region.calcCenter.lng}
          />)
        }
        return regionDebugger
      })
    }
  }
  render () {
    if (!(this.props.mainMap && this.props.mainMap.coords)) {
      return <div>Loading...</div>
    }
    const center = this.props.mainMap.coords.center ? this.props.mainMap.coords.center : {lat: 38.1510752, lng: -95.8457796}
    return (
      <GoogleMapReact
        zoom={this.props.mainMap.coords.zoom}
        center={center}
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
        {/* {this.debugMarginBounds()}
        {this.debugMarginCenter()}
        {this.debugRegionCenter()}
        {this.debugRegionBounds()} */}
      </GoogleMapReact>
    )
  }
}

function mapStateToProps ({ ui, regions, venues, mainMap }) {
  return { ui, regions, venues, mainMap }
}

export default connect(mapStateToProps, actions)(Map)
