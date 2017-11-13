import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../actions'

import VenueTeaser from './VenueTeaser'

class VenueList extends Component {
  componentDidUpdate (prevProps, prevState) {
    // console.log('cdu: VenueList')
  }
  render () {
    return (
      <div className='VenueList layout__sidebar-width layout__transparency-bg'>
        <div className='VenueList__handle'>
          <div className='VenueList__inner-handle' />
        </div>
        {this.props.mainMap.visibleVenuesArr.map((id, index) => (
          <VenueTeaser
            key={id}
            altClass='VenueListItem'
            handleMouseOver={this.props.handleMouseOver}
            handleMouseLeave={this.props.handleMouseLeave}
            toggleMarkerClick={this.props.toggleMarkerClick}
            hoveredVenue={this.props.hoveredVenue}
            venue={this.props.venues[id]}
            regionName={
              this.props.regions[this.props.venues[id].regionId].name
            }
            regionSlug={
              this.props.regions[this.props.venues[id].regionId].slug
            }
            handleVenueTeaserLinkClick={this.props.handleVenueTeaserLinkClick}
          />
        ))}
      </div>
    )
  }
}

function mapStateToProps ({ regions, venues, ui, mainMap }) {
  return { regions, venues, ui, mainMap }
}

export default connect(mapStateToProps, actions)(VenueList)
