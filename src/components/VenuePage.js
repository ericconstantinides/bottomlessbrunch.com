import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import './VenuePage.css'

class VenuePage extends Component {
  render () {
    console.log(this.props)
    return (
      <div className='VenuePage'>
        <div className='VenuePage__inner'>
          <div
            className='VenuePage__close'
            onClick={() => this.props.closeVenue(this.props.id)}
          />
          <h1>
            {this.props.name}
          </h1>
        </div>
      </div>
    )
  }
}

export default connect(null, actions)(VenuePage)
