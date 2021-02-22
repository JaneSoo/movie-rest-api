const chai      = require('chai');
const chaiHttp  = require('chai-http');
const app       = require('../app');

chai.should();
chai.use(chaiHttp);

/**
 * Test the GET route
 */
describe('/GET movie', () => {
  it('it shoud GET all the movies', (done) => {
    chai.request(app)
    .get('/api/v1/movies')
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
    done();
    });
  });

  it('it should NOT GET all the movies', (done) => {
    chai.request(app)
      .get('/api/v1/movie')
      .end((err, res) => {
        res.should.have.status(404);
      done();
      });
  });
});

/**
 * Test the GET (by id) route
 */
describe('GET /api/v1/movies/{id}', () => {
  it('it should GET a movie by ID', (done) => {
    const movieId = '6033817b2cd4298f84556b21';
    chai.request(app)
      .get('/api/v1/movies/' + movieId)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('movie');
        res.body.should.have.property('movie').property('_id').eq('6033817b2cd4298f84556b21');
      done();
      });
  });
  it('it should NOT GET a movie by ID', (done) => {
    const movieId = '60337e302cd4298f84556b22';
    chai.request(app)
      .get('/api/v1/movies/' + movieId)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('message').eq('Could not find movie with ID 60337e302cd4298f84556b22')
      done();
      });
  });
});


/**
 * Test the POST route
 */
describe('POST /api/v1/movies', () => {
  it('it should POST a new movie', (done) => {
    const movie = {
      title: "Train to Busan",
      description: "Description of the movie"
    };
    chai.request(app)
      .post('/api/v1/movies')
      .send(movie)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eq('Movie is successfully created');
        res.body.should.have.property('movie').property('title').eq('Train to Busan');
      done();
      });
  });
  
  it('it should NOT POST a new movie without title property', (done) => {
    const movie = {
      description: "Description of the movie"
    };
    chai.request(app)
      .post('/api/v1/movies')
      .send(movie)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.have.property('message').eq('Validation failed');
      done();
      });
  });
});

/**
 * Test PUT route
 */
describe('PUT /api/v1/movies/{id}', () => {
  it('it should PUT an existing movie', (done) => {
    const movieId = '603381882cd4298f84556b23';
    const movie = {
      title: 'Edited title'
    };
    chai.request(app)
      .put('/api/v1/movies/' + movieId)
      .send(movie)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eq('Successfully updated');
        res.body.should.have.property('movie').property('title').eq('Edited title');
      done();
      });
  });

  it("It should NOT PUT an existing movie with a title with less than 5 characters", (done) => {
    const movieId = '60337e302cd4298f84556b20';
    const movie = {
        name: "titl",
    };
    chai.request(app)                
        .put("/api/v1/movies/" + movieId)
        .send(movie)
        .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('message').eq('Validation failed');
        done();
        });
    });        
});
