import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Select from 'react-select'
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css'

class RegionSelect extends Component {
  handleChange = selected => {
    this.props.setRegionUi(selected.value)
  }

  render () {
    return (
      <div className='RegionSelect__container'>
        <Select
          className='RegionSelect'
          value={this.props.ui.region}
          searchable={false}
          clearable={false}
          onChange={this.handleChange}
          options={this.props.regions.map((region, i) => ({
            value: region.id,
            label: region.name
          }))}
        />
      </div>
    )
  }
}

function mapStateToProps ({ regions, ui }) {
  return { regions, ui }
}

export default connect(mapStateToProps, actions)(RegionSelect)
