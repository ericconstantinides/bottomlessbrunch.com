import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactGA from 'react-ga'
import * as actions from '../actions'
import Home from './Home'
import VenuePage from './VenuePage'
import './App.css'

ReactGA.initialize('UA-21524856-1')

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
  chooseRender () {
    const openVenue = this.props.venues.filter(venue => venue.open)
    if (openVenue.length) {
      return <VenuePage {...openVenue[0]} />
    }
    return <Home />
  }
  render () {
    return (
      <div className='App'>
        <Route path='/' component={Analytics} />
        {this.chooseRender()}
      </div>
    )
  }
}

function mapStateToProps ({ venues}) {
  return { venues }
}

export default connect(mapStateToProps, actions)(App)
