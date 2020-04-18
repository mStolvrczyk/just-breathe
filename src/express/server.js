// 'use strict';
// const express = require('express');
// const path = require('path');
// const serverless = require('serverless-http');
// const app = express();
// const bodyParser = require('body-parser');
// const stationsService = require('./services/stationsService')
//
// const router = express.Router();
// router.get('/stations', async (request, response) => {
//   const stations = await stationsService.getAllStations();
//   response.json(stations);
// });
// router.get('/', (req, res) => {
//   res.send('pong')
//   // res.writeHead(200, { 'Content-Type': 'text/html' });
//   // res.write('<h1>Hello from Express.js!</h1>');
//   res.end();
// });
// router.get('/dupa', (req, res) => {
//   res.send('dupa')
//   // res.writeHead(200, { 'Content-Type': 'text/html' });
//   // res.write('<h1>Hello from Express.js!</h1>');
//   res.end();
// });
// router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
// router.post('/', (req, res) => res.json({ postBody: req.body }));
//
// app.use(bodyParser.json());
// app.use('/.netlify/functions/server', router);  // path must route to lambda
// app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
//
// module.exports = app;
// module.exports.handler = serverless(app);
const express = require('express')
const cors = require('cors')
const path = require('path')
const serverless = require('serverless-http')
const app = express()
const bodyParser = require('body-parser')
const userController = require('./controllers/userController.js')
require('tls').DEFAULT_MIN_VERSION = 'TLSv1'
app.use(cors())
app.use(bodyParser.json())
// app.all('/*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With')
//   next()
// })
app.use('/.netlify/functions/server', userController)
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../../public/index.html')))

module.exports = app
module.exports.handler = serverless(app)
