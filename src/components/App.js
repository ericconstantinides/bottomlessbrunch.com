import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import ReactGA from 'react-ga'
import Home from './Home'
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
  render () {
    return (
      <div className='App'>
        <Route path='/' component={Analytics} />
        <Route exact path='/' component={Home} />
      </div>
    )
  }
}

export default App
