const generateJsonSitemap = require('../lib/myHelpers.js').generateJsonSitemap
const Region = require('../models/Region')
const Venue = require('../models/Venue')

exports.sitemap = function (req, res) {
  Region.find({}, function (err, regions) {
    if (err) res.send(err)
    Venue.find({}, function (err, venues) {
      if (err) res.send(err)
      const jsonSitemap = generateJsonSitemap(regions, venues)
      jsonSitemap.toXML(function (err, xml) {
        if (err) return res.status(500).end()
        res.header('Content-Type', 'application/xml')
        res.send(xml)
      })
    })
  })
}
