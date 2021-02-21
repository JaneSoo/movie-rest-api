const express       = require('express');
const mongoose      = require('mongoose');
const bodyParser    = require('body-parser');
const swaggerUi     = require('swagger-ui-express');
const swaggerJsdoc  = require('swagger-jsdoc');
const multer        = require('multer');

const params        = require('./config/database');

const app = express();

mongoose.connect(params.DATABASECONNECTION, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
        .then(() => console.log('connected'))
        .catch( err => console.log(err));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/png' ||
    file.mimetype == 'image/jpg' ||
    file.mimetype == 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Document for Movie',
    version: '1.0.0',
    description:
    'REST API for movie',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Movie REST API',
      url: '',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1/',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/api/v1/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter}).single('images')
);
app.use('/api/v1', require('./routes/api/v1'));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({message: message});
});

app.set("port", process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log('Server started on port ' + app.get('port'));
})

module.exports = app;
