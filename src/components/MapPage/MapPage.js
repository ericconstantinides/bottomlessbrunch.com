import React, { Component } from 'react'
import { connect } from 'react-redux'
import Swipeable from 'react-swipeable'
import _ from 'lodash'

import * as actions from '../../actions'

import Logo from '../common/Logo'
import Map from './Map'
import VenueList from './VenueList'

class MapPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hoveredVenue: '',
      drawerOpen: false,
      drawerVertOffset: 0,
      drawerSmoothScroll: false
    }
  }
  handleSelectChange = selected => {
    this.props.setUiRegion(
      this.props.regions[selected.value],
      this.props.history
    )
  }
  handleLogoClick = () => {
    this.props.unsetUiVenue()
    this.props.unsetUiRegion()
    this.props.history.push('/')
  }
  openDrawer = () => {
    this.setState((prevState, props) => ({
      drawerOpen: true,
      drawerVertOffset: 0,
      drawerSmoothScroll: true
    }))
    setTimeout(() => {
      this.setState((prevState, props) => ({
        drawerSmoothScroll: true
      }))
    }, 1)
  }
  // close the drawer:
  handleSwipedDown = (e, deltaY, isFlick) => {
    this.setState((prevState, props) => ({
      drawerOpen: false,
      drawerVertOffset: 0,
      drawerSmoothScroll: false
    }))
  }
  // open the drawer:
  handleSwipedUp = (e, deltaY, isFlick) => {
    this.openDrawer()
  }
  // this on is only for looks
  handleSwiping = (e, deltaX, deltaY, absX, absY, velocity) => {
    const restrictedDeltaY = deltaY > 20 ? -20 : deltaY < -20 ? 20 : deltaY * -1
    this.setState((prevState, props) => ({
      drawerVertOffset: restrictedDeltaY
    }))
  }
  handleDrawerClick = () => {
    if (!this.state.drawerOpen) {
      this.openDrawer()
    } else {
      this.setState((prevState, props) => ({
        drawerOpen: false,
        drawerVertOffset: 0,
        drawerSmoothScroll: false
      }))
    }
  }
  handleVenueListScroll = (e) => {
    this.openDrawer()
  }
  handleMouseOver = venue => event => {
    this.setState({ hoveredVenue: venue._id })
  }
  handleMouseLeave = venue => event => {
    this.setState({ hoveredVenue: '' })
  }
  render () {
    if (_.isEmpty(this.props.regions) || _.isEmpty(this.props.venues)) {
      return <div>Loading...</div>
    }
    const region = this.props.regions[this.props.ui.region]
    const styles = { height: `100%`, width: `100%` }
    // cycle through the regions and filter out the ones without bounds
    let regionOptions = Object.entries(this.props.regions)
      .filter(([regionId, region]) => region.bounds)
      .map(([regionId, region]) => ({
        value: region._id,
        label: region.name
      }))
    const drawerState = this.state.drawerOpen ? 'is-open' : 'is-closed'
    return (
      <div className='MapPage'>
        <Logo
          /* subTitle={region.name} */
          region={this.props.ui.region}
          history={this.props.history}
          handleChange={this.handleSelectChange}
          options={regionOptions}
          handleLogoClick={this.handleLogoClick}
        />
        <div className='MapPage__Map-container'>
          <Map
            cursorPos={this.props.cursorPos}
            center={{ lat: region.lat, lng: region.lng }}
            zoom={region.zoom}
            minZoom={4}
            venues={this.props.venues}
            handleMouseOver={this.handleMouseOver}
            handleMouseLeave={this.handleMouseLeave}
            hoveredVenue={this.state.hoveredVenue}
            containerElement={<div style={styles} />}
            mapElement={<div style={styles} />}
          />
        </div>
        <div
          className={`MapPage__VenueList-container ${drawerState}`}
          style={{transform: `translateY(${this.state.drawerVertOffset}px)`}}
        >
          <Swipeable
            onSwiping={this.handleSwiping}
            onSwipedUp={this.handleSwipedUp}
            onSwipedDown={this.handleSwipedDown}
          >
            {/* stopPropagation */}
            {/* preventDefaultTouchmoveEvent */}
            {/* trackMouse */}
            <div
              onClick={this.handleDrawerClick}
              className='VenueList__handle'
              id='VenueList__handle'
            >
              <div className='VenueList__inner-handle' />
            </div>
          </Swipeable>
          <VenueList
            handleScroll={this.handleVenueListScroll}
            region={this.props.ui.region}
            handleMouseOver={this.handleMouseOver}
            handleMouseLeave={this.handleMouseLeave}
            hoveredVenue={this.state.hoveredVenue}
            drawerSmoothScroll={this.state.drawerSmoothScroll}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ regions, venues, ui }) {
  return { regions, venues, ui }
}

export default connect(mapStateToProps, actions)(MapPage)
