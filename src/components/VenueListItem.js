import React from 'react'
import './VenueListItem.css'

const VenueListItem = ({
  showInfo,
  images,
  id,
  name,
  address,
  showInfoVenue,
  hideInfoVenue,
  openVenue
}) => {
  const hovered = showInfo ? 'is-hovered' : 'not-hovered'
  const renderedImage = images
    ? <div className='VenueListItem__image-container'>
      <img
        className='VenueListItem__image'
        src={`/images/${images[0].fileName}`}
        alt={name}
        />
    </div>
    : ''
  return (
    <article
      className={`VenueListItem ${hovered}`}
      onMouseEnter={() => showInfoVenue(id)}
      onMouseLeave={() => hideInfoVenue(id)}
      onClick={() => openVenue(id)}
    >
      {renderedImage}
      <div className='VenueListItem__content'>
        <h4 className='VenueListItem__title'>{name}</h4>
        <p className='VenueListItem__p'>
          {address.street}, {address.city}
        </p>
      </div>
    </article>
  )
}

export default VenueListItem
