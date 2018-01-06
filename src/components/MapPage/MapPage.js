import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import cx from 'classnames'

import * as actions from '../../actions'

import SiteHeader from '../common/SiteHeader'
import Map from './Map'
import VenueList from './VenueList'

class MapPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hoveredVenue: ''
    }
  }
  componentDidMount () {
    this.props.addUiAppClass(['App--MapPage'])
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount () {
    this.props.removeUiAppClass(['App--MapPage'])
    window.removeEventListener('scroll', this.handleScroll)
  }
  handleRegionsModalClick = () => {
    this.props.showUiRegionsModal()
  }
  handleLogoClick = () => {
    this.props.unsetMainMap()
    this.props.history.push('/')
  }
  handleMouseOver = venue => event => {
    if (this.props.ui.drawer.name !== 'sm') {
      this.setState({ hoveredVenue: venue._id })
    }
  }
  handleMouseLeave = venue => event => {
    if (this.props.ui.drawer.name !== 'sm') {
      this.setState({ hoveredVenue: '' })
    }
  }
  toggleMarkerClick = (venue, area) => event => {
    this.setState((prevState, props) => {
      // clear out the hoveredVenue from the map:
      if (prevState.hoveredVenue === venue._id || area === 'VenueListItem') {
        return { hoveredVenue: '' }
      }
      return { hoveredVenue: venue._id }
    })
  }
  clearMarkers = () => {
    this.setState({ hoveredVenue: '' })
  }
  handleScroll = e => {
    window.requestAnimationFrame(this.scrollLoop)
  }
  scrollLoop = () => {
    this.refs.linkedDragItem.style.transform =
      'translate3d(0,' + window.scrollY / 2 + 'px, 0)'
  }
  handleRegionSelect = _id => event => {
    // go to the region's coords (and then coords will set the slug)
    this.props.setMainMapByRegion(
      this.props.regions[_id],
      this.props.mainMap.coords,
      this.props.ui.drawer
    )
    // this.props.hideUiResetRegion()
    this.props.hideUiRegionsModal()
  }
  handleVenueTeaserLinkClick = _id => event => {
    const {
      mainMap: { activeVenues },
      venues,
      history
    } = this.props
    const visVenues = activeVenues.filter(({ filtered, visible }) => visible && !filtered)
    this.props.setUiVenueSliderPosition(_id, visVenues, venues, history)
  }
  render () {
    if (_.isEmpty(this.props.regions) || _.isEmpty(this.props.venues)) {
      return <div>Loading...</div>
    }
    // need to also check if it's within a region:
    const hasVenues =
      this.props.mainMap.activeVenues &&
      this.props.mainMap.activeVenues.length
    const hasVenuesClass = hasVenues ? 'has-venues' : 'no-venues'
    const styles = { height: `100%`, width: `100%` }

    return (
      <div className={cx('MapPage', hasVenuesClass)}>
        <SiteHeader
          regionTitle={this.props.mainMap.regionTitle}
          regionReset={this.props.mainMap.regionReset}
          handleLogoClick={this.handleLogoClick}
          handleRegionsModalClick={this.handleRegionsModalClick}
          handleRegionSelect={this.handleRegionSelect}
          regionResetButton={this.props.ui.regionResetButton}
        />
        <div className='MapPage__inner'>
          <div className='MapPage__Map-container' ref='linkedDragItem'>
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
                handleVenueTeaserLinkClick={this.handleVenueTeaserLinkClick}
                handleRegionSelect={this.handleRegionSelect}
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
            handleVenueTeaserLinkClick={this.handleVenueTeaserLinkClick}
            handleRegionSelect={this.handleRegionSelect}
            hasVenues={hasVenues}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ regions, venues, ui, mainMap }) {
  return {
    regions,
    venues,
    ui,
    mainMap,
    visibleRegions: mainMap.visibleRegionsObj
  }
}

export default connect(mapStateToProps, actions)(MapPage)
