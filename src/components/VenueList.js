import React, { Component } from 'react'
import venuesJSON from '../content/venues.json'
import Venue from './Venue'

export default class VenueList extends Component {
  render () {
    return (
      <div className='VenueList'>
        <h2>
          VenueList
        </h2>
        {venuesJSON.map((venue, key) => <Venue {...venue} key={key} />)}
      </div>
    )
  }
}
