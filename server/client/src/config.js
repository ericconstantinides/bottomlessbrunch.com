import React from 'react'

export const GOOGLE_GA = 'UA-21524856-1'
// export const GOOGLE_API_KEY = 'AIzaSyDsJWQDeqiFe-Chw1tBWfitg_7rGSWmHTU'
export const GOOGLE_API_KEY = 'AIzaSyAlJ2-D1vw4PxFuTX5BhGEz1v8TReprq3A'
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

export const USA_MAP_COORDS = {
  bounds: {
    nw: { lat: 49.5335125, lng: -126.1250427 },
    ne: { lat: 49.5335125, lng: -64.468826475 },
    se: { lat: 22.410132469242768, lng: -64.468826475 },
    sw: { lat: 22.410132469242768, lng: -126.1250427 }
  },
  center: {
    lat: 38.1510752,
    lng: -95.8457796
  },
  marginBounds: {
    nw: { lat: 49.5335125, lng: -126.1250427 },
    ne: { lat: 49.5335125, lng: -64.468826475 },
    se: { lat: 22.410132469242768, lng: -64.468826475 },
    sw: { lat: 22.410132469242768, lng: -126.1250427 }
  },
  marginCenter: {
    lat: 38.1510752,
    lng: -95.8457796
  },
  size: {
    height: 0,
    width: 0
  },
  zoom: 4
}

// this should ideally be done in the region:
export const BRUNCH_TIMES = {
  START: '10:00AM',
  END: '3:00PM',
  DAYS: ['Saturday', 'Sunday']
}

export const DRAWER = {
  sm: {
    name: 'sm',
    bp_starts: 0,
    bp_ends: 767,
    offset_top: 56,
    offset_bottom: 200,
    offset_left: 0,
    offset_right: 0,
    fudge_lat_at_zoom_ten: 0.078,
    fudge_lng_at_zoom_ten: 0,
    fudge_lat_at_zoom_twenty: 0.000076171875,
    fudge_lng_at_zoom_twenty: 0,
    show_venues_zoom_level: 9
  },
  md: {
    name: 'md',
    bp_starts: 768,
    bp_ends: 900,
    offset_top: 0,
    offset_bottom: 0,
    offset_left: 320,
    offset_right: 0,
    fudge_lat_at_zoom_ten: 0,
    fudge_lng_at_zoom_ten: 0.22,
    fudge_lat_at_zoom_twenty: 0,
    fudge_lng_at_zoom_twenty: 0.00021484375,
    show_venues_zoom_level: 10
  },
  lg: {
    name: 'lg',
    bp_starts: 901,
    bp_ends: 99999,
    offset_top: 0,
    offset_bottom: 0,
    offset_left: 390,
    offset_right: 0,
    fudge_lat_at_zoom_ten: 0,
    fudge_lng_at_zoom_ten: 0.268,
    fudge_lat_at_zoom_twenty: 0,
    fudge_lng_at_zoom_twenty: 0.00026171875,
    show_venues_zoom_level: 10
  }
}

// export const PAD_DEGREES = 0.0125
export const PAD_DEGREES = 0

export const SLIDER_SETTINGS = {
  arrows: true,
  infinite: true,
  centerMode: true,
  slidesToShow: 1,
  adaptiveHeight: false,
  speed: 300,
  // initialSlide: 0,
  accessibility: true,
  // dots: true,
  touchThreshold: 17,
  centerPadding: '32px',
  prevArrow: (
    <div>
      <div className='VenueSlider__arrow VenueSlider__arrow--prev'>
        <div className='VenueSlider__inner-arrow VenueSlider__inner-arrow--prev' />
      </div>
    </div>
  ),
  nextArrow: (
    <div>
      <div className='VenueSlider__arrow VenueSlider__arrow--next'>
        <div className='VenueSlider__inner-arrow VenueSlider__inner-arrow--next' />
      </div>
    </div>
  ),
  responsive: [
    {
      breakpoint: 620,
      settings: {
        centerPadding: '10px'
      }
    }
  ]
}
