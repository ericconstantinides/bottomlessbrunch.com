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
  constructor (props) {
    super()
    this.state = {
      activeSlideIndex: 0,
      activeSlideId: props.venue._id
    }
  }
  componentDidMount () {
    console.log('VenueSlider: componentDidMount ()')

    this.props.removeUiAppClass(['App--MapPage'])
    this.props.addUiAppClass(['App--VenueSlider'])
  }
  // shouldComponentUpdate (nextProps, nextState) {
    // return false
  // }
  componentWillMount() {

  }
  
  componentWillUnmount () {
    console.log('VenueSlider: componentDidUnmount ()')
    // unset the venueUI:
    this.props.unsetUiVenue()
    this.props.removeUiAppClass(['App--VenueSlider'])
    this.props.addUiAppClass(['App--MapPage'])
  }
  handleSliderBeforeChange = (index) => {
    console.log('pre index:', index)
  }
  handleSliderChange = (index) => {
    console.log('post index:', index)
    this.setState({activeSlideIndex: index})
    const { venues, venue } = this.props
    const reducedVenues = reduceVenuesByRegion(venues, venues[venue._id].regionId)
    _.map(reducedVenues, venue => {
      if (venue.index === index) {
        this.setState({activeSlideId: venue._id})
      }
    })
    // const { venue } = this.state.sliderItems[this.state.activeSlide].props
    // console.log('slider changed to index:', this.state.activeSlide)
    // console.log('details:', this.state.sliderItems[this.state.activeSlide].props.venue.slug)
    // need to update the slug here:
    // this.props.history.push(`/${this.props.regionSlug}/${venue.slug}`)

    // this.props.setUiVenue(venue._id)
  }
  handleShare = service => event => {
    console.log(service)
  }
  render () {
    console.log(this.state.activeSlideId)
    // console.log('VenueSlider: render() @', new Date())
    const { venues, venueId } = this.props
    // reduce the venues by region to get all your slider items!
    const reducedVenues = reduceVenuesByRegion(venues, venues[venueId].regionId)
    const sliderItems = _.map(reducedVenues, (venue, id) => {
      return (
        <VenueSliderItem
          key={id}
          venue={venue}
          activeId={this.state.activeSlideId}
          history={this.props.history}
        />
      )
    })
    return (
      <div className='VenueSlider'>
        <Link to={`/${this.props.regionSlug}`} className='VenueSlider__close'>
          <div className='VenueSlider__inner-close' />
        </Link>
        <Slider
          {...SLIDER_SETTINGS}
          initialSlide={reducedVenues[this.props.venue._id].index}
          ref='slickSlider'
          afterChange={this.handleSliderChange}
          beforeChange={this.handleSliderBeforeChange}
          renderedTime={new Date()}
        >
          {/* I WANT CHANGES TO BE SENT HERE: */}
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
