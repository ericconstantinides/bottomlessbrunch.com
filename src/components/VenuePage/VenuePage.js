import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Star from 'react-stars'

import objectFunctions from '../../lib/ObjectFunctions'
import {
  reduceVenuesByRegion,
  roundHalf,
  compileGoogleHours,
  compileDays
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
  handlePrev = () => {
    this.props.history.push(this.state.prevSlug)
  }
  handleNext = () => {
    this.props.history.push(this.state.nextSlug)
  }
  render () {
    const venue = this.props.venues[this.props.venueId]
    // only go here if we have data:
    const hours = compileGoogleHours(venue.googlePlacesData)
    if (!venue.googlePlacesData) venue.googlePlacesData = {}
    let photos = ''
    let bgStyle = ''
    if (venue.googlePlacesData.photos) {
      photos = venue.googlePlacesData.photos
        .map(photo => photo.getUrl({ maxWidth: 800, maxHeight: 500 }))
        .map((photoUrl, i) => (
          <img key={i} className='VenuePage__image' src={photoUrl} alt='' />
        ))
      bgStyle =
        'url(' +
        venue.googlePlacesData.photos[0].getUrl({
          maxWidth: 1920,
          maxHeight: 1080
        }) +
        ')'
    }
    console.log(venue)
    const funTimes = compileDays(
      venue.funTimes,
      'Bottomless Brunch',
      venue.name
    )
    const regionName = this.props.regions[venue.regionId].name
    const displayHood = venue.neighborhood
      ? venue.neighborhood
      : venue.address.city
    return (
      <div className='VenuePage'>
        <div className='VenuePage__inner'>
          <div className='VenuePage__bg' style={{ backgroundImage: bgStyle }} />
          <Link to={`/${this.props.regionSlug}`} className='VenuePage__close'>
            <span className='VenuePage__inner-close'>+</span>
          </Link>
          <h1 className='VenuePage__title'>{venue.name}</h1>
          <h2 className='VenuePage__sub-title'>{displayHood}</h2>
          <div className='VenuePage__ratings'>
            {venue.googlePlacesData &&
              venue.googlePlacesData.rating &&
              <div className='VenuePage__ratings-item'>
                <h3 className='VenuePage__ratings-title'>Google</h3>
                <Star
                  className='VenuePage__ratings-stars'
                  size={15}
                  value={roundHalf(venue.googlePlacesData.rating)}
                  edit={false}
                />
              </div>}
            {venue.yData &&
              venue.yData.rating &&
              <div className='VenuePage__ratings-item'>
                <h3 className='VenuePage__ratings-title'>Yelp</h3>
                <Star
                  className='VenuePage__ratings-stars'
                  size={15}
                  value={roundHalf(venue.yData.rating)}
                  edit={false}
                />
              </div>}
          </div>
          <div className='VenuePage__top-meta'>
            <div className='VenuePage__address'>
              <h3 className='VenuePage__address-title'>Address</h3>
              <p className='VenuePage__address-p'>
                {venue.address.street}<br />
                {venue.address.city}<br />
                {venue.phone}
              </p>
            </div>
            <div className='VenuePage__hours'>
              <h3 className='VenuePage__hours-title'>Hours</h3>
              {hours &&
                hours.map((item, i) => (
                  <p key={i} className='VenuePage__hours-p'>
                    <strong>{item.weekday}:</strong> {item.time}
                  </p>
                ))}
            </div>
          </div>
          <div className='VenuePage__middle'>
            <div className='VenuePage__middle-left'>
              <div className='VenuePage__middle-meta'>
                <h4 className='VenuePage__middle-meta-title'>
                  Outside Seating
                </h4>
                <p className='VenuePage__middle-meta-p'>
                  Yes
                </p>
              </div>
              <div className='VenuePage__middle-meta'>
                <h4 className='VenuePage__middle-meta-title'>
                  Takes Reservations
                </h4>
                <p className='VenuePage__middle-meta-p'>
                  Yes
                </p>
              </div>
              <div className='VenuePage__middle-meta'>
                <h4 className='VenuePage__middle-meta-title'>
                  Full Bar?
                </h4>
                <p className='VenuePage__middle-meta-p'>
                  Yes
                </p>
              </div>
              <div className='VenuePage__middle-meta'>
                <h4 className='VenuePage__middle-meta-title'>
                  Cuisine
                </h4>
                <p className='VenuePage__middle-meta-p'>
                  Yes
                </p>
              </div>
            </div>
            <div className='VenuePage__middle-center'>
              {funTimes &&
                <div className='VenuePage__middle-center-top'>
                  <h3 className='VenuePage__middle-title'>
                    Go Bottomless
                  </h3>
                  {funTimes.map((fun, i) => (
                    <p key={i} className='VenuePage__middle-p'>
                      <strong>{fun.day}</strong> {fun.startTime} - {fun.endTime}
                    </p>
                  ))}
                </div>}
              <div className='VenuePage__middle-center-bottom'>
                <h3 className='VenuePage__middle-title'>
                  Bottomless Deals
                </h3>
              </div>
            </div>
            <div className='VenuePage__middle-right'>
              <h3 className='VenuePage__middle-title'>
                Share your brunch plans!
              </h3>
            </div>
          </div>
          <div className='VenuePage__image-container'>
            {photos}
          </div>
          <div className='VenuePage__prev' onClick={this.handlePrev}>
            <div className='VenuePage__inner-prev'>‹</div>
          </div>
          <div className='VenuePage__next' onClick={this.handleNext}>
            <div className='VenuePage__inner-next'>›</div>
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
