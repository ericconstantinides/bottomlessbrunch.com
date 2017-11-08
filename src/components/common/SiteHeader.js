import React from 'react'
import { SITE_NAME, SITE_SLOGAN } from '../../config'

const SiteHeader = props => {
  return (
    <div className='SiteHeader'>
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
          <div className='logo__region layout__sidebar-width'>
            <h2
              className='logo__region-title'
              onClick={props.handleRegionsModalClick}
              title='Choose your Bottomless region...'
            >
              {props.region.name}
            </h2>
          </div>
        }
      </div>
    </div>
  )
}

export default SiteHeader
