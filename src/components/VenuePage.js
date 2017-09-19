import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'
import './VenuePage.css'
import objectFunctions from '../lib/ObjectFunctions'
import { reduceVenuesByRegion } from '../lib/myHelpers'

class VenuePage extends Component {
  constructor () {
    super()
    this.state = {
      nextSlug: '',
      prevSlug: ''
    }
  }
  componentWillMount () {
    const { venues, venueId, googlePlacesId, regionSlug } = this.props

    // get the venue detail
    this.props.fetchVenueDetail(venueId, googlePlacesId)

    // reduce the venues by region and then get the next and previous venues:
    const reduced = reduceVenuesByRegion(venues, venues[venueId].regionId)
    const nextId = objectFunctions.keys.next(reduced, venueId)
    const prevId = objectFunctions.keys.previous(reduced, venueId)

    this.setState({
      nextSlug: '/' + regionSlug + '/' + venues[nextId].slug,
      prevSlug: '/' + regionSlug + '/' + venues[prevId].slug
    })
  }
  handlePrevious = () => {
    this.props.history.push(this.state.prevSlug)
  }
  handleNext = () => {
    this.props.history.push(this.state.nextSlug)
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
          <Link to={`/${this.props.regionSlug}`} className='VenuePage__close' />
          <div className='btn-group-sm'>
            <button
              onClick={this.handlePrevious}
              className='btn btn-primary btn-sm'
            >
              Previous Spot
            </button>
            <button
              onClick={this.handleNext}
              className='btn btn-primary btn-sm'
            >
              Next Spot
            </button>
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

function mapStateToProps ({ venues, regions }) {
  return { venues, regions }
}

export default connect(mapStateToProps, actions)(VenuePage)
