import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Home from './Home'
import './VenuePage.css'

class VenuePage extends Component {
  render () {
    return (
      <div className='VenuePage'>
        <div className='VenuePage__inner'>
          <Link to='/'
            className='VenuePage__close'
          />
          <h1>
            {this.props.venue.name}
          </h1>
        </div>
        <Home />
      </div>
    )
  }
}
// ownProps are the props that are "going to" PostShow during the connect
// function mapStateToProps ({ venues }, ownProps) {
//   const venue = venues.filter(
//     venue => {
//       return `/${venue.slug}` === ownProps.match.path
//     }
//   )[0]
//   return { venue }
// }

export default connect(null, actions)(VenuePage)
