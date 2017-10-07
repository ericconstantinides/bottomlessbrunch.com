import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Star from 'react-stars'

import objectFunctions from '../../lib/ObjectFunctions'
import { reduceVenuesByRegion, roundHalf } from '../../lib/myHelpers'
import * as actions from '../../actions'

import './VenuePage.css'

class VenuePage extends Component {
  constructor () {
    super()
    this.state = {
      nextSlug: '',
      prevSlug: ''
    }
  }
  componentWillMount () {
    const { venue, venues, venueId, regionSlug } = this.props

    // get the venue detail
    this.props.fetchGooglePlacesVenueDetail(venue)

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
    // only go here if we have data:
    let hours = ''
    if (_.has(venue.googePlacesData, 'opening_hours')) {
      hours = venue.googePlacesData.opening_hours.weekday_text.map((day, i) => {
        const [weekday, ...rest] = day.split(' ')
        return (
          <p key={i} className='VenuePage__day'>
            <strong>{weekday}</strong> {rest}
          </p>
        )
      })
    }
    if (!venue.googePlacesData) venue.googePlacesData = {}
    const address = venue.googePlacesData.adr_address
    let photos = ''
    if (venue.googePlacesData.photos) {
      photos = venue.googePlacesData.photos
        .map(photo => photo.getUrl({ maxWidth: 800, maxHeight: 500 }))
        .map((photoUrl, i) => (
          <img key={i} className='VenuePage__hero' src={photoUrl} alt='' />
        ))
    }
    return (
      <div className='VenuePage'>
        <div className='VenuePage__inner'>
          <Link to={`/${this.props.regionSlug}`} className='VenuePage__close' />
          <div className='VenuePage__hero-container'>
            <div className='VenuePage__hero-content'>
              <h1 className='VenuePage__title'>{venue.name}</h1>
              <Star
                className='VenuePage__rating'
                size={30}
                value={roundHalf(venue.googePlacesData.rating)}
                edit={false}
              />
            </div>
            {photos}
          </div>
          <div className='VenuePage__left-col'>
            <p
              className='VenuePage__address'
              dangerouslySetInnerHTML={{ __html: address }}
            />
            {hours}
          </div>
          <div className='VenuePage__nav btn-group-sm'>
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
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ venues, regions }) {
  return { venues, regions }
}

export default connect(mapStateToProps, actions)(VenuePage)
