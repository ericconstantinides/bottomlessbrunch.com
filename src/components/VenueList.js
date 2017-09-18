import React, { Component } from 'react'
import VenueTeaser from './VenueTeaser'
import { connect } from 'react-redux'
import * as actions from '../actions'

class VenueList extends Component {
  handleMouseOver = id => event => {
    this.props.showInfoVenue(id)
  }
  handleMouseLeave = id => event => {
    this.props.hideInfoVenue(id)
  }
  handleClick = id => event => {
    this.props.openVenue(id)
  }
  
  render () {
    return (
      <div className='VenueList'>
        {this.props.venues.map((venue, key) => (
          <VenueTeaser
            key={key}
            altClass='VenueListItem'
            handleMouseOver={this.handleMouseOver}
            handleMouseLeave={this.handleMouseLeave}
            handleClick={this.handleClick}
            venue={venue}
          />
        ))}
      </div>
    )
  }
}

function mapStateToProps ({ venues }) {
  return { venues }
}

export default connect(mapStateToProps, actions)(VenueList)
