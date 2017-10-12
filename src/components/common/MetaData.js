import React from 'react'
import Helmet from 'react-helmet'

import { SITE_NAME, SITE_SLOGAN, SITE_DOMAIN, SITE_IMAGE } from '../../config'

const MetaData = ({ region, regionName, regionState, venueOpenId, venueName, path, numOfVenues }) => {
  const pageTitle = region && venueOpenId
    ? `${venueName} in ${regionName} for Bottomless Brunch` // venue
    : region
        ? `${regionName} Bottomless Brunch & Mimosas Locations` // region
        : `${SITE_NAME}: ${SITE_SLOGAN}` // homepage
  let description
  if (region && venueOpenId) {
    description = `Check out {$venueName} in ${regionName}`
  } else if (region) {
    description = `Check out these ${numOfVenues} places for Bottomless Brunch and Mimosas in ${regionName}, ${regionState}`
  } else {
    description = 'Check out Bottomless Brunch. Your guide to all the best Bottomless Mimosas and everything in between'
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
