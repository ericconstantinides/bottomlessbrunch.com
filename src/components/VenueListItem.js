import React from 'react'
import './VenueListItem.css'
import { Link } from 'react-router-dom'

const VenueListItem = ({
  venue,
  handleMouseOver,
  handleMouseLeave,
  handleClick
}) => {
  const hovered = venue.showInfo ? 'is-hovered' : 'not-hovered'
  const renderedImage = venue.images
    ? <div className='VenueListItem__image-container'>
      <img
        className='VenueListItem__image'
        src={`/images/${venue.images[0].fileName}`}
        alt={venue.name}
        />
    </div>
    : ''
  return (
    <div
      onMouseEnter={handleMouseOver(venue.id)}
      onMouseLeave={handleMouseLeave(venue.id)}
      onClick={handleClick(venue.id)}
    >
      <Link
        to={`/${venue.regionSlug}/${venue.slug}`}
        className={`VenueListItem ${hovered}`}
      >
        {renderedImage}
        <div className='VenueListItem__content'>
          <h4 className='VenueListItem__title'>{venue.name}</h4>
          <p className='VenueListItem__p'>
            {venue.address.street}, {venue.address.city}
          </p>
        </div>
      </Link>
    </div>
  )
}

export default VenueListItem
