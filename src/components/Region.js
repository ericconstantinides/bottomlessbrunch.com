// this is a dummy component whose only purpose is to set the region
// Why? Because I don't want the map to leave the dom once loaded
// could it be done better? yes.
import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actions from '../actions'

class Region extends Component {
  componentWillMount = () => {
    console.log('this.props.region:', this.props.region)
    const { zoom, lat, lng } = this.props.region
    this.props.setMainMap({ zoom, center: { lat, lng } })
  }
  render = () => <div className='Region' style={{display: 'none'}} />
}

export default connect(null, actions)(Region)
