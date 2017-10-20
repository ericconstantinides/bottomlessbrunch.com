import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { reduceVenuesByRegion } from '../../lib/myHelpers'
import * as actions from '../../actions'

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
    return _.map(reduced, venue => {
      return (
        <VenueTeaser
          key={venue._id}
          altClass='VenueListItem'
          handleMouseOver={this.props.handleMouseOver}
          handleMouseLeave={this.props.handleMouseLeave}
          hoveredVenue={this.props.hoveredVenue}
          venue={venue}
          regionName={this.props.regions[venue.regionId].name}
          regionSlug={this.props.regions[venue.regionId].slug}
        />
      )
    })
  }

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
        {this.renderTeasers()}
      </div>
    )
  }
}

function mapStateToProps ({ regions, venues, ui }) {
  return { regions, venues, ui }
}

export default connect(mapStateToProps, actions)(VenueList)
