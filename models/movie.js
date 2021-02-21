const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String},
  shortDescription: {type: String},
  duration: {type: Number},
  releaseDate: {type: Date},
  images: {type: Object},
  genres: {type: Array},
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
