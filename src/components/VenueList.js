import React, { Component } from 'react'
import VenueListItem from './VenueListItem'
import { connect } from 'react-redux'
import * as actions from '../actions'

class VenueList extends Component {
  render () {
    return (
      <div className='VenueList'>
        <h2>
          VenueList
        </h2>
        {this.props.venues.map((venue, key) => (
          <VenueListItem
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
