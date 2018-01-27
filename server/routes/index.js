const express = require('express')
const router = express.Router()

const venues = require('../controllers/venues')
const regions = require('../controllers/regions')
const methods = require('../controllers/methods')

router.route('/regions').get(regions.region_list)
router.route('/regions/:regionId').get(regions.region_detail)
router.route('/venues').get(venues.venue_list)
router.route('/venues/:venueId').get(venues.venue_detail)

router.route('/methods/environment').get(methods.environment)

// admin routes:
if (process.env.ENVIRONMENT === 'dev') {
  router.route('/regions')
    .post(regions.region_create)
  router.route('/regions/:regionId')
    .put(regions.region_update)
    .delete(regions.region_delete)
  router.route('/venues')
    .post(venues.venue_create)
  router.route('/venues/:venueId')
    .put(venues.venue_update)
    .delete(venues.venue_delete)

  router.route('/methods/yelpPhoneSearch').get(methods.yelp_phone_search)
  router.route('/methods/yelpIdSearch').get(methods.yelp_id_search)
  router.route('/methods/yelpMetaSearch').get(methods.yelp_meta_search)
}

module.exports = router
