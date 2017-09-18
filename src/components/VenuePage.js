import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'
import './VenuePage.css'

class VenuePage extends Component {
  render () {
    return (
      <div className='VenuePage'>
        <div className='VenuePage__inner'>
          <Link to='/'
            className='VenuePage__close'
          />
          <h1>
            {this.props.venue.name}
          </h1>
        </div>
      </div>
    )
  }
}

export default connect(null, actions)(VenuePage)
