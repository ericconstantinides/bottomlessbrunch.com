import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { connect } from 'react-redux'

import Slider from 'react-slick'
import { reduceVenuesByRegion } from '../../lib/myHelpers'

import { SLIDER_SETTINGS } from '../../config'
import * as actions from '../../actions'
import VenueSliderItem from './VenueSliderItem'

class VenueSlider extends Component {
  constructor () {
    super()
    this.state = {
      activeSlide: 0,
      sliderItems: []
    }
  }
  componentDidMount () {
    // set the venueUI:
    this.props.setUiVenue(this.props.venue._id)
    // get the venue detail
    this.props.fetchGooglePlacesVenueDetail(this.props.venue)

    this.props.removeUiAppClass(['App--MapPage'])
    this.props.addUiAppClass(['App--VenueSlider'])
  }
  shouldComponentUpdate (nextProps, nextState) {
    return false
  }
  componentWillMount() {
    const { venues, venueId } = this.props
    // reduce the venues by region to get all your slider items!
    const reducedVenues = reduceVenuesByRegion(venues, venues[venueId].regionId)
    let index = 0
    const sliderItems = _.map(reducedVenues, (venue, id) => {
      // get the initial slide for the slider:
      if (id === this.props.venue._id) {
        this.setState({activeSlide: index})
      }
      index++
      return (
        <VenueSliderItem
          key={id}
          venue={venue}
          history={this.props.history}
        />
      )
    })

    this.setState({sliderItems})
  }
  
  componentWillUnmount () {
    // unset the venueUI:
    this.props.unsetUiVenue()
    this.props.removeUiAppClass(['App--VenueSlider'])
    this.props.addUiAppClass(['App--MapPage'])
  }
  handleSliderChange = (index) => {
    this.setState({activeSlide: index})
    console.log('slider changed to index:', this.state.activeSlide)
    console.log('details:', this.state.sliderItems[this.state.activeSlide].props.venue.slug)
    this.props.history.push(`/${this.props.regionSlug}/${this.state.sliderItems[this.state.activeSlide].props.venue.slug}`)
    // need to update the slug here:
  }
  handleShare = service => event => {
    console.log(service)
  }
  render () {
    console.log('VenueSlider: render() @', new Date())
    return (
      <div className='VenueSlider'>
        <Link to={`/${this.props.regionSlug}`} className='VenueSlider__close'>
          <div className='VenueSlider__inner-close' />
        </Link>
        <Slider
          {...SLIDER_SETTINGS}
          initialSlide={this.state.activeSlide}
          ref='slickSlider'
          afterChange={this.handleSliderChange}
        >
          {this.state.sliderItems}
        </Slider>
      </div>
    )
  }
}

function mapStateToProps ({ venues, regions }) {
  return { venues, regions }
}

export default connect(mapStateToProps, actions)(VenueSlider)
