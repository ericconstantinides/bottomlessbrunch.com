import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react'
// import { Map } from './Map'
import './Map.css'

const GAPI_KEY = 'AIzaSyClCXV7GZhNnvKwi6C8A9FRq-IEUbOzjqM'

export class RegionMapContainer extends Component {
  render () {
    const style = {
      width: '100%',
      height: '100%',
      position: 'relative'
    }
    return (
      <Map google={this.props.google} zoom={14} style={style}>
        <Marker onClick={this.onMarkerClick} name={'Current location'} />
        <Marker
          title={'The marker`s title will appear as a tooltip.'}
          name={'SOMA'}
          position={{ lat: 37.778519, lng: -122.405640 }}
        />
        <Marker
          name={'Dolores park'}
          position={{ lat: 37.759703, lng: -122.428093 }}
        />
        <Marker />
        <InfoWindow onClose={this.onInfoWindowClose}>
          <div>
            {/* <h1>{this.state.selectedPlace.name}</h1> */}
            <h2>HELLO MOTO</h2>
          </div>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: GAPI_KEY
})(RegionMapContainer)
