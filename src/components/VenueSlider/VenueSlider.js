import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { connect } from 'react-redux'

import Slider from 'react-slick'
import { getVenueBySlug, objectFunctions } from '../../lib/myHelpers'

import { SLIDER_SETTINGS } from '../../config'
import * as actions from '../../actions'
import VenueSliderItem from './VenueSliderItem'
// let mounted = 1
// let updated = 1
// let unmounted = 1

class VenueSlider extends Component {
  constructor (props) {
    super()
    // const reducedVenues = reduceVenuesByRegion(
    //   props.venues,
    //   props.venues[props.venue._id].regionId
    // )
    this.state = {
      // openId: props.venue._id,
      // nextId: objectFunctions.keys.next(reducedVenues, props.venue._id),
      // prevId: objectFunctions.keys.prev(reducedVenues, props.venue._id)
      openIndex: 0,
      openId: false,
      prevId: false,
      nextId: false,
      reducedVenues: {}
    }
  }
  componentDidMount () {
    // console.log('slider: MOUNTED:', mounted++)
    this.props.removeUiAppClass(['App--MapPage'])
    this.props.addUiAppClass(['App--VenueSlider'])
  }
  componentWillReceiveProps (nextProps) {
    if (!_.isEmpty(nextProps.venues) && _.isEmpty(nextProps.ui.regionVenues)) {
      nextProps.setUiRegionVenues(nextProps.venues, nextProps.region)
    }
    if (!_.isEmpty(nextProps.ui.regionVenues)) {
      // console.log(nextProps.ui.regionVenues)
      if (!this.state.openId) {
        const venue = getVenueBySlug(
          nextProps.ui.regionVenues,
          nextProps.match.params.venueSlug
        )
        const nextId = objectFunctions.keys.next(nextProps.ui.regionVenues, venue._id)
        const prevId = objectFunctions.keys.prev(nextProps.ui.regionVenues, venue._id)
        this.setState((prevstate, props) => ({
          openId: venue._id, nextId, prevId
        }))
        this.props.setUiVenue(venue._id, nextId, prevId)
      }
    }
    // load the venues when
    // a) the venues are loaded AND
    // b) the reducedVenues isn't yet set
    // if (!_.isEmpty(nextProps.venues)) {
    //   const reducedVenues = reduceVenuesByRegion(
    //     nextProps.venues,
    //     nextProps.region._id
    //   )
    //   if (!this.state.openId) {
    //     const venue = getVenueBySlug(
    //       reducedVenues,
    //       nextProps.match.params.region
    //     )
    //     this.setState((prevstate, props) => ({
    //       openId: venue._id,
    //       nextId: objectFunctions.keys.next(reducedVenues, venue._id),
    //       prevId: objectFunctions.keys.prev(reducedVenues, venue._id),
    //     }))
    //   }
    // }
  }
  
  // shouldComponentUpdate (nextProps, nextState) {
  //   if (_.isEmpty(nextProps.ui.regionVenues)) {
  //     return true
  //   }
  //   return false
  // }

  componentDidUpdate (prevProps, prevState) {
    // console.log('slider: UPDATED:', updated++)
  }
  componentWillUnmount () {
    // unset the venueUI:
    // console.log('slider: UNMOUNTED:', unmounted++)
    this.props.unsetUiRegionVenues()
    this.props.unsetUiVenue()
    this.props.removeUiAppClass(['App--VenueSlider'])
    this.props.addUiAppClass(['App--MapPage'])
  }
  handleSliderBeforeChange = (prevIndex, index) => {}

  handleSliderChange = index => {
    // console.log('post index:', index)
    this.setState({ openIndex: index })
    _.map(this.props.ui.regionVenues, venue => {
      if (venue.index === index) {
        const nextId = objectFunctions.keys.next(this.props.ui.regionVenues, venue._id)
        const prevId = objectFunctions.keys.prev(this.props.ui.regionVenues, venue._id)
        this.setState((prevState, props) => ({
          openId: venue._id, nextId, prevId
        }))
        // const activeVenue = reducedVenues[venue._id]
        this.props.history.push(`/${this.props.region.slug}/${venue.slug}`)
        this.props.setUiVenue(venue._id, nextId, prevId)
      }
    })
  }
  handleShare = service => event => {
    console.log(service)
  }
  render () {
    if (_.isEmpty(this.props.ui.regionVenues)) {
      return <div>No Venues Available</div>
    }
    let slideNum = 0
    const sliderItems = _.map(this.props.ui.regionVenues, venue => {
      // MAKE THIS SMARTER
      // ADD isActive={true/false}
      // ADD isNext={true/false}
      // ADD isPrev={true/false}
      return (
        <VenueSliderItem
          key={venue._id}
          venueId={venue._id}
          slideNum={slideNum++}
          history={this.props.history}
          regionSlug={this.props.region.slug}
          isActive={venue._id === this.state.openId}
          isNext={venue._id === this.state.nextId}
          isPrev={venue._id === this.state.prevId}
        />
      )
    })
    return (
      <div className='VenueSlider layout__transparency-bg'>
        <Link to={`/${this.props.region.slug}`} className='VenueSlider__close'>
          <div className='VenueSlider__inner-close' />
        </Link>
        <Slider
          {...SLIDER_SETTINGS}
          initialSlide={this.props.ui.regionVenues[this.state.openId].index}
          ref='slickSlider'
          afterChange={this.handleSliderChange}
          beforeChange={this.handleSliderBeforeChange}
        >
          {sliderItems}
        </Slider>
      </div>
    )
  }
}

function mapStateToProps ({ venues, regions, ui }) {
  return { venues, regions, ui }
}

export default connect(mapStateToProps, actions)(VenueSlider)
