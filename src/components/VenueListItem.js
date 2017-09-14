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
    <Link
      to={`/${venue.slug}`}
      className={`VenueListItem ${hovered}`}
      onMouseEnter={handleMouseOver(venue.id)}
      onMouseLeave={handleMouseLeave(venue.id)}
      onClick={handleClick(venue.id)}
    >
      {renderedImage}
      <div className='VenueListItem__content'>
        <h4 className='VenueListItem__title'>{venue.name}</h4>
        <p className='VenueListItem__p'>
          {venue.address.street}, {venue.address.city}
        </p>
      </div>
    </Link>
  )
}

export default VenueListItem
