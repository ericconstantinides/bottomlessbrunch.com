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
  render () {
    return (
      <div className='VenueList layout__sidebar-width layout__transparency-bg'>
        <div className='VenueList__handle'>
          <div className='VenueList__inner-handle' />
        </div>
        {_.map(this.props.mainMap.visibleVenues, venue =>
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
        )}
      </div>
    )
  }
}

function mapStateToProps ({ regions, venues, ui, mainMap }) {
  return { regions, venues, ui, mainMap }
}

export default connect(mapStateToProps, actions)(VenueList)
