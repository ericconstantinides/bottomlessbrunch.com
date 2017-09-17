import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router'

import Home from './Home'
import VenuePage from './VenuePage'

import createHistory from 'history/createBrowserHistory'
// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

class App extends Component {
  componentWillMount () {
    // get the regions and the venues
    this.props.fetchRegions()
    this.props.fetchVenues()
  }
  render () {
    return (
      <div className='App'>
        <ConnectedRouter history={history}>
          <div className='App'>
            {/* <Route exact path='/' component={Home} /> */}
            <Route
              path='/san-francisco/mission-rock-resort-potrero'
              component={VenuePage}
            />
            <Home />
          </div>
        </ConnectedRouter>
      </div>
    )
  }
}

function mapStateToProps ({ venues }) {
  return { venues }
}

export default connect(mapStateToProps, actions)(App)
