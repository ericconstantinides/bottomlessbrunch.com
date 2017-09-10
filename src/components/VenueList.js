import React, { Component } from 'react'
import Venue from './Venue'
import { connect } from 'react-redux'
import * as actions from '../actions'

class VenueList extends Component {
  componentWillMount () {
    // get the venues
    this.props.fetchVenues()
  }
  render () {
    return (
      <div className='VenueList'>
        <h2>
          VenueList
        </h2>
        {this.props.venues.map((venue, key) => <Venue {...venue} key={key} />)}
      </div>
    )
  }
}

function mapStateToProps ({venues}) {
  return { venues }
}

export default connect(mapStateToProps, actions)(VenueList)
