import React from 'react'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route } from 'react-router'
import AddEditRegion from './regions/AddEditRegion'
import ListRegions from './regions/ListRegions'
import './admin.css'

const Admin = props => {
  return (
    <Router history={props.history}>
      <div>
        <Route
          exact path='/admin/regions/add'
          render={props => <AddEditRegion {...props} />}
        />
        <Route
          exact path='/admin/regions/:id/edit'
          render={props => <AddEditRegion {...props} />}
        />
        <Route exact path='/admin/regions' component={ListRegions} />
      </div>
    </Router>
  )
}

export default Admin