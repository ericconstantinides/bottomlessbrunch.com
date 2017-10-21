import React from 'react'
import Star from 'react-stars'
import { ShareButtons, generateShareIcon } from 'react-share'
import { Link } from 'react-router-dom'

import { SITE_DOMAIN } from '../../config'
import {
  roundHalf,
  compileGoogleHours,
  compileDays
} from '../../lib/myHelpers'

class VenueSliderItem extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return false
  }
  render () {
    const { venue } = this.props
    console.log(venue)
    // only go here if we have data:
    const hours = compileGoogleHours(venue.googlePlacesData)
    if (!venue.googlePlacesData) venue.googlePlacesData = {}
    let photos = ''
    let bgStyle = ''
    if (venue.googlePlacesData.photos) {
      photos = venue.googlePlacesData.photos
        .map(photo => photo.getUrl({ maxWidth: 800, maxHeight: 500 }))
        .map((photoUrl, i) => (
          <img key={i} className='VenueSliderItem__image' src={photoUrl} alt='' />
        ))
      bgStyle =
        'url(' +
        venue.googlePlacesData.photos[0].getUrl({
          maxWidth: 1920,
          maxHeight: 1080
        }) +
        ')'
    }
    // console.log(venue.name)
    const funTimes = compileDays(
      venue.funTimes,
      'Bottomless Brunch',
      venue.name
    )
    const displayHood = venue.neighborhood
      ? venue.neighborhood
      : venue.address.city

    const alcohol = !venue.yMeta.alcohol
      ? false
      : venue.yMeta.alcohol.replace(/&amp;/g, '&')
    const ambience = !venue.yMeta.ambience
      ? false
      : Array.isArray(venue.yMeta.ambience)
          ? venue.yMeta.ambience.length === 2
              ? venue.yMeta.ambience.join(' & ')
              : venue.yMeta.ambience.join(', ')
          : venue.yMeta.ambience
    const { FacebookShareButton, TwitterShareButton } = ShareButtons
    const FacebookIcon = generateShareIcon('facebook')
    const TwitterIcon = generateShareIcon('twitter')
    return (
      <div className='VenueSliderItem slick-slide'>
        <div className='VenueSliderItem__inner1'>
          <div className='VenueSliderItem__inner2'>
            <div
              className='VenueSliderItem__bg'
              style={{ backgroundImage: bgStyle }}
            />
            <Link
              to={`/${this.props.regionSlug}`}
              className='VenueSliderItem__close'
            >
              <span className='VenueSliderItem__inner-close'>+</span>
            </Link>
            <h1 className='VenueSliderItem__title'>{venue.name}</h1>
            <h2 className='VenueSliderItem__sub-title'>{displayHood}</h2>
            <div className='VenueSliderItem__ratings'>
              {venue.googlePlacesData &&
                venue.googlePlacesData.rating &&
                <div className='VenueSliderItem__ratings-item'>
                  <h3 className='VenueSliderItem__ratings-title'>Google</h3>
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
            <div className='VenueSliderItem__top-meta'>
              <div className='VenueSliderItem__address'>
                <h3 className='VenueSliderItem__address-title'>Address</h3>
                <p className='VenueSliderItem__address-p'>
                  {venue.address.street}<br />
                  {venue.address.city}<br />
                  {venue.phone}
                </p>
              </div>
              <div className='VenueSliderItem__hours'>
                <h3 className='VenueSliderItem__hours-title'>Hours</h3>
                {hours &&
                  hours.map((item, i) => (
                    <p key={i} className='VenueSliderItem__hours-p'>
                      <strong>{item.weekday}:</strong> {item.time}
                    </p>
                  ))}
              </div>
            </div>
            <div className='VenueSliderItem__middle'>
              <div className='VenueSliderItem__middle-left'>
                {venue.yMeta.outdoorSeating !== undefined &&
                  <div className='VenueSliderItem__middle-meta'>
                    <h4 className='VenueSliderItem__middle-meta-title'>
                      Outside Seating
                    </h4>
                    <p className='VenueSliderItem__middle-meta-p'>
                      {venue.yMeta.outdoorSeating ? 'Yes' : 'No'}
                    </p>
                  </div>}
                {venue.yMeta.takesReservations !== undefined &&
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
              {(funTimes || venue.funItems.length) &&
                <div className='VenueSliderItem__middle-center'>
                  {funTimes &&
                    <div className='VenueSliderItem__middle-center-top'>
                      <h3 className='VenueSliderItem__middle-title'>
                        Go Bottomless
                      </h3>
                      {funTimes.map((fun, i) => (
                        <div key={i} className='VenueSliderItem__duo'>
                          <p className='VenueSliderItem__duo-left'>{fun.day}</p>
                          <p className='VenueSliderItem__duo-right'>
                            {fun.startTime} - {fun.endTime}
                          </p>
                        </div>
                      ))}
                    </div>}
                  {venue.funItems.length > 0 &&
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
                    </div>}
                </div>}
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
                  <FacebookIcon
                    iconBgStyle={{ fill: 'transparent' }}
                    size={40}
                  />
                  <span>Share on Facebook</span>
                </FacebookShareButton>
                <TwitterShareButton
                  url={`${SITE_DOMAIN}${this.props.history.location.pathname}`}
                  hashtag='#bottomlessbrunch'
                >
                  <TwitterIcon
                    iconBgStyle={{ fill: 'transparent' }}
                    size={40}
                  />
                  <span>Share on Twitter</span>
                </TwitterShareButton>
              </div>
            </div>
            <div className='VenueSliderItem__image-container'>
              {photos}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default VenueSliderItem
