import _ from 'lodash'
import React from 'react'
import { SITE_NAME, SITE_SLOGAN } from '../../config'

const SiteHeader = props => {
  let returnButton = ''
  let regionName = 'Choose Region'
  if (!_.isEmpty(props.visibleRegions)) {
    console.log('props.visibleRegions:', props.visibleRegions)
    const keys = _.keysIn(props.visibleRegions)
    if (keys.length === 1) {
      if (
        props.visibleRegions[keys[0]].venuesVisible <
        props.visibleRegions[keys[0]].venuesAvailable
      ) {
        regionName = props.visibleRegions[keys[0]].name
        returnButton = (
          <div className='button button--orange-black is-smaller'>
            reset
          </div>
        )
      } else {
        regionName = props.visibleRegions[keys[0]].name
      }
    } else {
      regionName = 'Multiple Regions'
    }
  }
  return (
    <div className='SiteHeader layout__transparency-bg'>
      <div className='SiteHeader__inner'>
        <div className='logo'>
          <h1
            className='logo__title'
            title={SITE_SLOGAN}
            onClick={props.handleLogoClick}
          >
            {SITE_NAME}
            <span className='logo__beta-title'>beta</span>
          </h1>
          <img
            className='logo__orange'
            src='/images/icon__split-orange--cond.png'
            alt='Bottomless Brunch'
          />
        </div>
        {props.region &&
          <div className='SiteHeader__region layout__sidebar-width'>
            <h2
              className='SiteHeader__region-title'
              onClick={props.handleRegionsModalClick}
              title='Choose your Bottomless region...'
            >
              {regionName}
            </h2>
            {returnButton}
          </div>}
      </div>
    </div>
  )
}

export default SiteHeader
