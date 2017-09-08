import React from 'react'
import './Venue.css'

export default function (props) {
  return (
    <article className='Venue'>
      <h4 className='Venue__title'>{props.name}</h4>
      <p className='Venue__content'>
        {props.address.street}, {props.address.city}
      </p>
    </article>
  )
}
