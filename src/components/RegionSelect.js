import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'

class RegionSelect extends Component {
  constructor (props) {
    super(props)
    this.state = { value: this.props.ui.region }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = event => {
    this.setState({ value: event.target.value })
    this.props.setRegionUi(event.target.value)
  }

  render () {
    return (
      <div className='RegionSelect'>
        <select value={this.state.value} onChange={this.handleChange}>
          {this.props.regions.map((region, i) => (
            <option key={i} value={region.slug}>{region.name}</option>
          ))}
        </select>
      </div>
    )
  }
}

function mapStateToProps ({ regions, ui }) {
  return { regions, ui }
}

export default connect(mapStateToProps, actions)(RegionSelect)
