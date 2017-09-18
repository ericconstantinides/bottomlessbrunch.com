import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as actions from '../actions'
import VenueTeaser from './VenueTeaser'

class VenueList extends Component {
  handleMouseOver = venue => event => {
    this.props.hoverVenueUi(venue)
  }
  handleMouseLeave = venue => event => {
    this.props.hoverVenueUi()
  }
  handleClick = id => event => {
    this.props.openVenue(id)
  }
  renderTeasers = () => {
    const reduced = _.filter(this.props.venues, venue => {
      if (venue.regionId === this.props.ui.region) return venue
    })
    return _.map(reduced, venue => {
      return (
        <VenueTeaser
          key={venue.id}
          altClass='VenueListItem'
          handleMouseOver={this.handleMouseOver}
          handleMouseLeave={this.handleMouseLeave}
          handleClick={this.handleClick}
          venue={venue}
          hoveredId={this.props.ui.venueHover.id}
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
