import React, { Component } from 'react'
import { connect } from 'react-redux'
import GoogleMapReact from 'google-map-react'
import * as actions from '../actions'
import './VenuePopup.css'
import MapItem from './MapItem'

class Map extends Component {
  constructor () {
    super()
    this.state = {
      map: null,
      loaded: false
    }
  }
  mapMoved () {
    console.log('Map Moved: ', JSON.stringify(this.state.map.getCenter()))
  }
  mapLoaded (map) {
    // This is how we can save the map:
    if (this.state.map !== null) return false
    // console.log('Map Loaded: ', JSON.stringify(map.getCenter()))
    this.setState({ map })
  }
  handleMarkerClick = marker => {
    this.props.openVenue(marker.id)
  }
  handleMarkerMouseOver = marker => {
    // console.log('x:', this.state.x, 'y:', this.state.y)
    this.props.showInfoVenue(marker.id)
  }
  handleMarkerMouseOut = marker => {
    this.props.hideInfoVenue(marker.id)
  }
  // renderMarkers () {
  //   if (!this.props.venues) return ''
  //   return this.props.venues.map((marker, i) => (
  //     <Marker
  //       key={i}
  //       onMouseOver={() => this.handleMarkerMouseOver(marker)}
  //       onMouseOut={() => this.handleMarkerMouseOut(marker)}
  //       onClick={() => this.handleMarkerClick(marker)}
  //       {...marker}
  //     />
  //   ))
  // }
  componentDidMount () {
    this.setState({ loaded: true })
  }

  render () {
    return (
      <GoogleMapReact
        ref={this.mapLoaded.bind(this)}
        onDragEnd={this.mapMoved.bind(this)}
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center}
      >
        {this.props.venues.map((venue, i) => (
          <MapItem
            key={i}
            {...venue}
            lat={venue.position.lat}
            lng={venue.position.lng}
          />
        ))}
        <VenuePopup
          venues={this.props.venues}
          cursorPos={this.props.cursorPos}
        />
      </GoogleMapReact>
    )
  }
}

// const MapItems = props => {
//   return props.venues.map((venue, i) => {
//     return (
//       <div key={i} lat={venue.position.lat} lng={venue.position.lng}>{venue.name}</div>
//     )
//   })
// }

const VenuePopup = props => {
  const showInfoVenue = props.venues.filter(venue => venue.showInfo)[0]
  if (!showInfoVenue) {
    return null
  }
  const renderedImage = showInfoVenue.images
    ? <div className='VenueListItem__image-container'>
      <img
        className='VenueListItem__image'
        src={`/images/${showInfoVenue.images[0].fileName}`}
        alt={showInfoVenue.name}
        />
    </div>
    : ''
  const { x, y } = props.cursorPos
  const style = { left: `${x}px`, top: `${y}px` }
  return (
    <article style={style} className='VenueListItem VenuePopup'>
      {renderedImage}
      <div className='VenueListItem__content'>
        <h4 className='VenueListItem__title'>{showInfoVenue.name}</h4>
        <p className='VenueListItem__p'>
          {showInfoVenue.address.street}, {showInfoVenue.address.city}
        </p>
      </div>
    </article>
  )
}

export default connect(null, actions)(Map)
