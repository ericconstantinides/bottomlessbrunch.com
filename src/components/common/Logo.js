import React from 'react'
import RegionSelect from './RegionSelect'
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
            >
              {props.region.name}
            </h2>
            {/* <RegionSelect
              region={props.region._id}
              history={props.history}
              handleChange={props.handleChange}
              options={props.options}
              className='Logo__sub-title'
            /> */}
          </div>}
      </div>
    </div>
  )
}

export default Logo
