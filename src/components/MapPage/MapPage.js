import React, { Component } from 'react'
import { connect } from 'react-redux'
// import * as viewportUnitsBuggyfill from 'viewport-units-buggyfill'
import _ from 'lodash'

import * as actions from '../../actions'
import { DRAWER } from '../../config'

import SiteHeader from '../common/SiteHeader'
import Map from './Map'
import VenueList from './VenueList'

class MapPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hoveredVenue: '',
    }
  }
  componentDidMount () {
    document.documentElement.classList.add('html--MapPage')
    document.body.classList.add('body--MapPage')
    this.props.addUiAppClass(['App--MapPage'])
    // viewportUnitsBuggyfill.init()
  }
  componentDidUpdate (prevProps, prevState) {
    console.log('cdu: MapPage.js')
    // put the venueList back at the top for a new region:
    if (prevProps.ui.activeRegion._id !== this.props.ui.activeRegion._id) {
      this.refs.dragItem.scrollTop = 0
    }
  }
  
  componentWillUnmount () {
    document.documentElement.classList.remove('html--MapPage')
    document.body.classList.remove('body--MapPage')
    this.props.removeUiAppClass(['App--MapPage'])
  }
  handleRegionsModalClick = () => {
    this.props.showUiRegionsModal()
  }
  handleLogoClick = () => {
    this.props.unsetMainMap()
    this.props.history.push('/')
  }
  handleMouseOver = venue => event => {
    if (this.props.mainMap.size.width > DRAWER.sm.ends) {
      this.setState({ hoveredVenue: venue._id })
    }
  }
  handleMouseLeave = venue => event => {
    if (this.props.mainMap.size.width > DRAWER.sm.ends) {
      this.setState({ hoveredVenue: '' })
    }
  }
  toggleMarkerClick = venue => event => {
    // I NEED TO MOVE THE MAP AROUND TO DISPLAY THE HOVERED MARKER THE BEST
    this.setState((prevState, props) => {
      if (prevState.hoveredVenue === venue._id) {
        return { hoveredVenue: '' }
      }
      return { hoveredVenue: venue._id }
    })
  }
  clearMarkers = () => {
    this.setState({ hoveredVenue: '' })
  }
  handleScroll = e => {
    const { dragItem, linkedDragItem, linkedDragItemInner } = this.refs
    const { scrollTop } = dragItem
    linkedDragItem.style.transform =
      'translate3d(0,' + -scrollTop + 'px, 0)'
    linkedDragItemInner.style.transform =
      'translate3d(0,' + (scrollTop / 2) + 'px, 0)'
  }

  render () {
    if (_.isEmpty(this.props.regions) || _.isEmpty(this.props.venues)) {
      return <div>Loading...</div>
    }
    // const region = this.props.ui.activeRegion
    const styles = { height: `100%`, width: `100%` }
    return (
      <div className='MapPage'>
        <SiteHeader
          region={this.props.ui.activeRegion}
          regions={this.props.regions}
          regionTitle={this.props.mainMap.regionTitle}
          regionReset={this.props.mainMap.regionReset}
          handleLogoClick={this.handleLogoClick}
          handleRegionsModalClick={this.handleRegionsModalClick}
          visibleRegions={this.props.visibleRegions}
        />
        <div
          className='MapPage__inner'
          ref='dragItem'
          onScroll={this.handleScroll}
        >
          <div
            className='MapPage__Map-container'
            ref='linkedDragItem'
          >
            <div
              className='MapPage__Map-inner-container'
              ref='linkedDragItemInner'
            >
              <Map
                venues={this.props.venues}
                handleMouseOver={this.handleMouseOver}
                handleMouseLeave={this.handleMouseLeave}
                toggleMarkerClick={this.toggleMarkerClick}
                clearMarkers={this.clearMarkers}
                hoveredVenue={this.state.hoveredVenue}
                containerElement={<div style={styles} />}
                mapElement={<div style={styles} />}
                history={this.props.history}
              />
            </div>
          </div>
          <div className='VenueList__spacer' />
          <VenueList
            history={this.props.history}
            region={this.props.ui.activeRegion._id}
            handleMouseOver={this.handleMouseOver}
            handleMouseLeave={this.handleMouseLeave}
            toggleMarkerClick={this.toggleMarkerClick}
            hoveredVenue={this.state.hoveredVenue}
            dragState={this.state.dragItemPressed}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ regions, venues, ui, mainMap }) {
  return { regions, venues, ui, mainMap, visibleRegions: mainMap.visibleRegionsObj }
}

export default connect(mapStateToProps, actions)(MapPage)
