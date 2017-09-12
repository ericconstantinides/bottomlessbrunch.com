import React, { Component } from 'react'
import VenueListItem from './VenueListItem'
import { connect } from 'react-redux'
import * as actions from '../actions'

class VenueList extends Component {
  render () {
    return (
      <div className='VenueList'>
        {this.props.venues.map((venue, key) => (
          <VenueListItem
            showInfoVenue={this.props.showInfoVenue}
            hideInfoVenue={this.props.hideInfoVenue}
            openVenue={this.props.openVenue}
            key={key}
            {...venue}
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
