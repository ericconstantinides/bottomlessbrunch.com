const Venue = require('../models/Venue')

// query parameters:
// /venues[?showUnpublished]
exports.venue_list = function (req, res) {
  Venue.find({}, function (err, venues) {
    if (err) res.send(err)
    // get the minimal data needed:
    let minimalVenues = []
    venues.forEach(venue => {
      const { _id, gpId, lat, lng, regionId, slug, unpublish, funItems, funTimes } = venue
      if (
        (typeof req.query.showUnpublished !== 'undefined' &&
          req.query.showUnpublished !== 'false') ||
        !unpublish
      ) {
        minimalVenues.push({ _id, gpId, lat, lng, regionId, slug, funItems, funTimes })
      }
    })
    res.json(minimalVenues)
  })
  // const sf = venues.filter(venue => (
  //   venue.regionId.toString() === '59c4a61488348f8102580f25'
  // ))
}

exports.venue_create = function (req, res) {
  const newVenue = new Venue(req.body)
  newVenue.save(function (err, venue) {
    if (err) res.send(err)
    res.json(venue)
  })
}

// query parameters:
// /venues/{id}[?detailLevel=[teaser]]
exports.venue_detail = function (req, res) {
  Venue.findById(req.params.venueId, function (err, venue) {
    if (err) res.send(err)
    if (req.query.detailLevel && req.query.detailLevel === 'teaser') {
      const {
        _id,
        lat,
        lng,
        regionId,
        slug,
        name,
        gpId,
        funItems,
        funTimes,
        address,
        gData
      } = venue
      let thumbUrl
      if (
        gData &&
        gData.images &&
        gData.images.thumb &&
        gData.images.thumb[0].url
      ) {
        thumbUrl = gData.images.thumb[0].url
      }
      res.json({
        _id,
        lat,
        lng,
        regionId,
        slug,
        name,
        gpId,
        funItems,
        funTimes,
        address,
        thumbUrl
      })
    } else {
      let thumbUrl
      if (
        venue.gData &&
        venue.gData.images &&
        venue.gData.images.thumb &&
        venue.gData.images.thumb[0].url
      ) {
        thumbUrl = venue.gData.images.thumb[0].url
      }
      res.json(Object.assign({}, venue.toObject(), { thumbUrl }))
    }
  })
}

exports.venue_update = function (req, res) {
  Venue.findOneAndUpdate(
    { _id: req.params.venueId },
    req.body,
    { new: true },
    function (err, venue) {
      if (err) res.send(err)
      res.json(venue)
    }
  )
}

exports.venue_delete = function (req, res) {
  Venue.remove({ _id: req.params.venueId }, function (err, venue) {
    if (err) res.send(err)
    res.json({ message: 'Task successfully deleted' })
  })
}
