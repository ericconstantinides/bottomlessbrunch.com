import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import RegionSelect from '../common/RegionSelect'

import * as actions from '../../actions'

import Logo from '../common/Logo'

class IntroPage extends Component {
  handleSelectChange = selected => {
    this.props.setUiRegion(selected.value)
    this.props.history.replace(this.props.regions[selected.value].slug)
  }
  render () {
    const regionSelectOptions = _.map(this.props.regions, region => ({
      value: region._id,
      label: region.name
    }))
    return (
      <div className='IntroPage'>
        <Logo />
        <div className='Splash'>
          <video className='Splash__video' autoPlay loop id='video-background' muted playsInline>
            <source src='/images/bg__bartender-making-cocktails.mp4' type='video/mp4' />
          </video>
          <div className='Splash__inner'>
            <h1 className='Splash__title'>I'm thirsty for brunch in...</h1>
            <RegionSelect
              region={this.props.ui.region}
              history={this.props.history}
              handleChange={this.handleSelectChange}
              options={regionSelectOptions}
              className='Splash__RegionSelect'
            />
          </div>
          <div className='Splash__footer'>
            <span className='Splash__footer-link'>About</span>
          </div>
        </div>
        <div className='IntroPage__About'>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
          <p>Hello Moto</p>
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ regions, ui }) {
  return { regions, ui }
}

export default connect(mapStateToProps, actions)(IntroPage)
