import React, { Component } from 'react'
import Map from './Map'
import { connect } from 'react-redux'

class MapContainer extends Component {
  render () {
    // default to San Francisco (ID: 0) region:
    const region = this.props.regions.filter(region => region.id === 0)[0]
    const styles = { height: `100%`, width: `100%` }
    return (
      <Map
        cursorPos={this.props.cursorPos}
        center={region.position}
        zoom={region.zoom}
        venues={this.props.venues}
        containerElement={<div style={styles} />}
        mapElement={<div style={styles} />}
      />
    )
  }
}

function mapStateToProps ({ regions, venues }) {
  return { regions, venues }
}

export default connect(mapStateToProps)(MapContainer)
