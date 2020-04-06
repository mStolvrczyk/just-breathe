const history = require('connect-history-api-fallback')
const express = require('express')
const path = require('path')
const app = require('./app')
const PORT = process.env.PORT || 8000
require('tls').DEFAULT_MIN_VERSION = 'TLSv1'
app.use(history())
app.use('*', function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect('https://' + req.hostname + req.url)
  } else {
    next()
  }
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
  })
}
app.use(express.static(path.resolve(__dirname, '../src')))
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
