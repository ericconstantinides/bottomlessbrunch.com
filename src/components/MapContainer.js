import React, { Component } from 'react'
import Map from './Map'
import { connect } from 'react-redux'
import { regions } from '../config'

const region = regions.SanFranciscoCA

class MapContainer extends Component {
  render () {
    const styles = { height: `100%`, width: `100%` }
    return (
      <Map
        center={region.position}
        zoom={region.zoom}
        markers={this.props.venues}
        containerElement={<div style={styles} />}
        mapElement={<div style={styles} />}
      />
    )
  }
}

function mapStateToProps ({venues}) {
  return { venues }
}

export default connect(mapStateToProps)(MapContainer)
