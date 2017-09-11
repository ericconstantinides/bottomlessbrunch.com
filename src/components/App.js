import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactGA from 'react-ga'
import * as actions from '../actions'
import Home from './Home'
import VenuePage from './VenuePage'
import { googleGa } from '../config'
import './App.css'

ReactGA.initialize(googleGa)

/**
 * @return {null}
 */
function Analytics (props) {
  ReactGA.set({ page: props.location.pathname + props.location.search })
  ReactGA.pageview(props.location.pathname + props.location.search)
  return null
}

class App extends Component {
  componentWillMount () {
    // get the venues
    this.props.fetchVenues()
  }
  render () {
    const openVenue = this.props.venues.filter(venue => venue.open)[0]
    const openVenueRendered = openVenue ? <VenuePage {...openVenue} /> : ''
    return (
      <div className='App'>
        <Route path='/' component={Analytics} />
        {openVenueRendered}
        <Home />
      </div>
    )
  }
}

function mapStateToProps ({ venues }) {
  return { venues }
}

export default connect(mapStateToProps, actions)(App)
