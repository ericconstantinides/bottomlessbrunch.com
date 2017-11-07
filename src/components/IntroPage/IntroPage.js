import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as viewportUnitsBuggyfill from 'viewport-units-buggyfill'

import * as actions from '../../actions'

import Logo from '../common/Logo'

class IntroPage extends Component {
  handleRegionsModalClick = () => {
    this.props.showUiRegionsModal()
  }
  // handleSelectChange = selected => {
  //   this.props.setUiRegion(this.props.regions[selected.value])
  //   this.props.history.replace(this.props.regions[selected.value].slug)
  // }
  componentDidMount () {
    this.props.addUiAppClass(['App--IntroPage'])
    viewportUnitsBuggyfill.init()
  }
  componentWillUnmount () {
    this.props.removeUiAppClass(['App--IntroPage'])
  }
  render () {
    return (
      <div className='IntroPage'>
        <Logo
          handleRegionsModalClick={this.handleRegionsModalClick}
        />
        <div className='Splash'>
          <video
            className='Splash__video'
            autoPlay
            loop
            id='video-background'
            muted
            playsInline
          >
            <source
              src='/images/bg__bartender-making-cocktails.mp4'
              type='video/mp4'
            />
          </video>
          <div className='Splash__inner'>
            <h1 className='Splash__title'>I'm thirsty for brunch in...</h1>
            <div
              className='Splash__RegionSelect'
              onClick={this.handleRegionsModalClick}
            >
              Choose Region...
            </div>
          </div>
          <div className='Splash__footer'>
            <span className='Splash__footer-link'>About</span>
          </div>
        </div>
        <div className='IntroPage__about'>
          <img
            className='IntroPage__orange'
            src='/images/bottomless-brunch-orange.png'
            alt='Bottomless Brunch Orange'
          />
          <div className='playout has-image-right has-image-width-60p has-body-width-60p'>
            <div className='playout__image-container'>
              <img
                src='/images/photo__tray-of-mimosas.jpg'
                alt='Tray Of Bottomless Mimosas'
              />
            </div>
            <div className='playout__body'>
              <h2 className='IntroPage__title playout__title u-mb-0'>
                What's Bottomless Brunch?
              </h2>
              <div className='u-mt-1 u-kill-last-margin'>
                <p>
                  Bottomless Brunch, as you've probably guessed, is your guide to bottomless drinking. Becky and I have scoured the country looking for the all the spots for unlimited drinks and bottomless refreshment. Whether you're looking for a Sunday Funday or want a Boozy Brunch, Bottomless Brunch is your go-to guide for all things brunch.
                </p>
              </div>
            </div>
          </div>
          <div className='playout has-image-left has-image-width-75p has-body-width-40p'>
            <div className='playout__image-container'>
              <img
                src='/images/photo__Eric-and-Becky-Looking-At-Each-Other.jpg'
                alt='Cheers With Bottomless Mimosas'
              />
            </div>
            <div className='playout__body'>
              <h2 className='IntroPage__title playout__title u-mb-0'>
                Who's Bottomless Brunch?
              </h2>
              <div className='u-mt-1 u-kill-last-margin'>
                <p>
                  Bottomless Brunch is the brainchild of Eric and Becky. It started as a small list of places that we wanted to go to and it blossomed from there.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ regions, ui }) {
  return { regions, ui }
}

export default connect(mapStateToProps, actions)(IntroPage)
