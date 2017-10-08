import React from 'react'

const Logo = props => {
  return (
    <div className='Logo__outer-container'>
      <div className='Logo__container'>
        <div className='Logo'>
          Bottomless Brunch
        </div>
        {props.subTitle &&
          <div className='Logo__sub-title'>
            {props.subTitle}
          </div>
        }
      </div>
    </div>
  )
}

export default Logo
