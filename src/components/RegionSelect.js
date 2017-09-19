import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as actions from '../actions'
import Select from 'react-select'
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css'

class RegionSelect extends Component {
  componentWillMount () {
    // update the location based on the current region
    this.props.history.replace(this.props.regions[this.props.ui.region].slug)
  }
  handleChange = selected => {
    this.props.setRegionUi(selected.value)
    this.props.history.push(this.props.regions[selected.value].slug)
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
          options={_.map(this.props.regions, region => ({
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
