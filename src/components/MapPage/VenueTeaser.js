import React, { Component } from 'react'
import AnimateHeight from 'react-animate-height'

import Deals from '../common/Deals'

const offsetPadding = 4

class VenueTeaser extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: false,
      isPositioned: false,
      teaserSide: 'right',
      offVert: 0
    }
  }
  componentWillReceiveProps (nextProps) {
    // set the isActve bool based on if this venue is the hovered venue:
    this.setState({ isActive: nextProps.venue._id === nextProps.hoveredVenue })
  }
  shouldComponentUpdate (nextProps, nextState) {
    // return TRUE if there's a change in the isActive bool
    if (
      this.state.isActive !== nextState.isActive ||
      this.state.isPositioned !== nextState.isPositioned ||
      this.props.venue.fetchedLevel !== nextProps.venue.fetchedLevel ||
      this.props.filtered !== nextProps.filtered
    ) {
      return true
    }
    return false
  }
  componentDidUpdate (prevProps, prevState) {
    // after the element is active and it's a MapItem...
    // Now we check if it's been positioned
    if (
      this.state.isActive &&
      this.props.altClass === 'MapItem' &&
      !this.state.isPositioned
    ) {
      // We set Positioning now:
      const elPos = this.domVenue.getBoundingClientRect()
      const {
        offset_top: offsetTop,
        offset_bottom: offsetBottom,
        brwsrHeight,
        brwsrWidth
      } = this.props.drawer
      const newBottom = brwsrHeight - offsetBottom
      const teaserSide = elPos.right > brwsrWidth ? 'left' : 'right'
      const offVert = elPos.top < offsetTop
        ? elPos.top * -1 + offsetTop + offsetPadding
        : elPos.bottom > newBottom
            ? (elPos.bottom - newBottom + offsetPadding) * -1
            : 0
      this.setState({ offVert, teaserSide, isPositioned: true })
    }
    // reset everything if going inActive:
    if (prevState.isActive && !this.state.isActive) {
      // wait 150ms for the off transition to finish:
      setTimeout(() => {
        this.setState({ offVert: 0, teaserSide: 'right', isPositioned: false })
      }, 150)
    }
  }
  renderTeaser = () => {
    const {
      venue,
      handleMouseOver,
      handleMouseLeave,
      toggleMarkerClick,
      altClass,
      filtered
    } = this.props
    const hovered = this.state.isActive ? 'is-hovered' : 'not-hovered'
    const side = this.state.teaserSide === 'right' ? 'is-right' : 'is-left'
    const filterClass = filtered ? 'is-filtered' : 'not-filtered'

    const offsetStyles = altClass === 'MapItem'
      ? { transform: `translateY(${this.state.offVert}px)` }
      : {}
    return (
      <article
        className={`VenueTeaser ${altClass} ${hovered} ${side} ${filterClass}`}
        onMouseEnter={handleMouseOver(venue)}
        onMouseLeave={handleMouseLeave(venue)}
        onClick={toggleMarkerClick(venue, altClass)}
      >
        {altClass === 'MapItem' &&
          <div className='MapItem__marker-container'>
            <span className='MapItem__mimosa' />
            <span className='MapItem__marker' />
            <span className='MapItem__pointer' />
          </div>}
        <div
          className={`VenueTeaser__link ${altClass}__link`}
          onClick={this.props.handleVenueTeaserLinkClick(venue._id)}
        >
          <div
            ref={ven => {
              this.domVenue = ven
            }}
            style={offsetStyles}
            className={`VenueTeaser__inner ${altClass}__inner`}
          >
            {venue.thumbUrl &&
              <div
                className={`VenueTeaser__image-container ${altClass}__image-container`}
                style={{ backgroundImage: `url(${venue.thumbUrl})` }}
              />}
            <div className={`VenueTeaser__content ${altClass}__content`}>
              <h3 className={`VenueTeaser__title ${altClass}__title`}>
                {venue.name}
              </h3>
              {venue.address &&
                <p className={`VenueTeaser__address VenueTeaser__p ${altClass}__p`}>
                  {venue.address.street}, {venue.address.city}
                </p>}
              {/* {funTimes &&
                <div className={`VenueTeaser__funtimes ${altClass}__funtimes`}>
                  <h4 className={`VenueTeaser__sub-title ${altClass}__sub-title`}>
                    Go Bottomless
                  </h4>
                  {funTimes.map((fun, i) => (
                    <p key={i} className={`VenueTeaser__p ${altClass}__p`}>
                      <strong>{fun.day}</strong> {fun.startTime} - {fun.endTime}
                    </p>
                  ))}
                </div>
              } */}
              {venue.funItems &&
                venue.funItems.length &&
                <Deals venue={venue} />}
              <button
                className={`VenueTeaser__more-info ${altClass}__more-info`}
              >
                <span className='text chevron-after'>More Info</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    )
  }
  render () {
    // const funTimes = compileDays(venue.funTimes, 'Bottomless Brunch', venue.name)
    if (this.props.altClass === 'MapItem') {
      return (
        <div>
          {this.renderTeaser()}
        </div>
      )
    }
    return (
      <AnimateHeight
        duration={250}
        className={`${this.props.altClass}__container`}
        height={this.props.filtered ? 0 : 'auto'}
      >
        {this.renderTeaser()}
      </AnimateHeight>
    )
  }
}

export default VenueTeaser
