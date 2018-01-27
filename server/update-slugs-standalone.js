const express = require('express')
const app = express()
const mongoose = require('mongoose')

const Venue = require('./models/Venue')
const Region = require('./models/Region')

const path = require('path')

// allows starting the server from other directories:
require('dotenv').config({path: path.join(__dirname, '.env')})

const MONGODB_URI = process.env.ENVIRONMENT === 'prod'
  ? process.env.MONGODB_PROD_URI
  : process.env.ENVIRONMENT === 'dev'
    ? process.env.MONGODB_DEV_URI
    : ''

mongoose.connect(MONGODB_URI, {
  useMongoClient: true
})

Venue.find({}, (err, venues) => {
  if (err) console.log(err)
  Region.find({}, function (err, regions) {
    if (err) console.log(err)
    // get the slugs
    addVenueSlugs(venues)
    // get the minimal data needed:
    // const minimalVenues = venues.map(venue => {
    //   const { _id, lat, lng, regionId, slug } = venue
    //   return { _id, lat, lng, regionId, slug }
    // })
    // console.log(minimalVenues)
    // venuesWithSlugs.forEach(venue => {
      // console.log(venue)
      // venueUpdate(venue._id, venue)
    // })
  })
})

function venueUpdate (id, body) {
  Venue.findOneAndUpdate(
    { _id: id }, body,
    function (err, venue) {
      if (err) console.log(err)
      return venue
    }
  )
}

function addVenueSlugs (venues) {
  // get all the slugs for the venues
  let venuesWithSlugs = []
  venues.map((venue, i) => {
    // add the region to the active regions:
    Region.findOne(venue.regionId, (err, region) => {
      if (err) console.log(err)
      venue.slug = region.slug + '/' + venue.slug
      venueUpdate(venue._id, venue)
    })
    // console.log({i, 'venues.length': venues.length})
  })
  return venuesWithSlugs
}

function venueUpdate (id, body) {
  Venue.findOneAndUpdate(
    { _id: id }, body,
    function (err, venue) {
      if (err) console.log(err)
      return venue
    }
  )
}

