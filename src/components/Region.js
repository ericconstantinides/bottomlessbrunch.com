// this is a dummy component whose only purpose is to set the region
// Why? Because I don't want the map to leave the dom once loaded
import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actions from '../actions'

class Region extends Component {
  componentWillMount = () => { this.props.setUiRegion(this.props.region._id) }
  render = () => <div className='Region' style={{display: 'none'}} />
}

export default connect(null, actions)(Region)
