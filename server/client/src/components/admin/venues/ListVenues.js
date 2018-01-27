import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import RegionSelect from '../../common/RegionSelect'
import _ from 'lodash'
import * as actions from '../../../actions'


const AdminVenueTeaser = ({ _id, name, lat, lng, zoom, gData, handleDelete, currentRegion }) => {
  return (
    <div className='AdminVenue'>
      <hr />
      <div className='AdminVenue__inner'>
        {gData && gData.images && 
          <img src={gData.images.thumb[0].url} alt='' />
        }
        <Link
          to={`/admin/venues/${_id}/edit`}
          className='btn btn-sm btn-primary'
        >
          Edit
        </Link>
        <button
          type='button'
          onClick={handleDelete(_id, name)}
          className='btn btn-sm btn-danger'
        >
          Delete
        </button>
        <h2>{name}</h2>
        {/* <p>lat: {lat}</p>
        <p>lng: {lng}</p> */}
      </div>
    </div>
  )
}

class ListVenues extends Component {
  constructor (props) {
    super(props)
    this.state = {
      region: ''
    }
  }
  componentDidMount () {
    // we came here from another page but we still have minimal fetched:
    if (!_.isEmpty(this.props.venues)) { 
      _.map(this.props.venues, venue => {
        if (venue.fetchedLevel === 'minimal') {
          this.props.fetchVenueDetail(venue._id, 'full')
        }
      })
    }
  }
  
  componentWillReceiveProps (nextProps) {
    // once the venues are loaded in, we update them to full:
    if (_.isEmpty(this.props.venues) && !_.isEmpty(nextProps.venues)) {
      _.map(nextProps.venues, venue => {
        if (venue.fetchedLevel === 'minimal') {
          this.props.fetchVenueDetail(venue._id, 'full')
        }
      })
    }
  }
  handleDelete = (_id, name) => event => {
    if (window.confirm(`Are you sure you want to delete "${name}"`)) {
      this.props.deleteVenue(_id, this.props.history)
    }
  }
  handleSelectChange = selected => {
    this.setState({region: selected.value})
  }
  render () {
    const regionSelectOptions = _.map(this.props.regions, region => ({
      value: region._id,
      label: region.name
    }))
    regionSelectOptions.unshift({value: '', label: 'All Regions'})
    return (
      <div className='AdminVenues site-container'>
        <Link to='/admin/venues/add' className='btn btn-sm btn-success'>
          Add Venue
        </Link>
          {/* region={this.props.ui.activeRegion._id} */}
        <RegionSelect
          history={this.props.history}
          handleChange={this.handleSelectChange}
          options={regionSelectOptions}
          className='Admin__RegionSelect'
        />
        {this.state.region &&
          <h1>{this.props.regions[this.state.region].name}</h1>
        }
        {_.map(this.props.venues, venue => {
          if (!this.state.region || this.state.region === venue.regionId) {
            return (
              <AdminVenueTeaser
                key={venue._id}
                {...venue}
                handleDelete={this.handleDelete}
              />
            )
          }
        })}
      </div>
    )
  }
}

function mapStateToProps ({ venues, regions }) {
  return { venues, regions }
}

export default connect(mapStateToProps, actions)(ListVenues)
