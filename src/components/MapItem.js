import React from 'react'
import './MapItem.css'

const MapItem = ({
  venue,
  handleMouseOver,
  handleMouseLeave,
  handleClick
}) => {
  const renderedImage = venue.images
  ? <div className='VenueListItem__image-container'>
    <img
      className='VenueListItem__image'
      src={`/images/${venue.images[0].fileName}`}
      alt={venue.name}
      />
  </div>
  : ''
  const activeState = venue.showInfo ? 'is-hovered' : 'not-hovered'
  // const { x, y } = props.cursorPos
  // const style = { left: `${x}px`, top: `${y}px` }
  return (
    <div className={`MapItem ${activeState}`}>
      <span className='MapItem__marker'
        onMouseEnter={handleMouseOver(venue.id)}
        onMouseLeave={handleMouseLeave(venue.id)}
        onClick={handleClick(venue.id)}
      />
      <article className='VenueListItem VenuePopup'>
        {renderedImage}
        <div className='VenueListItem__content'>
          <h4 className='VenueListItem__title'>{venue.name}</h4>
          <p className='VenueListItem__p'>
            {venue.address.street}, {venue.address.city}
          </p>
        </div>
      </article>
    </div>
  )
}

export default MapItem
