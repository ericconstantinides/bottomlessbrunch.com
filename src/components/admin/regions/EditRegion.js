import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

class EditRegion extends Component {
  render () {
    return (
      <div className='container'>
        <h1>Edit Region {this.props.region.name}</h1>
      </div>
    )
  }
}

function mapStateToProps ({ regions }, ownProps) {
  return { region: regions[ownProps.match.params.id] }
}

export default connect(mapStateToProps)(EditRegion)
