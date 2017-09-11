import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import './VenueListItem.css'

class VenueListItem extends Component {
  render () {
    const { showInfo, images, id, name, address } = this.props
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
    if (this.props.id === 0) {
      console.log(this.props.images)
    }
    return (
      <article
        className={`VenueListItem ${hovered}`}
        onMouseEnter={() => this.props.showInfoVenue(id, 'on')}
        onMouseLeave={() => this.props.showInfoVenue(id, 'off')}
        onClick={() => this.props.openVenue(id)}
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
}

export default connect(null, actions)(VenueListItem)
