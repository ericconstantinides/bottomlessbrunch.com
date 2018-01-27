const mongoose = require('mongoose')
const Schema = mongoose.Schema
const enumerables = require('../lib/enumerables')

// Define our model
const RegionSchema = new Schema({
  name: { type: String, unique: true, required: true },
  gpId: { type: String, unique: true, required: true },
  state: { type: String, enum: enumerables.states },
  zoom: { type: Number, min: 0 },
  lat: Number,
  lng: Number,
  slug: String
})

module.exports = mongoose.model('Region', RegionSchema)
