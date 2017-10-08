import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Star from 'react-stars'

import objectFunctions from '../../lib/ObjectFunctions'
import {
  reduceVenuesByRegion,
  roundHalf,
  compileGoogleHours
} from '../../lib/myHelpers'
import * as actions from '../../actions'

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
    const hours = compileGoogleHours(venue.googlePlacesData)
    if (hours) {
      console.log(hours)
    }
    if (!venue.googlePlacesData) venue.googlePlacesData = {}
    const address = venue.googlePlacesData.adr_address
    let photos = ''
    let bgStyle = ''
    if (venue.googlePlacesData.photos) {
      photos = venue.googlePlacesData.photos
        .map(photo => photo.getUrl({ maxWidth: 800, maxHeight: 500 }))
        .map((photoUrl, i) => (
          <img key={i} className='VenuePage__hero' src={photoUrl} alt='' />
        ))
      bgStyle =
        'url(' +
        venue.googlePlacesData.photos[0].getUrl({
          maxWidth: 1920,
          maxHeight: 1080
        }) +
        ')'
    }
    const regionName = this.props.regions[venue.regionId].name
    return (
      <div className='VenuePage'>
        <div className='VenuePage__inner'>
          <div className='VenuePage__bg' style={{ backgroundImage: bgStyle }} />
          <Link to={`/${this.props.regionSlug}`} className='VenuePage__close' />
          <h1 className='VenuePage__title'>{venue.name}</h1>
          <h2 className='VenuePage__sub-title'>{regionName}</h2>
          <div className='VenuePage__ratings'>
            {venue.googlePlacesData && venue.googlePlacesData.rating &&
              <div className='VenuePage__ratings-item'>
                <h2 className='VenuePage__ratings-title'>Google</h2>
                <Star
                  className='VenuePage__ratings-stars'
                  size={20}
                  value={roundHalf(venue.googlePlacesData.rating)}
                  edit={false}
                />
              </div>
            }
            {venue.yData && venue.yData.rating &&
              <div className='VenuePage__ratings-item'>
                <h2 className='VenuePage__ratings-title'>Yelp</h2>
                <Star
                  className='VenuePage__ratings-stars'
                  size={20}
                  value={roundHalf(venue.yData.rating)}
                  edit={false}
                />
              </div>
            }
          </div>
          {/* {photos} */}
          <div className='VenuePage__left-col'>
            <p
              className='VenuePage__address'
              dangerouslySetInnerHTML={{ __html: address }}
            />
            {hours && hours.map((item, i) => (
              <p key={i} className='VenuePage__day'>
                <strong>{item.weekday}:</strong> {item.time}
              </p>
            ))}
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
