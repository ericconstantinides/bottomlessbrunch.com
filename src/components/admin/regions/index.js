import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import './AdminRegions.css'

const AdminRegion = ({ _id, name, slug, position, zoom }) => {
  return (
    <div className='AdminRegion'>
      <h2>{name}</h2>
      <p>_id: {_id}</p>
      <p>slug: {slug}</p>
      <p>lat: {position.lat}</p>
      <p>lng: {position.lng}</p>
      <p>zoom: {zoom}</p>
      <Link to={`/admin/regions/${_id}/edit`} className='btn btn-sm btn-primary'>Edit</Link>
      <button className='btn btn-sm btn-danger'>Delete</button>
      <hr />
    </div>
  )
}

class AdminRegions extends Component {
  render () {
    return (
      <div className='AdminRegions container'>
        {_.map(this.props.regions, region => (
          <AdminRegion key={region._id} {...region} />
        ))}
        <Link to='/admin/regions/add' className='btn btn-sm btn-primary'>Add Region</Link>
      </div>
    )
  }
}

function mapStateToProps ({ regions }) {
  return { regions }
}

export default connect(mapStateToProps)(AdminRegions)
