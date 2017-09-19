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
    const address = venue.googePlacesData.adr_address
    let photo = '#'
    if (venue.googePlacesData.photos) {
      photo = venue.googePlacesData.photos['0'].getUrl({
        maxWidth: 800,
        maxHeight: 500
      })
    }
    return (
      <div className='VenuePage'>
        <div className='VenuePage__inner'>
          <Link to='/' className='VenuePage__close' />
          <div className='btn-group-sm'>
            <button className='btn btn-primary btn-sm'>Previous</button>
            <button className='btn btn-primary btn-sm'>Next</button>
          </div>
          <img src={photo} alt='' />
          <h1>
            {venue.name} <br />
          </h1>
          <div dangerouslySetInnerHTML={{ __html: address }} />
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ venues }) {
  return { venues }
}

export default connect(mapStateToProps, actions)(VenuePage)
