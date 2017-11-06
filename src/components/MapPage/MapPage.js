import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
// import * as viewportUnitsBuggyfill from 'viewport-units-buggyfill'
import _ from 'lodash'

import * as actions from '../../actions'
import { DRAWER } from '../../config'

import Logo from '../common/Logo'
import Map from './Map'
import VenueList from './VenueList'

const LOWEST_Y = 200
const DRAG_TIMEFRAME = 15 // how often it's rechecking the drag position
const TIME_CONSTANT = 325 // how often it's autoscrolling
const MOMENTUM_SPEED = 0.55 // how fast (or slow) to have the momentum
const MOMENTUM_FRICTION = 0.92 // how loose or tight the momentum should be

class MapPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hoveredVenue: '',
      dragItemPressed: false,
      dragItemY: 0,
      linkedDragItemY: 0,
      cursorY: 0,
      // new for inertia:
      timestamp: '',
      intervalId: '',
      frame: 0, // how many pixels were dragged during the timeframe
      velocity: 0, // how fast the last frame was dragged through
      momentumDistance: 0, // how many pixels to travel based on velocity
      momentumTargetY: 0 // the y pos that momentum will take the dragItem
    }
  }
  componentDidMount () {
    document.documentElement.classList.add('html--MapPage')
    document.body.classList.add('body--MapPage')
    this.props.addUiAppClass(['App--MapPage'])
    // viewportUnitsBuggyfill.init()
  }
  componentDidUpdate (prevProps, prevState) {
    console.log('cdu: MapPage.js')
  }
  
  componentWillUnmount () {
    document.documentElement.classList.remove('html--MapPage')
    document.body.classList.remove('body--MapPage')
    this.props.removeUiAppClass(['App--MapPage'])
  }
  handleRegionsModalClick = () => {
    this.props.showUiRegionsModal()
  }
  handleLogoClick = () => {
    this.props.unsetUiVenue()
    this.props.unsetUiRegion()
    this.props.history.push('/')
  }
  handleMouseOver = venue => event => {
    if (this.props.ui.browserSize.width > DRAWER.sm.ends) {
      this.setState({ hoveredVenue: venue._id })
    }
  }
  handleMouseLeave = venue => event => {
    if (this.props.ui.browserSize.width > DRAWER.sm.ends) {
      this.setState({ hoveredVenue: '' })
    }
  }
  toggleMarkerClick = venue => event => {
    // I NEED TO MOVE THE MAP AROUND TO DISPLAY THE HOVERED MARKER THE BEST
    this.setState((prevState, props) => {
      if (prevState.hoveredVenue === venue._id) {
        return { hoveredVenue: '' }
      }
      return { hoveredVenue: venue._id }
    })
  }
  clearMarkers = () => {
    this.setState({ hoveredVenue: '' })
  }
  handleDragStart = e => {
    if (this.props.ui.browserSize.width > DRAWER.sm.ends) return
    console.log('handleDragStart')
    // this is extremely important for iOS (but gives a warnign in chrome):
    e.preventDefault()
    clearInterval(this.state.intervalId)
    const dragItemY = this.getYPosition(this.refs.dragItem)
    const linkedDragItemY = this.getYPosition(this.refs.linkedDragItem)
    // start trackDragging every DRAG_TIMEFRAME ms:
    const intervalId = setInterval(this.trackDragging, DRAG_TIMEFRAME)
    this.setState({
      dragItemPressed: true,
      dragItemY,
      linkedDragItemY,
      cursorY: e.targetTouches ? e.targetTouches[0].pageY : e.pageY,
      timestamp: Date.now(),
      intervalId,
      frame: 0,
      velocity: 0,
      momentumDistance: 0
    })
  }
  // this is where we actually move the items
  handleDragging = e => {
    if (!this.state.dragItemPressed) return
    if (this.props.ui.browserSize.width > DRAWER.sm.ends) return
    console.log('handleDragging')
    e.preventDefault()
    const pageY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY
    const dragDistance = pageY - this.state.cursorY
    const dragItemGoToY = dragDistance + this.state.dragItemY
    this.moveItems(dragItemGoToY)
  }
  handleDragEnd = e => {
    if (this.props.ui.browserSize.width > DRAWER.sm.ends) return
    console.log('handleDragEnd')
    this.setState({ dragItemPressed: false })
    clearInterval(this.state.intervalId)
    const timestamp = Date.now()
    const newDragItemY = this.getYPosition(this.refs.dragItem)
    const travelled = newDragItemY - this.state.dragItemY
    if (
      (this.state.velocity > 10 || this.state.velocity < -10) &&
      Math.abs(travelled) > 20
    ) {
      const momentumDistance = MOMENTUM_FRICTION * this.state.velocity
      const momentumTargetY = Math.round(newDragItemY + momentumDistance)
      window.requestAnimationFrame(this.calculateMomentum)
      this.setState((state, props) => {
        return {
          timestamp,
          momentumTargetY,
          momentumDistance
        }
      })
    }
    e.preventDefault()
  }
  handleScrolling = e => {
    if (this.props.ui.browserSize.width > DRAWER.sm.ends) return
    this.setState((state, props) => {
      return { 
        dragItemY: this.getYPosition(this.refs.dragItem),
        linkedDragItemY: this.getYPosition(this.refs.linkedDragItem)
       }
    }, this.moveItems(this.state.dragItemY - e.deltaY))
  }
  moveItems = goToYUnbounded => {
    const { dragItem, linkedDragItem } = this.refs
    let { dragItemY, linkedDragItemY } = this.state
    if (dragItemY === 0 || linkedDragItemY === 0 ) {
      dragItemY = this.getYPosition(this.refs.dragItem)
      linkedDragItemY = this.getYPosition(this.refs.linkedDragItem)
      this.setState({dragItemY, linkedDragItemY})
    }
    const dragItemHeight = dragItem.offsetHeight
    // make sure we're within our scrolling bounds:
    const goToY = goToYUnbounded <= -dragItemHeight
      ? -dragItemHeight
      : goToYUnbounded >= -LOWEST_Y ? -LOWEST_Y : goToYUnbounded
    const dragDistance = goToY - dragItemY
    const linkedDragItemGoToY = dragDistance / 2 + linkedDragItemY < 0
      ? dragDistance / 2 + linkedDragItemY
      : 0
    linkedDragItem.style.transform = 'translateY(' + linkedDragItemGoToY + 'px)'
    dragItem.style.transform = 'translateY(' + goToY + 'px)'
  }

  getYPosition = myRef => {
    const translateY = parseInt(
      window
        .getComputedStyle(ReactDOM.findDOMNode(myRef))
        .transform.split('matrix(1, 0, 0, 1, 0, ')
        .join('')
        .split(')')
        .join(''),
      10
    )
    if (translateY) return translateY
    return 0
  }

  // tracks the dragging for enabling inertia
  trackDragging = () => {
    const now = Date.now()
    const elapsed = now - this.state.timestamp
    const frame = this.getYPosition(this.refs.dragItem)
    const delta = frame - this.state.frame
    const v = 1000 * delta / (1 + elapsed)
    const velocity = MOMENTUM_SPEED * v + 0.2 * this.state.velocity
    this.setState((state, props) => {
      return {
        timestamp: now,
        frame,
        velocity
      }
    })
  }

  // activates after letting go of list and still in movment
  calculateMomentum = () => {
    if (this.state.momentumDistance) {
      const elapsed = Date.now() - this.state.timestamp
      const delta =
        -this.state.momentumDistance * Math.exp(-elapsed / TIME_CONSTANT)
      if (delta > 0.5 || delta < -0.5) {
        // this is where all the momentum is:
        this.moveItems(this.state.momentumTargetY + delta)
        window.requestAnimationFrame(this.calculateMomentum)
      } else {
        // this is the last of the momentum:
        this.moveItems(this.state.momentumTargetY)
        clearInterval(this.state.intervalId)
      }
    }
  }
  render () {
    if (_.isEmpty(this.props.regions) || _.isEmpty(this.props.venues)) {
      return <div>Loading...</div>
    }
    // const region = this.props.ui.activeRegion
    const styles = { height: `100%`, width: `100%` }
    const drawerState = this.state.drawerOpen ? 'is-open' : 'is-closed'
    return (
      <div className='MapPage'>
        <div
          className='MapPage__Map-container'
          ref='linkedDragItem'
          style={{transform: 'translateY(0px)'}}
        >
          <Map
            venues={this.props.venues}
            handleMouseOver={this.handleMouseOver}
            handleMouseLeave={this.handleMouseLeave}
            toggleMarkerClick={this.toggleMarkerClick}
            clearMarkers={this.clearMarkers}
            hoveredVenue={this.state.hoveredVenue}
            containerElement={<div style={styles} />}
            mapElement={<div style={styles} />}
          />
        </div>
        <Logo
          region={this.props.ui.activeRegion}
          handleLogoClick={this.handleLogoClick}
          handleRegionsModalClick={this.handleRegionsModalClick}
        />
        <div
          className='VenueList__drag'
          ref='dragItem'
          onMouseDown={this.handleDragStart}
          onTouchStart={this.handleDragStart}
          onTouchEnd={this.handleDragEnd}
          onMouseUp={this.handleDragEnd}
          onTouchMove={this.handleDragging}
          onMouseMove={this.handleDragging}
          onWheel={this.handleScrolling}
        >
          <VenueList
            history={this.props.history}
            region={this.props.ui.activeRegion._id}
            handleMouseOver={this.handleMouseOver}
            handleMouseLeave={this.handleMouseLeave}
            toggleMarkerClick={this.toggleMarkerClick}
            hoveredVenue={this.state.hoveredVenue}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ regions, venues, ui }) {
  return { regions, venues, ui }
}

export default connect(mapStateToProps, actions)(MapPage)
