import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as actions from '../actions'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route } from 'react-router'
import { parsePath } from '../lib/myHelpers'

import MapPage from './MapPage'
import VenuePage from './VenuePage'
import Admin from './admin'

import createHistory from 'history/createBrowserHistory'
// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

class App extends Component {
  componentWillMount () {
    // get the regions and the venues
    this.props.fetchRegions()
    this.props.fetchVenues()
    this.props.setRegionUi('59c4a61488348f8102580f25')
  }
  componentWillReceiveProps (nextProps) {
    /*     if (nextProps.regions && nextProps.regions[0]) {
      const { history } = this.props

      // first get the region from the URL (if any)
      const regionUrl = (history.location.pathname).replace('/', '').split('/')[0]

      if (regionUrl) {
        const regionUrlId = _.filter(nextProps.regions, region => {
          if (region.slug === regionUrl) return region
        })[0].id
        if (typeof regionUrlId !== 'undefined' && !isNaN(regionUrlId)) {
          this.props.setRegionUi(regionUrlId)
        } else {
          this.props.setRegionUi(0)
        }
      } else {
        this.props.setRegionUi(0)
      }
    } */
  }
  render () {
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
                  googlePlacesId={venue.googlePlacesId}
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
      <div className='App'>
        <Router history={history}>
          <div className='App'>
            {/* <Route exact path='/' component={MapPage} /> */}
            <Route path='/admin' render={props => <Admin {...props} />} />
            {venueRoutes}
            {parsedHistory[0] !== 'admin' && <MapPage history={history} />}
          </div>
        </Router>
      </div>
    )
  }
}

function mapStateToProps ({ venues, regions }) {
  return { venues, regions }
}

export default connect(mapStateToProps, actions)(App)
