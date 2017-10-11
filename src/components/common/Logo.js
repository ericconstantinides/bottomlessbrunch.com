import React from 'react'
import RegionSelect from './RegionSelect'

const Logo = props => {
  return (
    <div className='Logo__outer-container'>
      <div className='Logo__container'>
        <div className='Logo' onClick={props.handleLogoClick}>
          Bottomless Brunch
        </div>
        <RegionSelect
          region={props.region}
          history={props.history}
          handleChange={props.handleChange}
          options={props.options}
          className='Logo__sub-title'
        />
      </div>
    </div>
  )
}

export default Logo
