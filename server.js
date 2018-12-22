/* ----------------------------------------------- *
 *                API Server                       *
 * ----------------------------------------------- */
// Importing the core modules ------------------- //
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// BASE CONFIGURATIONS -------------------------- //
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Import route initiator functions ----------- //
const initiateCacheRoutes = require('./app/routes/cache.route');

// ROUTES FOR API ------------------------------ //
const router = express.Router();

// HELPER FUNCTIONS ---------------------------- //
function loadRoutes() {
  // Test route to make sure everything is working
  router.get('/', (req, res) => {
    res.status(200).json({
      message: 'API server is up and running!',
    });
  });
  // Cache routes
  initiateCacheRoutes(router);

  // REGISTER OUR ROUTES ------------------------- //
  // base route is /api/version
  app.use('/api/v1', router);
}

function startServer() {
  loadRoutes();
  const port = process.env.PORT || 8001;
  app.listen(port, () => {
    console.info(`API Server up and running on port ${port} in ${process.env.STAGE} mode.`);
  });
}

// START THE SERVER ----------------------------- //
// 1. Try connecting to DB
const connectDB = require('./app/config/dbcon');

connectDB().then(() => {
  // 2. If successful, start server.
  console.info('DB connection successfull.');
  startServer();
}, (err) => {
  // Otherwise log and stop.
  console.error('Error connecting to DB.');
  console.error(err);
  process.exit(0);
});

module.exports = app;
