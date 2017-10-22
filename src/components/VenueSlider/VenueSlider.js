import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { connect } from 'react-redux'

import Slider from 'react-slick'
// import objectFunctions from '../../lib/ObjectFunctions'
import { reduceVenuesByRegion } from '../../lib/myHelpers'

import { SLIDER_SETTINGS } from '../../config'
import * as actions from '../../actions'
import VenueSliderItem from './VenueSliderItem'

class VenueSlider extends Component {
  constructor () {
    super()
    this.state = {
      nextSlug: '',
      prevSlug: ''
    }
  }
  componentDidMount () {
    const { venue, venues, venueId, regionSlug } = this.props

    // set the venueUI:
    this.props.setUiVenue(venueId)

    // get the venue detail
    this.props.fetchGooglePlacesVenueDetail(venue)

    // const nextId = objectFunctions.keys.next(reducedVenues, venueId)
    // const prevId = objectFunctions.keys.previous(reducedVenues, venueId)

    // this.setState({
    //   nextSlug: '/' + regionSlug + '/' + venues[nextId].slug,
    //   prevSlug: '/' + regionSlug + '/' + venues[prevId].slug
    // })
    this.props.removeUiAppClass(['App--MapPage'])
    this.props.addUiAppClass(['App--VenueSlider'])

    // need to go to the correct index here:
    let index = 3 // TEMP
    // need to have this done in the state...
    // this.refs.slickSlider.slickGoTo(index)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return false
  }
  
  componentWillUnmount () {
    // unset the venueUI:
    this.props.unsetUiVenue()
    this.props.removeUiAppClass(['App--VenueSlider'])
    this.props.addUiAppClass(['App--MapPage'])
  }
  handleSliderChange = (index) => {
    // need to update the slug here:
  }
  handleShare = service => event => {
    console.log(service)
  }
  render () {
    const { venue, venues, venueId, regionSlug } = this.props
    // reduce the venues by region to get all your slider items!
    const reducedVenues = reduceVenuesByRegion(venues, venues[venueId].regionId)
    const sliderItems = _.map(reducedVenues, (venue, i) => (
      <VenueSliderItem
        key={i}
        venue={venue}
        history={this.props.history}
      />
    ))
    return (
      <div className='VenueSlider'>
        <Link to={`/${regionSlug}`} className='VenueSlider__close'>
          <div className='VenueSlider__inner-close' />
        </Link>
        <Slider
          {...SLIDER_SETTINGS}
          ref='slickSlider'
          afterChange={this.handleSliderChange}
        >
          {sliderItems}
        </Slider>
      </div>
    )
  }
}

function mapStateToProps ({ venues, regions }) {
  return { venues, regions }
}

export default connect(mapStateToProps, actions)(VenueSlider)
