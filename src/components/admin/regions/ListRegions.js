import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import * as actions from '../../../actions'


const AdminRegion = props => {
  // const { _id, name, state, gpId, slug, lat, lng, zoom, handleDelete } = props
  const { _id, name, state, slug, handleDelete } = props
  return (
    <div className='AdminVenue'>
      <hr />
        <div className='AdminVenue__inner'>
        <Link
          to={`/admin/regions/${_id}/edit`}
          className='btn btn-sm btn-primary'
        >
          Edit
        </Link>
        <button
          onClick={handleDelete(_id, name)}
          className='btn btn-sm btn-danger'
        >
          Delete
        </button>
        <Link to={`/${slug}`}>
          <h2>{name}{state && `, ${state}`}</h2>
        </Link>
        {/* <p>slug: {slug}</p>
        <p>lat: {lat}</p>
        <p>lng: {lng}</p>
        <p>zoom: {zoom}</p>
        <p>gpId: {gpId}</p> */}
      </div>
    </div>
  )
}

class ListRegions extends Component {
  handleDelete = (_id, name) => event => {
    if (window.confirm(`Are you sure you want to delete "${name}"`)) {
      this.props.deleteRegion(_id, this.props.history)
    }
  }
  render () {
    return (
      <div className='AdminRegions container'>
        <Link to='/admin/regions/add' className='btn btn-sm btn-primary'>
          Add Region
        </Link>
        {_.map(this.props.regions, region => (
          <AdminRegion
            key={region._id}
            {...region}
            handleDelete={this.handleDelete}
          />
        ))}
      </div>
    )
  }
}

function mapStateToProps ({ regions }) {
  return { regions }
}

export default connect(mapStateToProps, actions)(ListRegions)
