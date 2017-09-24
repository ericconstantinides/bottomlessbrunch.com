import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import * as actions from '../../../actions'
import './AdminRegions.css'

const AdminRegion = ({ _id, name, slug, position, zoom, handleDelete }) => {
  return (
    <div className='AdminRegion'>
      <h2>{name}</h2>
      <p>_id: {_id}</p>
      <p>slug: {slug}</p>
      <p>lat: {position.lat}</p>
      <p>lng: {position.lng}</p>
      <p>zoom: {zoom}</p>
      <Link
        to={`/admin/regions/${_id}/edit`}
        className='btn btn-sm btn-primary'
      >
        Edit
      </Link>
      <button onClick={handleDelete(_id, name)} className='btn btn-sm btn-danger'>
        Delete
      </button>
      <hr />
    </div>
  )
}

class AdminRegions extends Component {
  handleDelete = (_id, name) => event => {
    if (window.confirm(`Are you sure you want to delete "${name}"`)) {
      this.props.deleteRegion(_id, this.props.history)
    }
  }
  render () {
    return (
      <div className='AdminRegions container'>
        {_.map(this.props.regions, region => (
          <AdminRegion
            key={region._id}
            {...region}
            handleDelete={this.handleDelete}
          />
        ))}
        <Link to='/admin/regions/add' className='btn btn-sm btn-primary'>
          Add Region
        </Link>
      </div>
    )
  }
}

function mapStateToProps ({ regions }) {
  return { regions }
}

export default connect(mapStateToProps, actions)(AdminRegions)
