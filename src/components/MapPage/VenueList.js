import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import { constructFilters } from '../../actions/filterActions'

import VenueTeaser from './VenueTeaser'
import VenueFilters from './VenueFilters'

class VenueList extends Component {
  componentDidUpdate (prevProps, prevState) {
    // console.log('cdu: VenueList')
  }
  componentWillReceiveProps (nextProps) {
    if (
      !_.isEqual(
        this.props.mainMap.activeVenues,
        nextProps.mainMap.activeVenues
      )
    ) {
      this.refs.VenueList.scrollTop = 0
    }
  }
  handleFilterReset = () => {
    this.props.constructFilters(
      this.props.venues,
      this.props.mainMap.activeVenues
    )
  }
  render () {
    const hasUnfilteredVenues = !this.props.mainMap.activeVenues.every(
      ven => ven.filtered
    )
    return (
      <div
        className='VenueList layout__sidebar-width layout__transparency-bg'
        ref='VenueList'
      >
        <div className='VenueList__handle'>
          <div className='VenueList__inner-handle' />
        </div>
        {this.props.hasVenues && <VenueFilters />}
        {this.props.mainMap.activeVenues.map(({ _id, filtered }) => (
          <VenueTeaser
            key={_id}
            altClass='VenueListItem'
            handleMouseOver={this.props.handleMouseOver}
            handleMouseLeave={this.props.handleMouseLeave}
            toggleMarkerClick={this.props.toggleMarkerClick}
            hoveredVenue={this.props.hoveredVenue}
            venue={this.props.venues[_id]}
            filtered={filtered}
            regionSlug={
              this.props.regions[this.props.venues[_id].regionId].slug
            }
            handleVenueTeaserLinkClick={this.props.handleVenueTeaserLinkClick}
          />
        ))}
        {!hasUnfilteredVenues &&
          this.props.hasVenues &&
          <div className='VenueFilters__empty'>
            <p>All Venues filtered out</p>
            <span
              onClick={this.handleFilterReset}
              className='button button--orange-black is-smaller'
            >
              Reset Filters
            </span>
          </div>}
        {!hasUnfilteredVenues &&
          !this.props.hasVenues &&
          this.props.mainMap.coords.zoom >
            this.props.ui.drawer.show_venues_zoom_level &&
            <div className='VenueFilters__empty'>
              <p>No venues visible</p>
              {Object.entries(
              this.props.mainMap.visibleRegionsObj
            ).map(([_id, reg]) => (
              <span
                key={_id}
                onClick={this.props.handleRegionSelect(_id)}
                className='button button--orange-black is-smaller'
              >
                Re-Center {reg.name}
              </span>
            ))}
            </div>}
      </div>
    )
  }
}

function mapStateToProps ({ regions, venues, ui, mainMap }) {
  return { regions, venues, ui, mainMap }
}

export default connect(mapStateToProps, { constructFilters })(VenueList)
