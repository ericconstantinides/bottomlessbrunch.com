import React from 'react'
import Helmet from 'react-helmet'
// import _ from 'lodash'

import { parsePath } from '../../lib/myHelpers'

import { SITE_NAME, SITE_SLOGAN, SITE_DOMAIN, SITE_IMAGE } from '../../config'

const MetaData = ({
  activeRegion,
  activeVenue,
  venues,
  regions,
  path
}) => {
  let pageTitle
  const parsedHistory = parsePath(path)
  if (parsedHistory[0] === 'admin') {
    pageTitle = `${parsedHistory.join(' | ').toUpperCase()} | Bottomless Brunch`
  } else {
    const venueName = activeVenue && venues ? venues[activeVenue].name : ''
    pageTitle = activeRegion && activeVenue
      ? `${venueName} in ${regions[activeRegion].name}, ${regions[activeRegion].state} for Bottomless Brunch & Mimosas` // venue
      : activeRegion
          ? `The ${regions[activeRegion].venuesAvailable} best places in ${regions[activeRegion].name}, ${regions[activeRegion].state} for Bottomless Brunch & Mimosas` // region
          : `${SITE_NAME}: ${SITE_SLOGAN}` // homepage
  }
  let description
  if (activeRegion && activeVenue) {
    description = `Check out {$activeVenue} in ${regions[activeRegion].name}, ${regions[activeRegion].state} for Bottomless Brunch & Mimosas`
  } else if (activeRegion) {
    description = `Check out these ${regions[activeRegion].venuesAvailable} restaurants and bars in ${regions[activeRegion].name}, ${regions[activeRegion].state} for Bottomless Brunch & Mimosas`
  } else {
    description =
      'Check out Bottomless Brunch. Your guide to all the best Bottomless Mimosas and everything in between'
  }
  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name='description' content={description} />
      <meta property='og:site_name' content={SITE_NAME} />
      {/* down to here works... the rest tho... */}
      <meta property='og:url' content={`${SITE_DOMAIN}${path}`} />
      <meta property='og:image' content={`${SITE_DOMAIN}${SITE_IMAGE}`} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={pageTitle} />
      <meta property='og:description' content={description} />

    </Helmet>
  )
}

export default MetaData
