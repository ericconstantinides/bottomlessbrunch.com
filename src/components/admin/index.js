import React from 'react'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route } from 'react-router'

import AddEditRegion from './regions/AddEditRegion'
import ListRegions from './regions/ListRegions'
import AddEditVenue from './venues/AddEditVenue'
import ListVenues from './venues/ListVenues'

const Admin = props => {
  return (
    <Router history={props.history}>
      <div>
        <Route exact path='/admin/regions' component={ListRegions} />
        <Route
          exact path='/admin/regions/add'
          render={props => <AddEditRegion {...props} />}
        />
        <Route
          exact path='/admin/regions/:id/edit'
          render={props => <AddEditRegion {...props} />}
        />
        <Route exact path='/admin/venues' component={ListVenues} />
        <Route
          exact path='/admin/venues/add'
          render={props => <AddEditVenue {...props} />}
        />
        <Route
          exact path='/admin/venues/:id/edit'
          render={props => <AddEditVenue {...props} />}
        />
      </div>
    </Router>
  )
}

export default Admin
