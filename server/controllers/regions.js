const Region = require('../models/Region')
const slugify = require('../lib/myHelpers').slugify

exports.region_list = function (req, res) {
  Region.find({}, function (err, regions) {
    if (err) res.send(err)
    const regionsWithSlug = regions.map(region => {
      region.slug = slugify(region.name)
      return region
    })
    res.json(regionsWithSlug)
  })
}

exports.region_create = function (req, res) {
  const newRegion = new Region(req.body)
  newRegion.save(function (err, region) {
    if (err) res.send(err)
    res.json(region)
  })
}

exports.region_detail = function (req, res) {
  Region.findById(req.params.regionId, function (err, region) {
    if (err) res.send(err)
    res.json(region)
  })
}

exports.region_update = function (req, res) {
  Region.findOneAndUpdate(
    { _id: req.params.regionId },
    req.body,
    { new: true },
    function (err, region) {
      if (err) res.send(err)
      res.json(region)
    }
  )
}

exports.region_delete = function (req, res) {
  Region.remove(
    { _id: req.params.regionId },
    function (err, region) {
      if (err) res.send(err)
      res.json({ message: 'Task successfully deleted' })
    }
  )
}
