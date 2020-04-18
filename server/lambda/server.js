const express = require('express')
const cors = require('cors')
const path = require('path')
const serverless = require('serverless-http')
const app = express()
const bodyParser = require('body-parser')
const userController = require('../controllers/userController.js')
require('tls').DEFAULT_MIN_VERSION = 'TLSv1'
app.use(cors())
app.use(bodyParser.json())
app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  next()
})
app.use('/.netlify/functions/server', userController)
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../../public/index.html')))

module.exports = app
module.exports.handler = serverless(app)
