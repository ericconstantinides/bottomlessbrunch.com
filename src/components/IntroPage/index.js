import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import RegionSelect from '../MapPage/RegionSelect'

import * as actions from '../../actions'

class IntroPage extends Component {
  handleSelectChange = selected => {
    this.props.setUiRegion(
      selected.value
    )
     this.props.history.replace(this.props.regions[selected.value].slug)
  }
  render () {
    const regionSelectOptions = _.map(this.props.regions, region => ({
      value: region._id,
      label: region.name
    }))
    return (
      <div>
        <RegionSelect
          region={this.props.ui.region}
          history={this.props.history}
          handleChange={this.handleSelectChange}
          options={regionSelectOptions}
        />
      </div>
    )
  }
}

function mapStateToProps ({ regions, ui }) {
  return { regions, ui }
}

export default connect(mapStateToProps, actions)(IntroPage)
