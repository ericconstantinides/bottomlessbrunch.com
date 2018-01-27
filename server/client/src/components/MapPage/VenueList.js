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
    // check to see how many are actual vs what's possible
    let actual = 0
    let possible = 0
    this.props.mainMap.activeVenues.forEach(venue => {
      actual = venue.visible && !venue.filtered ? actual + 1 : actual
      possible = venue.visible ? possible + 1 : possible
    })
    return (
      <div
        className='VenueList layout__sidebar-width layout__transparency-bg'
        ref='VenueList'
      >
        <div className='VenueList__handle'>
          <div className='VenueList__inner-handle' />
        </div>
        {this.props.hasVenues && <VenueFilters />}
        {this.props.mainMap.activeVenues.map(({ _id, filtered, visible }) => (
          <VenueTeaser
            key={_id}
            altClass='VenueListItem'
            handleMouseOver={this.props.handleMouseOver}
            handleMouseLeave={this.props.handleMouseLeave}
            toggleMarkerClick={this.props.toggleMarkerClick}
            hoveredVenue={this.props.hoveredVenue}
            venue={this.props.venues[_id]}
            filtered={filtered}
            visible={visible}
            regionSlug={
              this.props.regions[this.props.venues[_id].regionId].slug
            }
            handleVenueTeaserLinkClick={this.props.handleVenueTeaserLinkClick}
          />
        ))}
        {/* All Venues filtered out: */}
        {actual === 0 && possible > 0 &&
          this.props.hasVenues &&
          <div className='VenueFilters__empty'>
            <p>All restaurants filtered out</p>
            <span
              onClick={this.handleFilterReset}
              className='button button--orange-black is-smaller'
            >
              Reset Filters
            </span>
          </div>}
        {/* No venues visible: */}
        {possible === 0 &&
          this.props.mainMap.coords.zoom >
            this.props.ui.drawer.show_venues_zoom_level &&
            <div className='VenueFilters__empty'>
              <p>No restaurants visible</p>
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
