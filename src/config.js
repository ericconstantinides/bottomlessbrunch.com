import React from 'react'

export const googleGa = 'UA-21524856-1'
export const GOOGLE_API_KEY = 'AIzaSyDsJWQDeqiFe-Chw1tBWfitg_7rGSWmHTU'
export const SITE_NAME = 'Bottomless Brunch'
export const SITE_SLOGAN = 'The Bottomless Mimosas & Drinks Guide'
export const SITE_DOMAIN = 'https://www.bottomlessbrunch.com'
// export const SITE_DOMAIN = 'http://localhost:3000'
export const SITE_IMAGE = '/images/bottomless-brunch-orange.png'
// How often should I reFetch the Google API in minutes
export const fetchTimeout = 60
// removed this so that create-react-app proxy would work correctly:
// export const ROOT_URL = 'http://localhost:3090'
export const ROOT_URL = ''
export const DATE_LONG = { year: 'numeric', month: 'long', day: 'numeric' }

export const usaMap = {
  zoom: 4,
  lat: 38.1510752,
  lng: -95.8457796,
  bounds: {
    nw: { lat: 49.5335125, lng: -126.1250427 },
    ne: { lat: 49.5335125, lng: -64.468826475 },
    se: { lat: 22.410132469242768, lng: -64.468826475 },
    sw: { lat: 22.410132469242768, lng: -126.1250427 }
  }
}

export const BRUNCH_TIMES = {
  START: '10:00AM',
  END: '3:00PM',
  DAYS: ['Saturday', 'Sunday']
}

export const DRAWER = {
  sm: {
    starts: 0,
    ends: 767,
    width: 0,
    height: 300
  },
  md: {
    starts: 768,
    ends: 900,
    width: 320,
    height: 0
  },
  lg: {
    starts: 901,
    ends: 99999,
    width: 390,
    height: 0
  }
}

export const PAD_DEGREES = 0.0125

export const SLIDER_SETTINGS = {
  arrows: true,
  infinite: true,
  centerMode: true,
  slidesToShow: 1,
  initialSlide: 0,
  accessibility: true,
  // dots: true,
  touchThreshold: 17,
  centerPadding: '8vw',
  prevArrow: (
    <div className='team-slider__arrow team-slider__arrow--prev'>
      <div className='team-slider__inner-arrow team-slider__inner-arrow--prev' />
    </div>
  ),
  nextArrow: (
    <div className='team-slider__arrow team-slider__arrow--next'>
      <div className='team-slider__inner-arrow team-slider__inner-arrow--next' />
    </div>
  ),
  responsive: [
    {
      breakpoint: 620,
      settings: {
        centerPadding: '5vw'
      }
    }
  ]
}
