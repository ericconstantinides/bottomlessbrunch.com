import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { connect } from 'react-redux'

import Slider from 'react-slick'
import { reduceVenuesByRegion, objectFunctions } from '../../lib/myHelpers'

import { SLIDER_SETTINGS } from '../../config'
import * as actions from '../../actions'
import VenueSliderItem from './VenueSliderItem'
let mounted = 1
let updated = 1
let unmounted = 1

class VenueSlider extends Component {
  constructor (props) {
    super()
    const reducedVenues = reduceVenuesByRegion(props.venues, props.venues[props.venue._id].regionId)
    this.state = {
      activeSlideIndex: 0,
      activeSlideId: props.venue._id,
      nextId: objectFunctions.keys.next(reducedVenues, props.venue._id),
      prevId: objectFunctions.keys.prev(reducedVenues, props.venue._id)
    }
  }
  componentDidMount () {
    console.log('slider: MOUNTED:', mounted++)
    this.props.removeUiAppClass(['App--MapPage'])
    this.props.addUiAppClass(['App--VenueSlider'])
  }
  // shouldComponentUpdate (nextProps, nextState) {
    // return false
  // }
  
  componentDidUpdate (prevProps, prevState) {
    // console.log('slider: UPDATED:', updated++)
  }
  componentWillUnmount () {
    // unset the venueUI:
    console.log('slider: UNMOUNTED:', unmounted++)
    this.props.unsetUiVenue()
    this.props.removeUiAppClass(['App--VenueSlider'])
    this.props.addUiAppClass(['App--MapPage'])
  }
  handleSliderBeforeChange = (prevIndex, index) => {

  }
  handleSliderChange = (index) => {
    // console.log('post index:', index)
    this.setState({activeSlideIndex: index})
    const { venues, venue } = this.props
    const reducedVenues = reduceVenuesByRegion(venues, venues[venue._id].regionId)
    _.map(reducedVenues, venue => {
      if (venue.index === index) {
        this.setState((prevState, props) => ({
          activeSlideId: venue._id,
          nextId: objectFunctions.keys.next(reducedVenues, venue._id),
          prevId: objectFunctions.keys.prev(reducedVenues, venue._id)
        }))
        // const activeVenue = reducedVenues[venue._id]
        // this.props.history.push(`/${this.props.regionSlug}/${activeVenue.slug}`)
        this.props.setUiVenue(this.state.activeSlideId)
      }
    })
  }
  handleShare = service => event => {
    console.log(service)
  }
  render () {
    const { venues, venueId } = this.props
    // reduce the venues by region to get all your slider items!
    const reducedVenues = reduceVenuesByRegion(venues, venues[venueId].regionId)
    const sliderItems = _.map(reducedVenues, (venue, id) => {
      // MAKE THIS SMARTER
      // ADD isActive={true/false}
      // ADD isNext={true/false}
      // ADD isPrev={true/false}
      return (
        <VenueSliderItem
          key={id}
          venue={venue}
          activeId={this.state.activeSlideId}
          nextId={this.state.nextId}
          prevId={this.state.prevId}
          history={this.props.history}
          regionSlug={this.props.regionSlug}
          isActive={id === this.state.activeSlideId}
          isNext={id === this.state.nextId}
          isPrev={id === this.state.prevId}
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
