import React, { Component } from 'react'
import './MapItem.css'

export default class MapItem extends Component {
  render () {
    return (
      <div className='MapItem'>
        {this.props.name}
      </div>
    )
  }
}
