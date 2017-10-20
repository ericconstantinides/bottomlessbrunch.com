import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route } from 'react-router'

import * as actions from '../actions'
import { parsePath, reduceVenuesByRegion } from '../lib/myHelpers'

import MetaData from './common/MetaData'
import MapPage from './MapPage/MapPage'
import Region from './Region'
import IntroPage from './IntroPage/IntroPage'
import VenuePage from './VenuePage/VenuePage'
import Admin from './admin'

import createHistory from 'history/createBrowserHistory'
// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

class App extends Component {
  componentDidMount () {
    // get the regions and the venues
    this.props.fetchRegions(
      history,
      // add a callback to fetchUiRegion using history
      this.props.fetchUiRegion
    )
    this.props.fetchVenues(this.props.calcRegionsBoundsByVenues)

    this.props.setUiBrowserSize()
    window.addEventListener(
      'resize',
      _.debounce(this.props.setUiBrowserSize, 300)
    )
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.props.setUiBrowserSize)
  }
  componentDidUpdate (prevProps, prevState) {
    // need to change the position of data-react-helmet="true"
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
  }
  render () {
    const regionRoutes = _.map(this.props.regions, region => (
      <Route
        key={region._id}
        path={`/${region.slug}`}
        render={props => <Region {...props} region={region} />}
      />
    ))
    // create the Venue Routes:
    let venueRoutes = null
    if (!_.isEmpty(this.props.regions) && !_.isEmpty(this.props.venues)) {
      venueRoutes = _.map(this.props.venues, venue => {
        return (
          <Route
            key={venue._id}
            path={`/${this.props.regions[venue.regionId].slug}/${venue.slug}`}
            render={props => {
              // the {...props} give us history stuffs
              return (
                <VenuePage
                  {...props}
                  venue={venue}
                  venueId={venue._id}
                  gpId={venue.gpId}
                  regionSlug={this.props.regions[venue.regionId].slug}
                />
              )
            }}
          />
        )
      })
    }
    const parsedHistory = parsePath(history.location.pathname)
    return (
      <div>
        <Router history={history}>
          <div className='App'>
            <MetaData path={history.location.pathname} {...this.props.ui} />
            {/* <Route exact path='/' component={MapPage} /> */}
            <Route path='/admin' render={props => <Admin {...props} />} />
            {venueRoutes}
            {regionRoutes}
            {parsedHistory[0] !== 'admin' &&
              !_.isEmpty(this.props.ui.activeRegionObj) &&
              <MapPage history={history} />}
            {parsedHistory[0] !== 'admin' &&
              _.isEmpty(this.props.ui.activeRegionObj) &&
              <IntroPage history={history} />}
          </div>
        </Router>
      </div>
    )
  }
}

function mapStateToProps ({ venues, regions, ui }) {
  // get the region name:
  if (!_.isEmpty(ui.activeRegionObj)) {
    ui.regionName = ui.activeRegionObj.name
    ui.regionState = ui.activeRegionObj.state
    if (Object.entries(venues).length) {
      ui.numOfVenues = _.size(reduceVenuesByRegion(venues, ui.activeRegionObj._id))
    }
  }
  // get the venue name:
  if (ui.venueOpenId && Object.entries(venues).length) {
    ui.venueName = venues[ui.venueOpenId].name
  }
  return { venues, regions, ui }
}

export default connect(mapStateToProps, actions)(App)
