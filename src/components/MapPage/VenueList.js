import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { reduceVenuesByRegion } from '../../lib/myHelpers'
import * as actions from '../../actions'

import VenueTeaser from './VenueTeaser'

class VenueList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      slideState: {}
    } 
  }
  renderTeasers = () => {
    const reduced = reduceVenuesByRegion(
      this.props.venues,
      this.props.ui.activeRegion._id
    )
    const sorted = _.sortBy(reduced, venue => venue.name.toUpperCase())
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
  render () {
    return (
      <div className='VenueList layout__sidebar-width'>
        <div className='VenueList__handle'>
          <div className='VenueList__inner-handle' />
        </div>
        {this.renderTeasers()}
      </div>
    )
  }
}

function mapStateToProps ({ regions, venues, ui }) {
  return { regions, venues, ui }
}

export default connect(mapStateToProps, actions)(VenueList)
