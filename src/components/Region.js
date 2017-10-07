// this is a dummy component whose only purpose is to set the region
// Why? Because I don't want the map to ever leave the dom once loaded
import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actions from '../actions'

class Region extends Component {
  componentWillMount () {
    this.props.setUiRegion(this.props.region._id)
  }
  render () {
    return (
      <div style={{display: 'none'}}/>
    )
  }
}

function mapStateToProps ({ regions, ui }) {
  return { regions, ui }
}

export default connect(mapStateToProps, actions)(Region)
