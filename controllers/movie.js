const fs        = require('fs');
const path      = require('path');
const Movie     = require('../models/movie');

exports.getMovies = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 5;
  let totalItems;

  Movie.find()
    .countDocuments()
    .then( count => {
      totalItems = count;
      return Movie.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(movies => {
      res
        .status(200)
        .json({
          movies: movies,
          totalItems: totalItems
        })
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.getMovie = (req, res, next) => {
  const movieId = req.params.id;
  Movie.findById(movieId)
    .then( movie => {
      if(!movie) {
        const error = new Error('Could not find movie with ID ' + movieId);
        error.statusCode = 404;
        throw error;
      }
      res.status(200)
          .json({ 
            message: 'Received movie',
            movie: movie
          });
    })
    .catch (err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.addMovie = (req, res, next) => {
  let images = req.body.images;
  if(req.file) {
    images = req.file.path;
  }

  const title = req.body.title;
  const description  = req.body.description;
  const shortDescription = req.body.shortDescription;
  const duration = req.body.duration;
  const releaseDate = req.body.releaseDate;
  const genres = req.body.genres;

  const movie = new Movie({
    title: title,
    description: description,
    shortDescription: shortDescription,
    duration: duration,
    releaseDate: releaseDate,
    genres: genres,
    images: images
  });

  movie
    .save()
    .then( result => {
      res.status(201)
        .json({
          message: 'Movie is successfully created',
          movie: result
        });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.updateMovie = (req, res, next) => {
  const movieId = req.params.id;
  let images = req.body.images;
  if(req.file) {
    images = req.file.path;
  }

  const title = req.body.title;
  const description  = req.body.description;
  const shortDescription = req.body.shortDescription;
  const duration = req.body.duration;
  const releaseDate = req.body.releaseDate;
  const genres = req.body.genres;


  Movie.findById(movieId)
    .then( movie => {
      if(!movie){
        const error = new Error('Cound not find movie.');
        error.statusCode = 404;
        throw error;
      }
      if (movie.images && (images !== movie.images)) {
        removeImage(movie.images);
      }
      movie.title = title,
      movie.description = description;
      movie.shortDescription = shortDescription;
      movie.duration = duration;
      movie.releaseDate = releaseDate;
      movie.genres = genres;

      return movie.save();
    })
    .then (result => {
      res.status(200)
        .json({
          message: 'Successfully updated',
          movie: result
        })
    })
    .catch (err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.deleteMovie = (req, res, next) => {
  const movieId = req.params.id;
  Movie.findById(movieId)
    .then( movie => {
      if(!movie) {
        const error = new Error('Could not find movie with ID ' + movieId);
        error.statusCode = 404;
        throw error;
      }
      if(movie.images){
        removeImage(movie.images);
      }
      return Movie.findByIdAndRemove(movieId);
    })
    .then( result => {
      res.status(200)
        .json({
          message: 'Movie is successfully deleted'
        });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


const removeImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
