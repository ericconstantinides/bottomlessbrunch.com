import React from 'react'
import { Link } from 'react-router-dom'
import './VenueTeaser.css'

const VenueTeaser = ({
  hoveredId,
  venue,
  regionSlug,
  handleMouseOver,
  handleMouseLeave,
  altClass
}) => {
  const hovered = venue._id === hoveredId ? 'is-hovered' : 'not-hovered'
  const renderedImage = venue.images
    ? <div className='VenueTeaser__image-container'>
      <img
        className='VenueTeaser__image'
        src={`/images/${venue.images[0].fileName}`}
        alt={venue.name}
        />
    </div>
    : ''
  return (
    <Link
      to={`/${regionSlug}/${venue.slug}`}
      className={`VenueTeaser ${altClass} ${hovered}`}
      onMouseEnter={handleMouseOver(venue)}
      onMouseLeave={handleMouseLeave(venue)}
    >
      <div className='VenueTeaser__marker-container'>
        <span className='VenueTeaser__marker' />
      </div>
      <div className='VenueTeaser__inner'>
        {renderedImage}
        <div className='VenueTeaser__content'>
          <h4 className='VenueTeaser__title'>{venue.name}</h4>
          {venue.address &&
            <p className='VenueTeaser__p'>
              {venue.address.street}, {venue.address.city}
            </p>
          }
        </div>
      </div>
    </Link>
  )
}

export default VenueTeaser
