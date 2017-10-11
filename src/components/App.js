import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route } from 'react-router'
import PageTitle from 'react-document-title'

import * as actions from '../actions'
import { parsePath } from '../lib/myHelpers'
import { SITE_NAME, SITE_SLOGAN } from '../config'

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
    this.props.fetchVenues()
  }
  render () {
    const { region, regionName, venueName, venueOpenId } = this.props.ui
    const pageTitle = region && venueOpenId
      // venue:
      ? `${venueName} in ${regionName} for Bottomless Brunch`
      : region
          // region:
          ? `${regionName} Bottomless Brunch & Mimosas Locations`
          // homepage:
          : `Bottomless Brunch: ${SITE_SLOGAN}`
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
      <PageTitle title={pageTitle}>
        <Router history={history}>
          <div className='App'>
            {/* <Route exact path='/' component={MapPage} /> */}
            <Route path='/admin' render={props => <Admin {...props} />} />
            {venueRoutes}
            {regionRoutes}
            {parsedHistory[0] !== 'admin' &&
              this.props.ui.region &&
              <MapPage history={history} />}
            {parsedHistory[0] !== 'admin' &&
              !this.props.ui.region &&
              <IntroPage history={history} />}
          </div>
        </Router>
      </PageTitle>
    )
  }
}

function mapStateToProps ({ venues, regions, ui }) {
  // get the region name:
  if (ui.region && Object.entries(regions).length) {
    ui.regionName = regions[ui.region].name
  }
  // get the venue name:
  if (ui.venueOpenId && Object.entries(venues).length) {
    ui.venueName = venues[ui.venueOpenId].name
  }
  return { venues, regions, ui }
}

export default connect(mapStateToProps, actions)(App)
