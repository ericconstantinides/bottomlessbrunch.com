import React from 'react'
import { SITE_NAME, SITE_SLOGAN } from '../../config'

const Logo = props => {
  return (
    <div className='Logo__container'>
      <div className='Logo'>
        <h1
          className='Logo__title'
          title={SITE_SLOGAN}
          onClick={props.handleLogoClick}
        >
          {SITE_NAME}
        </h1>
        <div
          onClick={props.handleLogoClick}
          title={SITE_SLOGAN}
          className='Logo__image Logo__beta-container'
        >
          <img src='/images/text__beta.png' className='Logo__beta-title' alt='Bottomless Brunch' />
        </div>
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
        </div>}
    </div>
  )
}

export default Logo
