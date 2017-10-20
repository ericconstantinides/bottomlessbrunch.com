import React from 'react'
import { SITE_NAME, SITE_SLOGAN } from '../../config'

const Logo = props => {
  return (
    <div className='Logo__outer-container'>
      <div className='Logo__container'>
        <h1
          className='Logo'
          title={SITE_SLOGAN}
          onClick={props.handleLogoClick}
        >
          {SITE_NAME}
        </h1>
        {props.region &&
          <div>
            <h2
              className='Region__title'
              onClick={props.handleRegionsModalClick}
              title='Choose your Bottomless region...'
            >
              {props.region.name}
            </h2>
          </div>}
      </div>
    </div>
  )
}

export default Logo
