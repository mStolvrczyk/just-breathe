const express = require('express')
const app = express()
const userController = require('./controllers/userController.js')
const sslRedirect = require('heroku-ssl-redirect')

app.use(sslRedirect())

app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  next()
})

app.use('/api', userController)

module.exports = app
