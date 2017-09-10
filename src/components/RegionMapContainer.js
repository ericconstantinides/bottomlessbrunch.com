import React, { Component } from 'react'
import RegionMap from './RegionMap'
import { connect } from 'react-redux'

class RegionMapContainer extends Component {
  render () {
    const styles = { height: `100%`, width: `100%` }
    return (
      <RegionMap
        center={{ lat: 37.318835055903456, lng: -121.9353463464844 }}
        zoom={11}
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

export default connect(mapStateToProps)(RegionMapContainer)
