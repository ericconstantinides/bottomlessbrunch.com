import React from 'react'
import Helmet from 'react-helmet'

import { SITE_NAME, SITE_SLOGAN, SITE_DOMAIN, SITE_IMAGE } from '../../config'

const MetaData = ({ region, regionName, venueOpenId, venueName, path }) => {
  const pageTitle = region && venueOpenId
    ? `${venueName} in ${regionName} for Bottomless Brunch` // venue
    : region
        ? `${regionName} Bottomless Brunch & Mimosas Locations` // region
        : `${SITE_NAME}: ${SITE_SLOGAN}` // homepage
  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name='description' content='Your description' />
      <meta property='og:site_name' content={SITE_NAME} />
      {/* down to here works... the rest tho... */}
      <meta property='og:url' content={`${SITE_DOMAIN}${path}`} />
      <meta property='og:image' content={`${SITE_DOMAIN}${SITE_IMAGE}`} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={pageTitle} />
      <meta property='og:description' content='Your description' />

    </Helmet>
  )
}

export default MetaData
