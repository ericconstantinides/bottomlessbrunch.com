import React from 'react'
import Helmet from 'react-helmet'
import _ from 'lodash'

import { SITE_NAME, SITE_SLOGAN, SITE_DOMAIN, SITE_IMAGE } from '../../config'

const MetaData = ({
  activeRegion,
  venueOpenId,
  venues,
  path,
  numOfVenues
}) => {
  const venueName = venueOpenId && venues ? venues[venueOpenId].name : ''
  const pageTitle = !_.isEmpty(activeRegion) && venueOpenId
    ? `${venueName} in ${activeRegion.name} has Bottomless Brunch` // venue
    : !_.isEmpty(activeRegion)
        ? `${activeRegion.name} Bottomless Brunch & Bottomless Mimosas` // region
        : `${SITE_NAME}: ${SITE_SLOGAN}` // homepage
  let description
  if (!_.isEmpty(activeRegion) && venueOpenId) {
    description = `Check out {$venueOpenId} in ${activeRegion.name}`
  } else if (!_.isEmpty(activeRegion)) {
    description = `Check out these ${numOfVenues} places for Bottomless Brunch and Mimosas in ${activeRegion.name}, ${activeRegion.state}`
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
