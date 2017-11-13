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
    if (!_.isEmpty(nextProps.mainMap.visibleVenuesArr) && 1 === 2) {
      // console.log(nextProps.mainMap.visibleVenuesArr)
      if (!this.state.openId) {
        const venue = getVenueBySlug(
          nextProps.mainMap.visibleVenuesArr,
          nextProps.match.params.venueSlug
        )
        const nextId = objectFunctions.keys.next(
          nextProps.mainMap.visibleVenuesArr,
          venue._id
        )
        const prevId = objectFunctions.keys.prev(
          nextProps.mainMap.visibleVenuesArr,
          venue._id
        )
        this.setState((prevstate, props) => ({
          openId: venue._id,
          nextId,
          prevId
        }))
        this.props.setUiVenueTBD(venue._id, nextId, prevId)
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
  //   if (_.isEmpty(nextProps.mainMap.visibleVenuesArr)) {
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

  handleSliderChange = sliderPos => {
    // console.log('post sliderPos:', sliderPos)
    this.setState({ openIndex: sliderPos })
    const {mainMap: {visibleVenuesArr: visVenues}, venues, history} = this.props
    this.props.mainMap.visibleVenuesArr.forEach((venueId, index) => {
      if (index === sliderPos) {
        this.props.setUiVenue(venues, visVenues, index, history)
      }
    })
  }
  handleShare = service => event => {
    console.log(service)
  }
  render () {
    if (_.isEmpty(this.props.mainMap.visibleVenuesArr)) {
      return <div>No Venues Available</div>
    }
    let slideNum = 0
    let initialSlide = 0
    const sliderItems = this.props.mainMap.visibleVenuesArr.map(
      (venueId, index) => {
        // MAKE THIS SMARTER
        // ADD isActive={true/false}
        // ADD isNext={true/false}
        // ADD isPrev={true/false}
        const venue = this.props.venues[venueId]
        if (venue._id === this.props.ui.venueOpenId) {
          initialSlide = index
        }
        return (
          <VenueSliderItem
            key={venue._id}
            venueId={venue._id}
            slideNum={slideNum++}
            history={this.props.history}
            regionSlug={this.props.region.slug}
            isActive={venue._id === this.props.ui.venueOpenId}
            isPrev={venue._id === this.props.ui.venuePrevId}
            isNext={venue._id === this.props.ui.venueNextId}
            index={index}
          />
        )
      }
    )
    return (
      <div className='VenueSlider'>
        <Link to={`/${this.props.region.slug}`} className='VenueSlider__close'>
          <div className='VenueSlider__inner-close' />
        </Link>
        <Slider
          {...SLIDER_SETTINGS}
          initialSlide={initialSlide}
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

function mapStateToProps ({ venues, regions, ui, mainMap }) {
  return { venues, regions, ui, mainMap }
}

export default connect(mapStateToProps, actions)(VenueSlider)
