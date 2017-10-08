import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { reduceVenuesByRegion } from '../../lib/myHelpers'
import * as actions from '../../actions'

import VenueTeaser from './VenueTeaser'

class VenueList extends Component {
  handleMouseOver = venue => event => {
    this.props.hoverVenueUi(venue)
  }
  handleMouseLeave = venue => event => {
    this.props.hoverVenueUi()
  }
  renderTeasers = () => {
    const reduced = reduceVenuesByRegion(
      this.props.venues,
      this.props.ui.region
    )
    return _.map(reduced, venue => {
      return (
        <VenueTeaser
          key={venue._id}
          altClass='VenueListItem'
          handleMouseOver={this.handleMouseOver}
          handleMouseLeave={this.handleMouseLeave}
          venue={venue}
          regionName={this.props.regions[venue.regionId].name}
          hoveredId={this.props.ui.venueHover._id}
          regionSlug={this.props.regions[venue.regionId].slug}
        />
      )
    })
  }

  render () {
    return (
      <div className='VenueList'>
        {this.renderTeasers()}
      </div>
    )
  }
}

function mapStateToProps ({ regions, venues, ui }) {
  return { regions, venues, ui }
}

export default connect(mapStateToProps, actions)(VenueList)
