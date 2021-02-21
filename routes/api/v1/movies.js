const express           = require('express');
const movieController   = require('../../../controllers/movie');

const router = express.Router();

/**
 * @swagger
 * /movies:
 *  get:
 *    summary: Retrieve a list of movies
 *    description: Retrieve a list of movies, can supply `page=...` to specify desired page
 *    responses:
 *      200:
 *        description: A list of movies
 *        content:
 *          application/json
 */
router.get('/', movieController.getMovies);

/**
 * @swagger
 * /movies/{id}:
 *  get:
 *    summary: Retrieve a single movie
 *    description: Retrieve a singlie movie through provided id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the movie to retrieve
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A single movie
 *        content:
 *          application/json
 */
router.get('/:id', movieController.getMovie);

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a movie
 *     requestBody:
 *       required: true
 *       content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                description:
 *                  type: string
 *                shortDescription:
 *                  type: string
 *                duration:
 *                  type: integer
 *                releaseDate:
 *                  type: date
 *                images:
 *                  type: string
 *                  format: binary
 *                genres:
 *                  type: array
 *     responses:
 *       201:
 *         description: Successfully created
 *         content:
 *           application/json      
 */
router.post('/', movieController.addMovie);

/**
 * @swagger
 * /movies/{id}:
 *    put:
 *      summary: Update movie's attributes
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the movie to update
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      responses:
 *        201:
 *          description: Successfully updated
 *          content:
 *            application/json
 */
router.put('/:id', movieController.updateMovie);

/**
 * @swagger
 * /movies/{id}:
 *    delete:
 *      summary: Delete a single movie
 *      description: Delete a singlie movie through provided id
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the movie to delete
 *          schema:
 *            type: string
 *      responses:
 *        200:
 */
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
