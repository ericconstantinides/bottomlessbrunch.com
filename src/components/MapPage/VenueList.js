import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { reduceVenuesByRegion } from '../../lib/myHelpers'
import * as actions from '../../actions'

// import Logo from '../common/Logo'
import VenueTeaser from './VenueTeaser'

class VenueList extends Component {
  componentDidUpdate (prevProps, prevState) {
    // put the venueList back at the top for a new region:
    if (prevProps.ui.activeRegion._id !== this.props.ui.activeRegion._id) {
      this.refs.VenueList.scrollTop = 0
    }
  }
  renderTeasers = () => {
    const reduced = reduceVenuesByRegion(
      this.props.venues,
      this.props.ui.activeRegion._id
    )
    const sorted = _.sortBy(reduced, venue => venue.name)
    return _.map(sorted, venue => {
      return (
        <VenueTeaser
          key={venue._id}
          altClass='VenueListItem'
          handleMouseOver={this.props.handleMouseOver}
          handleMouseLeave={this.props.handleMouseLeave}
          toggleMarkerClick={this.props.toggleMarkerClick}
          hoveredVenue={this.props.hoveredVenue}
          venue={venue}
          regionName={this.props.regions[venue.regionId].name}
          regionSlug={this.props.regions[venue.regionId].slug}
        />
      )
    })
  }
  // handleRegionsModalClick = () => {
  //   this.props.showUiRegionsModal()
  // }
  // handleLogoClick = () => {
  //   this.props.unsetUiVenue()
  //   this.props.unsetUiRegion()
  //   this.props.history.push('/')
  // }
  render () {
    const style = this.props.drawerSmoothScroll
      ? {
        WebkitOverflowScrolling: 'touch',
        overflowY: 'scroll'
      }
      : {}
    return (
      <div
        className='VenueList'
        ref='VenueList'
        onScroll={this.props.handleScroll}
        onTouchMove={this.props.handleScroll}
        style={style}
      >
        {/* <Logo
          handleLogoClick={this.handleLogoClick}
          handleRegionsModalClick={this.handleRegionsModalClick}
          region={this.props.ui.activeRegion}
        /> */}
        {this.renderTeasers()}
      </div>
    )
  }
}

function mapStateToProps ({ regions, venues, ui }) {
  return { regions, venues, ui }
}

export default connect(mapStateToProps, actions)(VenueList)
