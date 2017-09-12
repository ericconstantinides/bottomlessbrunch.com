import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withGoogleMap, GoogleMap, Marker, OverlayView } from 'react-google-maps'
import * as actions from '../actions'
import './VenuePopup.css'

const OVERLAY_STYLES = {
  mapContainer: {
    height: `100%`,
  },
  overlayView: {
    background: `white`,
    border: `1px solid #ccc`,
    padding: 15,
  },
};

function getPixelPositionOffset(width, height) {
  return { x: -(width / 2), y: -(height / 2) };
}

class Map extends Component {
  constructor () {
    super()
    this.state = {
      map: null
    }
  }
  mapMoved () {
    console.log('Map Moved: ', JSON.stringify(this.state.map.getCenter()))
  }
  mapLoaded (map) {
    // This is how we can save the map:
    if (this.state.map !== null) return false
    console.log('Map Loaded: ', JSON.stringify(map.getCenter()))
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
  renderMarkers () {
    if (!this.props.venues) return ''
    return this.props.venues.map((marker, i) => (
      <Marker
        key={i}
        onMouseOver={() => this.handleMarkerMouseOver(marker)}
        onMouseOut={() => this.handleMarkerMouseOut(marker)}
        onClick={() => this.handleMarkerClick(marker)}
        {...marker}
      />
    ))
  }

  render () {
    return (
      <GoogleMap
        ref={this.mapLoaded.bind(this)}
        onDragEnd={this.mapMoved.bind(this)}
        defaultZoom={this.props.zoom}
        defaultCenter={this.props.center}
      >
        {this.renderMarkers()}
        <VenuePopup
          venues={this.props.venues}
          cursorPos={this.props.cursorPos}
        />
        <OverlayView
          key={Math.random()}
          position={this.props.center}
          /*
          * An alternative to specifying position is specifying bounds.
          * bounds can either be an instance of google.maps.LatLngBounds
          * or an object in the following format:
          * bounds={{
          *    ne: { lat: 62.400471, lng: -150.005608 },
          *    sw: { lat: 62.281819, lng: -150.287132 }
          * }}
          */
          /*
          * 1. Specify the pane the OverlayView will be rendered to. For
          *    mouse interactivity, use `OverlayView.OVERLAY_MOUSE_TARGET`.
          *    Defaults to `OverlayView.OVERLAY_LAYER`.
          */
          mapPaneName={OverlayView.OVERLAY_LAYER}
          /*
          * 2. Tweak the OverlayView's pixel position. In this case, we're
          *    centering the content.
          */
          getPixelPositionOffset={getPixelPositionOffset}
          /*
          * 3. Create OverlayView content using standard React components.
          */
        >
          <div style={OVERLAY_STYLES.overlayView}>
            <h1>OverlayView</h1>
            <p>I have the look</p>
          </div>
        </OverlayView>
      </GoogleMap>
    )
  }
}

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

export default connect(null, actions)(withGoogleMap(Map))
