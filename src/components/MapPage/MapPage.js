import React, { Component } from 'react'
import { connect } from 'react-redux'
import Swipeable from 'react-swipeable'
// import * as viewportUnitsBuggyfill from 'viewport-units-buggyfill'
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
  componentDidMount () {
    document.documentElement.classList.add('html--MapPage')
    document.body.classList.add('body--MapPage')
    this.props.addUiAppClass(['App--MapPage'])
    // viewportUnitsBuggyfill.init()
  }
  componentWillUnmount() {
    document.documentElement.classList.remove('html--MapPage')
    document.body.classList.remove('body--MapPage')
    this.props.removeUiAppClass(['App--MapPage'])
  }
  // handleSelectChange = selected => {
  //   this.props.setUiRegion(
  //     this.props.regions[selected.value],
  //     this.props.history
  //   )
  // }
  handleRegionsModalClick = () => {
    this.props.showUiRegionsModal()
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
    this.setState({
      hoveredVenue: venue._id
    })
  }
  handleMouseLeave = venue => event => {
    this.setState({ hoveredVenue: '' })
  }
  toggleMarkerClick = venue => event => {
    // I NEED TO MOVE THE MAP AROUND TO DISPLAY THE HOVERED MARKER THE BEST
    this.setState((prevState, props) => {
      if (prevState.hoveredVenue === venue._id) {
        return {hoveredVenue: ''}
      }
      return { hoveredVenue: venue._id }
    })
  }
  clearMarkers = () => {
    this.setState({hoveredVenue: ''})
  }
  render () {
    if (_.isEmpty(this.props.regions) || _.isEmpty(this.props.venues)) {
      return <div>Loading...</div>
    }
    // const region = this.props.ui.activeRegion
    const styles = { height: `100%`, width: `100%` }
    const drawerState = this.state.drawerOpen ? 'is-open' : 'is-closed'
    return (
      <div className='MapPage'>
        <div className='MapPage__Map-container'>
          <Map
            venues={this.props.venues}
            handleMouseOver={this.handleMouseOver}
            handleMouseLeave={this.handleMouseLeave}
            toggleMarkerClick={this.toggleMarkerClick}
            clearMarkers={this.clearMarkers}
            hoveredVenue={this.state.hoveredVenue}
            containerElement={<div style={styles} />}
            mapElement={<div style={styles} />}
          />
        </div>
        <div
          className={`MapPage__VenueList-container MapPage__VenueList--width ${drawerState}`}
          style={{transform: `translateY(${this.state.drawerVertOffset}px)`}}
        >
          <Logo
            region={this.props.ui.activeRegion}
            handleLogoClick={this.handleLogoClick}
            handleRegionsModalClick={this.handleRegionsModalClick}
          />
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
            history={this.props.history}
            handleScroll={this.handleVenueListScroll}
            region={this.props.ui.activeRegion._id}
            handleMouseOver={this.handleMouseOver}
            handleMouseLeave={this.handleMouseLeave}
            toggleMarkerClick={this.toggleMarkerClick}
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
