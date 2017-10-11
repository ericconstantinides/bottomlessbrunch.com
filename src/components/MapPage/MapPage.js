import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import * as actions from '../../actions'

import Logo from '../common/Logo'
import Map from './Map'
import VenueList from './VenueList'

class MapPage extends Component {
  handleSelectChange = selected => {
    this.props.setUiRegion(
      selected.value,
      this.props.regions[selected.value].slug,
      this.props.history
    )
  }
  handleLogoClick = () => {
    this.props.unsetUiVenue()
    this.props.unsetUiRegion()
    this.props.history.push('/')
  }
  render () {
    if (_.isEmpty(this.props.regions) || _.isEmpty(this.props.venues)) {
      return <div>Loading...</div>
    }
    const region = this.props.regions[this.props.ui.region]
    const styles = { height: `100%`, width: `100%` }
    const regionSelectOptions = _.map(this.props.regions, region => ({
      value: region._id,
      label: region.name
    }))
    return (
      <div className='MapPage'>
        <Logo
          /* subTitle={region.name} */
          region={this.props.ui.region}
          history={this.props.history}
          handleChange={this.handleSelectChange}
          options={regionSelectOptions}
          handleLogoClick={this.handleLogoClick}
        />
        <div className='MapPage__Map-container'>
          <Map
            cursorPos={this.props.cursorPos}
            center={{lat: region.lat, lng: region.lng}}
            zoom={region.zoom}
            minZoom={4}
            venues={this.props.venues}
            containerElement={<div style={styles} />}
            mapElement={<div style={styles} />}
          />
        </div>
        <div className='MapPage__VenueList-container'>
        <VenueList region={this.props.ui.region} />
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ regions, venues, ui }) {
  return { regions, venues, ui }
}

export default connect(mapStateToProps, actions)(MapPage)
