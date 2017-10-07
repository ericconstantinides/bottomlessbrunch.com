import React from 'react'
import { Link } from 'react-router-dom'

const VenueTeaser = ({
  hoveredId,
  venue,
  regionSlug,
  handleMouseOver,
  handleMouseLeave,
  altClass
}) => {
  const hovered = venue._id === hoveredId ? 'is-hovered' : 'not-hovered'

  const renderedImage = venue.gData && venue.gData.images
    ? <div className={`VenueTeaser__image-container ${altClass}__image-container`}>
      <img
        className={`VenueTeaser__image ${altClass}__image`}
        src={venue.gData.images.large[0].url}
        alt={venue.name}
        />
    </div>
    : ''
  console.log(venue.funTimes)
  return (
    <Link
      to={`/${regionSlug}/${venue.slug}`}
      className={`VenueTeaser ${altClass} ${hovered}`}
      onMouseEnter={handleMouseOver(venue)}
      onMouseLeave={handleMouseLeave(venue)}
    >
      {altClass === 'MapItem' &&
        <div className={`VenueTeaser__marker-container ${altClass}__marker-container`}>
          <span className={`VenueTeaser__marker ${altClass}__marker`} />
        </div>
      }
      <div className={`VenueTeaser__inner ${altClass}__inner`}>
        {renderedImage}
        <div className={`VenueTeaser__content ${altClass}__content`}>
          <h3 className={`VenueTeaser__title ${altClass}__title`}>{venue.name}</h3>
          {venue.address &&
            <p className={`VenueTeaser__p ${altClass}__p`}>
              {venue.address.street}, {venue.address.city}
            </p>
          }
          <h4 className={`VenueTeaser__sub-title ${altClass}__sub-title`}>Go Bottomless:</h4>
          {venue.funTimes.map((fun, i) => (
            <p key={i} className={`VenueTeaser__p ${altClass}__p`}>
              <strong>{fun.days}:</strong> {fun.startTime} - {fun.endTime}
            </p>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default VenueTeaser
