import React from 'react'
import { SITE_NAME, SITE_SLOGAN } from '../../config'

const SiteHeader = props => {
  let regionButton = ''
  if (props.regionReset && props.regionResetButton) {
    regionButton = (
      <div
        onClick={props.handleRegionSelect(props.regionReset)}
        className='button button--orange-black is-smaller'
      >
        Re-Center
      </div>
    )
  }
  return (
    <div className='SiteHeader layout__stacked-logo layout__sidebar-width layout__transparency-bg'>
      <div className='SiteHeader__inner'>
        <div className='logo'>
          <h1
            className='logo__title'
            title={SITE_SLOGAN}
            onClick={props.handleLogoClick}
          >
            {SITE_NAME}
            {/* <span className='logo__beta-title'>beta</span> */}
          </h1>
          <img
            className='logo__orange'
            src='/images/icon__split-orange--cond.png'
            alt='Bottomless Brunch'
          />
        </div>
        {props.handleRegionsModalClick &&
          <div className='SiteHeader__region layout__sidebar-width'>
            <h2
              className='SiteHeader__region-title'
              onClick={props.handleRegionsModalClick}
              title='Choose your Bottomless region...'
            >
              {props.regionTitle}
            </h2>
            {regionButton}
          </div>}
      </div>
    </div>
  )
}

export default SiteHeader
