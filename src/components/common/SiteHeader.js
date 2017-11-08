import React from 'react'
import { SITE_NAME, SITE_SLOGAN } from '../../config'

const SiteHeader = props => {
  return (
    <div className='SiteHeader'>
      <div className='SiteHeader__inner'>
        <div className='Logo'>
          <h1
            className='Logo__title'
            title={SITE_SLOGAN}
            onClick={props.handleLogoClick}
          >
            {SITE_NAME}
            <span className='Logo__beta-title'>beta</span>
          </h1>
          <img
            className='Logo__orange'
            src='/images/icon__split-orange--cond.png'
            alt='Bottomless Brunch'
          />
        </div>
        {props.region &&
          <div className='Logo__region'>
            <h2
              className='Logo__region-title'
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
