import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import './Venue.css'

class Venue extends Component {
  render () {
    const hovered = this.props.showInfo ? 'is-hovered' : 'not-hovered'
    return (
      <article
        className={`Venue ${hovered}`}
        onMouseEnter={() => this.props.showInfoVenue(this.props.id, 'on')}
        onMouseLeave={() => this.props.showInfoVenue(this.props.id, 'off')}
      >
        <h4 className='Venue__title'>{this.props.name}</h4>
        <p className='Venue__content'>
          {this.props.address.street}, {this.props.address.city}
        </p>
      </article>
    )
  }
}

export default connect(null, actions)(Venue)
