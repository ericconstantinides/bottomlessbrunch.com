import React, { Component } from 'react'
import Star from 'react-stars'
// import { ShareButtons, generateShareIcon } from 'react-share'
import { connect } from 'react-redux'
import cx from 'classnames'

import * as actions from '../../actions'
import { SITE_DOMAIN } from '../../config'
import { roundHalf, compileGoogleHours, compileDays } from '../../lib/myHelpers'

import Deals from '../common/Deals'

class VenueSliderItem extends Component {
  renderBackground = venue => {
    if (
      !venue.googlePlacesData ||
      !venue.googlePlacesData.photos ||
      !venue.googlePlacesData.photos[0]
    ) {
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
  renderAddress = venue => {
    if (!venue.address) return
    return (
      <div className='VenueSliderItem__address'>
        <h3 className='VenueSliderItem__address-title'>
          Address
        </h3>
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
        </p>
      </div>
    )
  }
  renderRegHours = venue => {
    if (!venue.googlePlacesData || !venue.googlePlacesData.opening_hours) {
      return
    }
    const hours = compileGoogleHours(venue.googlePlacesData)
    return (
      <div className='VenueSliderItem__hours'>
        <h3 className='VenueSliderItem__hours-title'>
          Regular Hours
        </h3>
        {hours.map((item, i) => (
          <p key={i} className='VenueSliderItem__hours-p'>
            <strong>{item.weekday}:</strong> {item.time}
          </p>
        ))}
      </div>
    )
  }
  renderMeta = yMeta => {
    return (
      <div className='VenueSliderItem__middle-left'>
        {yMeta.outdoorSeating &&
          <div className='VenueSliderItem__middle-meta'>
            <h4 className='VenueSliderItem__middle-meta-title'>
              Outside Seating
            </h4>
            <p className='VenueSliderItem__middle-meta-p'>
              {yMeta.outdoorSeating ? 'Yes' : 'No'}
            </p>
          </div>}
        {yMeta.takesReservations &&
          <div className='VenueSliderItem__middle-meta'>
            <h4 className='VenueSliderItem__middle-meta-title'>
              Takes Reservations
            </h4>
            <p className='VenueSliderItem__middle-meta-p'>
              {yMeta.takesReservations ? 'Yes' : 'No'}
            </p>
          </div>}
        {yMeta.alcohol &&
          <div className='VenueSliderItem__middle-meta'>
            <h4 className='VenueSliderItem__middle-meta-title'>
              Alcohol Served
            </h4>
            <p className='VenueSliderItem__middle-meta-p'>
              {yMeta.alcohol.replace(/&amp;/g, '&')}
            </p>
          </div>}
        {yMeta.ambience &&
          <div className='VenueSliderItem__middle-meta'>
            <h4 className='VenueSliderItem__middle-meta-title'>
              The Scene
            </h4>
            <p className='VenueSliderItem__middle-meta-p'>
              {Array.isArray(yMeta.ambience)
                ? yMeta.ambience.length === 2
                    ? yMeta.ambience.join(' & ')
                    : yMeta.ambience.join(', ')
                : yMeta.ambience}
            </p>
          </div>}
      </div>
    )
  }
  renderFunHours = venue => {
    const funTimes = venue.funTimes
      ? compileDays(venue.funTimes, 'Bottomless Brunch', venue.name)
      : ''
    if (!funTimes || !funTimes.length) return
    return (
      <div className='VenueSliderItem__middle-center-top'>
        <table className='VenueSliderItem__table'>
          <tbody>
            <tr>
              <th colSpan='2'>
                <h3 className='VenueSliderItem__middle-title'>
                  Bottomless Times
                </h3>
              </th>
            </tr>
            {funTimes.map((fun, i) => (
              <tr key={i} className='VenueSliderItem__duo'>
                <td className='VenueSliderItem__duo-left'>
                  {fun.day}
                </td>
                <td className='VenueSliderItem__duo-right'>
                  {fun.startTime} - {fun.endTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  renderShare = () => {
    // const { FacebookShareButton, TwitterShareButton } = ShareButtons
    // const FacebookIcon = generateShareIcon('facebook')
    // const TwitterIcon = generateShareIcon('twitter')
    return (
      <div className='VenueSliderItem__middle-right'>
        <h3 className='VenueSliderItem__middle-title'>
          Share your brunch plans!
        </h3>
        <p className='u-mb-0_5'>
          Tell your girlfriends,<br />
          tell your boyfriends!
        </p>
        {/* <FacebookShareButton
          url={`${SITE_DOMAIN}${this.props.history.location.pathname}`}
          hashtag='#bottomlessbrunch'
        >
          <FacebookIcon iconBgStyle={{ fill: 'transparent' }} size={40} />
          <span>Share on Facebook</span>
        </FacebookShareButton> */}
        {/* <TwitterShareButton
          url={`${SITE_DOMAIN}${this.props.history.location.pathname}`}
          hashtag='#bottomlessbrunch'
        >
          <TwitterIcon iconBgStyle={{ fill: 'transparent' }} size={40} />
          <span>Share on Twitter</span>
        </TwitterShareButton> */}
      </div>
    )
  }
  renderPhotos = venue => {
    if (!venue.googlePlacesData || !venue.googlePlacesData.photos.length) return
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
    const displayHood = venue.neighborhood
      ? venue.neighborhood
      : venue.address && venue.address.city ? venue.address.city : ''
    const slideNumClass = 'slideNum-' + this.props.slideNum
    const yMeta = venue.yMeta &&
      (venue.yMeta.alcohol ||
        venue.yMeta.ambience ||
        venue.yMeta.outdoorSeating ||
        venue.yMeta.takesReservations)
      ? venue.yMeta
      : false
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
                <div
                  className={`VenueSliderItem__middle ${yMeta ? 'has-meta' : 'no-meta'}`}
                >
                  {yMeta && this.renderMeta(venue.yMeta)}
                  {(venue.funItems || venue.funItems) &&
                    <div className='VenueSliderItem__middle-center'>
                      {this.renderFunHours(venue)}
                      {venue.funItems &&
                        venue.funItems.length > 0 &&
                        <div className='VenueSliderItem__middle-center-bottom'>
                          <Deals venue={venue} />
                        </div>}
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
