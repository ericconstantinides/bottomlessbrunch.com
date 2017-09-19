import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'
import './VenuePage.css'

class VenuePage extends Component {
  componentDidMount () {
    this.props.fetchVenueDetail(this.props.venueId, this.props.placeId)
  }
  render () {
    const venue = this.props.venues[this.props.venueId]
    if (!venue.googePlacesData) venue.googePlacesData = {}
    console.log(venue.googePlacesData)
    return (
      <div className='VenuePage'>
        <div className='VenuePage__inner'>
          <Link to='/'
            className='VenuePage__close'
          />
          <h1>
            {venue.name} <br />
            {venue.googePlacesData.formatted_phone_number}
          </h1>
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ venues }) {
  return { venues }
}

export default connect(mapStateToProps, actions)(VenuePage)
