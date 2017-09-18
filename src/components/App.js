import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as actions from '../actions'
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router'

import MapPage from './MapPage'
import VenuePage from './VenuePage'

import createHistory from 'history/createBrowserHistory'
// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

class App extends Component {
  componentWillMount () {
    // get the regions and the venues
    this.props.fetchRegions()
    this.props.fetchVenues()
    this.props.setRegionUi(0)
  }
  render () {
    const venueRoutes = _.map(this.props.venues, venue => {
      return (
        <Route
          path={`/${venue.regionSlug}/${venue.slug}`}
          key={`/${venue.regionSlug}/${venue.slug}`}
          render={props => {
            return <VenuePage {...props} venue={venue} />
          }}
        />
      )
    })
    return (
      <div className='App'>
        <ConnectedRouter history={history}>
          <div className='App'>
            {/* <Route exact path='/' component={MapPage} /> */}
            {venueRoutes}
            <MapPage />
          </div>
        </ConnectedRouter>
      </div>
    )
  }
}

function mapStateToProps ({ venues, regions }) {
  return { venues, regions }
}

export default connect(mapStateToProps, actions)(App)
