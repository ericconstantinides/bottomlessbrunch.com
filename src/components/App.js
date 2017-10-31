import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route } from 'react-router'
import cx from 'classnames'

import * as actions from '../actions'
import { parsePath, reduceVenuesByRegion } from '../lib/myHelpers'

import MetaData from './common/MetaData'
import MapPage from './MapPage/MapPage'
import Region from './Region'
import IntroPage from './IntroPage/IntroPage'
import VenueSlider from './VenueSlider/VenueSlider'
import Admin from './admin'
import RegionsModal from './common/RegionsModal'

// import createHistory from 'history/createBrowserHistory'
// Create a history of your choosing (we're using a browser history in this case)
// let rendered = 0


class App extends Component {
  handleCloseRegionsModalClick = () => {
    this.props.hideUiRegionsModal()
  }
  componentDidMount () {
    // get the regions and the venues
    this.props.fetchRegions(
      this.props.history,
      // add a callback to fetchUiRegion using history
      this.props.fetchUiRegion
    )
    this.props.fetchVenues(this.props.calcRegionsBoundsByVenues)
    this.props.fetchEnvironment()

    this.props.setUiBrowserSize()
    window.addEventListener(
      'resize',
      _.debounce(this.props.setUiBrowserSize, 300)
    )
  }
  // shouldComponentUpdate (nextProps, nextState) {
  //   console.log(rendered++)
  //   if (rendered <= 10) {
  //     console.log('App Rendered')
  //     return true
  //   }
  //   console.log('App NOT Rendered')
  //   return false
  // }
  
  componentWillUnmount () {
    window.removeEventListener('resize', this.props.setUiBrowserSize)
  }
  /* componentDidUpdate (prevProps, prevState) {
    // this changes the position of data-react-helmet="true"
    const metaElements = document.querySelectorAll('[data-react-helmet]')
    metaElements.forEach(metaEl => {
      let tempAttributes = []
      tempAttributes.push(metaEl.attributes.getNamedItem('data-react-helmet'))
      metaEl.removeAttribute('data-react-helmet')
      ;[...metaEl.attributes].forEach((attr, i) => {
        tempAttributes.push(attr)
        metaEl.removeAttribute(attr.name)
      })
      tempAttributes.forEach(attr => {
        metaEl.setAttribute(attr.name, attr.value)
      })
    })
  } */
  render () {
    const regionRoutes = _.map(this.props.regions, region => (
      <Route
        key={region._id}
        path={`/${region.slug}`}
        render={props => <Region {...props} region={region} />}
      />
    ))
    let venueSliderRoutes
    if (!_.isEmpty(this.props.regions)) {
      venueSliderRoutes = _
        .chain(this.props.regions)
        // only choose regions which have bounds
        // (regions with venues are the only ones with bounds)
        .filter(region => region.bounds)
        .map(region => (
          <Route
            key={region._id}
            path={`/${region.slug}/*`}
            region={region}
            history={this.props.history}
            render={props => (
              <VenueSlider
                history={props.history}
                match={props.match}
                region={region}
              />
            )}
          />
        ))
        .value()
    }
    const parsedHistory = parsePath(this.props.history.location.pathname)
    return (
      <div className={cx('App', this.props.ui.appClass)}>
        <Router history={this.props.history}>
          <div>
            <MetaData venues={this.props.venues} path={this.props.history.location.pathname} {...this.props.ui} />
            {/* <Route exact path='/' component={MapPage} /> */}
            <Route path='/admin' render={props => <Admin {...props} admin={this.props.admin} />} />
            {venueSliderRoutes}
            {regionRoutes}
            {parsedHistory[0] !== 'admin' &&
              !_.isEmpty(this.props.ui.activeRegion) &&
              <MapPage history={this.props.history} />}
            {parsedHistory[0] !== 'admin' &&
              _.isEmpty(this.props.ui.activeRegion) &&
              <IntroPage history={this.props.history} />}
            {this.props.ui.regionsModalActive &&
              <RegionsModal
                regions={this.props.regions}
                activeRegion={this.props.activeRegion}
                handleCloseRegionsModalClick={this.handleCloseRegionsModalClick}
              />
            }
          </div>
        </Router>
      </div>
    )
  }
}

function mapStateToProps ({ venues, regions, ui, admin }) {
  // get the region name:
  if (!_.isEmpty(ui.activeRegion)) {
    ui.regionName = ui.activeRegion.name
    ui.regionState = ui.activeRegion.state
    if (!_.isEmpty(venues)) {
      ui.numOfVenues = _.size(reduceVenuesByRegion(venues, ui.activeRegion._id))
    }
  }
  // get the venue name:
  if (ui.venueOpenId && !_.isEmpty(venues)) {
    ui.venueName = venues[ui.venueOpenId].name
  }
  return { venues, regions, ui, admin }
}

export default connect(mapStateToProps, actions)(App)
