import React, { Component } from 'react'
import Star from 'react-stars'
import { ShareButtons, generateShareIcon } from 'react-share'
import { connect } from 'react-redux'
import cx from 'classnames'

import * as actions from '../../actions'
import { SITE_DOMAIN } from '../../config'
import { roundHalf, compileGoogleHours, compileDays } from '../../lib/myHelpers'

class VenueSliderItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: false
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({ isActive: nextProps.isActive })
  }
  renderBackground = venue => {
    if (!venue.googlePlacesData.photos || !venue.googlePlacesData.photos[0]) {
      return
    }
    return (
      'url(' +
      venue.googlePlacesData.photos[0].getUrl({
        maxWidth: 1920,
        maxHeight: 1080
      }) +
      ')'
    )
  }
  renderRatings = venue => (
    <div className='VenueSliderItem__ratings'>
      {venue.googlePlacesData &&
        venue.googlePlacesData.rating &&
        <div className='VenueSliderItem__ratings-item'>
          <h3 className='VenueSliderItem__ratings-title'>
            Google
          </h3>
          <Star
            className='VenueSliderItem__ratings-stars'
            size={15}
            value={roundHalf(venue.googlePlacesData.rating)}
            edit={false}
          />
        </div>}
      {venue.yData &&
        venue.yData.rating &&
        <div className='VenueSliderItem__ratings-item'>
          <h3 className='VenueSliderItem__ratings-title'>Yelp</h3>
          <Star
            className='VenueSliderItem__ratings-stars'
            size={15}
            value={roundHalf(venue.yData.rating)}
            edit={false}
          />
        </div>}
    </div>
  )
  renderAddress = venue => (
    <div className='VenueSliderItem__address'>
      <h3 className='VenueSliderItem__address-title'>
        Address
      </h3>
      {venue.address &&
        <p className='VenueSliderItem__address-p'>
          {venue.address.street}<br />
          {venue.address.city}<br />
          {venue.phone}<br />
          <a
            className='u-mt-1 button button--orange-black is-smaller'
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.name)}&destination_place_id=${venue.gpId}`}
            target='_blank'
          >
            Get Directions
          </a>
        </p>}
    </div>
  )
  renderRegHours = venue => {
    const hours = compileGoogleHours(venue.googlePlacesData)
    return (
      <div className='VenueSliderItem__hours'>
        <h3 className='VenueSliderItem__hours-title'>
          Regular Hours
        </h3>
        {hours &&
          hours.map((item, i) => (
            <p key={i} className='VenueSliderItem__hours-p'>
              <strong>{item.weekday}:</strong> {item.time}
            </p>
          ))}
      </div>
    )
  }
  renderMeta = venue => {
    const alcohol = !(venue.yMeta && venue.yMeta.alcohol)
      ? false
      : venue.yMeta.alcohol.replace(/&amp;/g, '&')
    const ambience = !(venue.yMeta && venue.yMeta.ambience)
      ? false
      : Array.isArray(venue.yMeta.ambience)
          ? venue.yMeta.ambience.length === 2
              ? venue.yMeta.ambience.join(' & ')
              : venue.yMeta.ambience.join(', ')
          : venue.yMeta.ambience
    return (
      <div className='VenueSliderItem__middle-left'>
        {venue.yMeta &&
          venue.yMeta.outdoorSeating &&
          <div className='VenueSliderItem__middle-meta'>
            <h4 className='VenueSliderItem__middle-meta-title'>
              Outside Seating
            </h4>
            <p className='VenueSliderItem__middle-meta-p'>
              {venue.yMeta.outdoorSeating ? 'Yes' : 'No'}
            </p>
          </div>}
        {venue.yMeta &&
          venue.yMeta.takesReservations &&
          <div className='VenueSliderItem__middle-meta'>
            <h4 className='VenueSliderItem__middle-meta-title'>
              Takes Reservations
            </h4>
            <p className='VenueSliderItem__middle-meta-p'>
              {venue.yMeta.takesReservations ? 'Yes' : 'No'}
            </p>
          </div>}
        {alcohol !== false &&
          <div className='VenueSliderItem__middle-meta'>
            <h4 className='VenueSliderItem__middle-meta-title'>
              Alcohol Served
            </h4>
            <p className='VenueSliderItem__middle-meta-p'>
              {alcohol}
            </p>
          </div>}
        {ambience !== false &&
          <div className='VenueSliderItem__middle-meta'>
            <h4 className='VenueSliderItem__middle-meta-title'>
              The Scene
            </h4>
            <p className='VenueSliderItem__middle-meta-p'>
              {ambience}
            </p>
          </div>}
      </div>
    )
  }
  renderFunHours = venue => {
    const funTimes = venue.funTimes
      ? compileDays(venue.funTimes, 'Bottomless Brunch', venue.name)
      : ''
    if (!funTimes.length) return
    return (
      <div className='VenueSliderItem__middle-center-top'>
        <h3 className='VenueSliderItem__middle-title'>
          Go Bottomless
        </h3>
        {funTimes.map((fun, i) => (
          <div key={i} className='VenueSliderItem__duo'>
            <p className='VenueSliderItem__duo-left'>
              {fun.day}
            </p>
            <p className='VenueSliderItem__duo-right'>
              {fun.startTime} - {fun.endTime}
            </p>
          </div>
        ))}
      </div>
    )
  }
  renderDrinkItems = venue => {
    if (!venue.funItems.length) return
    return (
      <div className='VenueSliderItem__middle-center-bottom'>
        <h3 className='VenueSliderItem__middle-title'>
          Bottomless Deals
        </h3>
        {venue.funItems.map((item, i) => (
          <div key={i} className='VenueSliderItem__duo'>
            <p className='VenueSliderItem__duo-left'>
              ${item.price}
            </p>
            <p className='VenueSliderItem__duo-right'>
              {item.name}
            </p>
          </div>
        ))}
      </div>
    )
  }
  renderShare = () => {
    const { FacebookShareButton, TwitterShareButton } = ShareButtons
    const FacebookIcon = generateShareIcon('facebook')
    const TwitterIcon = generateShareIcon('twitter')
    return (
      <div className='VenueSliderItem__middle-right'>
        <h3 className='VenueSliderItem__middle-title'>
          Share your brunch plans!
        </h3>
        <p className='u-mb-0_5'>
          Tell your girlfriends,<br />
          tell your boyfriends!
        </p>
        <FacebookShareButton
          url={`${SITE_DOMAIN}${this.props.history.location.pathname}`}
          hashtag='#bottomlessbrunch'
        >
          <FacebookIcon iconBgStyle={{ fill: 'transparent' }} size={40} />
          <span>Share on Facebook</span>
        </FacebookShareButton>
        <TwitterShareButton
          url={`${SITE_DOMAIN}${this.props.history.location.pathname}`}
          hashtag='#bottomlessbrunch'
        >
          <TwitterIcon iconBgStyle={{ fill: 'transparent' }} size={40} />
          <span>Share on Twitter</span>
        </TwitterShareButton>
      </div>
    )
  }
  renderPhotos = venue => {
    if (!venue.googlePlacesData.photos) return
    const photos = venue.googlePlacesData.photos
      .map(photo => photo.getUrl({ maxWidth: 800, maxHeight: 500 }))
      .map((photoUrl, i) => (
        <img key={i} className='VenueSliderItem__image' src={photoUrl} alt='' />
      ))
    return (
      <div className='VenueSliderItem__image-container'>
        {photos}
      </div>
    )
  }

  render () {
    const venue = this.props.venues[this.props.venueId]
    // only go here if we have data:
    if (!venue.googlePlacesData) venue.googlePlacesData = {}
    const displayHood = venue.neighborhood
      ? venue.neighborhood
      : venue.address && venue.address.city ? venue.address.city : ''

    const slideNumClass = 'slideNum-' + this.props.slideNum
    return (
      <article className={cx('VenueSliderItem', 'slick-slide', slideNumClass)}>
        <div
          className='VenueSliderItem__inner'
          style={{ backgroundImage: this.renderBackground(venue) }}
        >
          {!venue.name && <h1>Loading...</h1>}
          {venue.name &&
            <div>
              <div className='VenueSliderItem__content'>
                <h1 className='VenueSliderItem__title'>{venue.name}</h1>
                <h2 className='VenueSliderItem__sub-title'>{displayHood}</h2>
                <div className='VenueSliderItem__ratings-and-hours'>
                  {this.renderRatings(venue)}
                  <div className='VenueSliderItem__top-meta'>
                    {this.renderAddress(venue)}
                    {this.renderRegHours(venue)}
                  </div>
                </div>
                <div className='VenueSliderItem__middle'>
                  {this.renderMeta(venue)}
                  {(venue.funItems || venue.funItems) &&
                    <div className='VenueSliderItem__middle-center'>
                      {this.renderFunHours(venue)}
                      {this.renderDrinkItems(venue)}
                    </div>}
                  {this.renderShare()}
                </div>
              </div>
              {this.renderPhotos(venue)}
            </div>}
        </div>
      </article>
    )
  }
}

function mapStateToProps ({ venues, ui }) {
  return { venues, ui }
}

export default connect(mapStateToProps, actions)(VenueSliderItem)
