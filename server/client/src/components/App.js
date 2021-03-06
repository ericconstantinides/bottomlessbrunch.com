import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route } from 'react-router'
import cx from 'classnames'

import * as actions from '../actions'
import { parsePath } from '../lib/myHelpers'

import MetaData from './common/MetaData'
import MapPage from './MapPage/MapPage'
// import Region from './Region'
import IntroPage from './IntroPage/IntroPage'
import VenueSlider from './VenueSlider/VenueSlider'
import Admin from './admin'
import RegionsModal from './common/RegionsModal'

// import createHistory from 'history/createBrowserHistory'
// Create a history of your choosing (we're using a browser history in this case)
// let rendered = 0

class App extends Component {
  componentDidMount () {
    // get the regions and the venues
    this.props.fetchRegions()
    this.props.fetchVenues(this.props.calcRegionsMeta)
    this.props.fetchEnvironment()

    this.props.setDrawer()
    window.addEventListener(
      'resize',
      _.debounce(() => this.props.setDrawer(), 250)
    )
  }

  componentWillReceiveProps (nextProps) {
    if (!_.isEmpty(nextProps.regions) && !_.isEmpty(nextProps.venues)) {
      if (!nextProps.ui.siteDataReady) {
        this.props.activateUiSite()
      }
      if (!nextProps.mainMap.loaded) {
        nextProps.getInitialMapLocation(
          nextProps.mainMap.coords,
          nextProps.regions,
          nextProps.history,
          nextProps.ui.drawer
        )
      }
    }
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
  handleRegionSelect = _id => event => {
    // if we have an active region, kill it first:
    if (this.props.ui.activeVenue) {
      this.props.unsetUiVenueSliderPosition()
      this.props.history.replace('/')
    }
    // go to the region's coords (and then coords will set the slug)
    this.props.setMainMapByRegion(
      this.props.regions[_id],
      this.props.mainMap.coords,
      this.props.ui.drawer
    )
    this.props.hideUiRegionsModal()
  }
  handleCloseRegionsModalClick = () => {
    this.props.hideUiRegionsModal()
  }
  render () {
    // let regionRoutes = ''
    // // only create regionRoutes if our map isn't loaded:
    // // console.log('this.props.mainMap.loaded:', this.props.mainMap.loaded)
    // if (!this.props.mainMap.loaded) {
    //   regionRoutes = _.map(this.props.regions, region => (
    //     <Route
    //       key={region._id}
    //       path={`/${region.slug}`}
    //       render={props => <Region {...props} region={region} />}
    //     />
    //   ))
    // }
    let venueSliderRoutes
    if (this.props.ui.siteDataReady) {
      venueSliderRoutes = _.chain(this.props.regions)
        // only choose regions which have bounds
        // (regions with venues are the only ones with bounds)
        .filter(region => region.bounds)
        .map(region => (
          <Route
            key={region._id}
            path={`/${region.slug}/:venueSlug`}
            region={region}
            history={this.props.history}
            render={props => {
              return (
                <VenueSlider
                  history={props.history}
                  match={props.match}
                  region={region}
                />
              )
            }}
          />
        ))
        .value()
    }
    const parsedHistory = parsePath(this.props.history.location.pathname)
    return (
      <div className={cx('App', this.props.ui.appClass)}>
        <MetaData
          venues={this.props.venues}
          regions={this.props.regions}
          path={this.props.history.location.pathname}
          activeRegion={this.props.ui.activeRegion}
          {...this.props.ui}
          activeVenue={this.props.ui.activeVenue}
        />
        <Router history={this.props.history}>
          <div>
            {/* <Route exact path='/' component={MapPage} /> */}
            <Route
              path='/admin'
              render={props => <Admin {...props} admin={this.props.admin} />}
            />
            {venueSliderRoutes}
            {/* {regionRoutes} */}
            {parsedHistory[0] !== 'admin' &&
              this.props.mainMap.loaded &&
              this.props.ui.siteDataReady &&
              <MapPage history={this.props.history} />}
            {parsedHistory[0] !== 'admin' &&
              !this.props.mainMap.loaded &&
              this.props.ui.siteDataReady &&
              <IntroPage history={this.props.history} />}
            {this.props.ui.regionsModalActive &&
              <RegionsModal
                regions={this.props.regions}
                handleCloseRegionsModalClick={this.handleCloseRegionsModalClick}
                handleRegionSelect={this.handleRegionSelect}
              />}
            {parsedHistory[0] !== 'admin' &&
              !this.props.ui.siteDataReady &&
              <div className='Loading'>Pouring <br />Mimosas...</div>}
          </div>
        </Router>
      </div>
    )
  }
}

function mapStateToProps ({ venues, regions, mainMap, ui, admin }) {
  return { venues, regions, mainMap, ui, admin }
}

export default connect(mapStateToProps, actions)(App)
