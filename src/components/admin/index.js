import React, { Component } from 'react'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route } from 'react-router'
import AddEditRegion from './regions/AddEditRegion'
import ListRegions from './regions/ListRegions'
import './admin.css'

class Admin extends Component {
  render () {
    return (
      <div>
        <Router history={this.props.history}>
          <div className='Question-Am-I-necessary'>
            <Route exact path='/admin/regions/add' component={AddEditRegion} />
            <Route exact path='/admin/regions/:id/edit' component={AddEditRegion} />
            <Route exact path='/admin/regions' component={ListRegions} />
          </div>
        </Router>
      </div>
    )
  }
}

export default Admin
