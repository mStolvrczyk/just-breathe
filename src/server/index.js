const express = require('express')
const path = require('path')
const app = require('./app')
const PORT = process.env.PORT || 8000

// eslint-disable-next-line camelcase
const https_redirect = function (req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url)
    } else {
      return next()
    }
  } else {
    return next()
  }
}
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist/client'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'client', 'index.html'))
  })
}
app.use(https_redirect)
app.use(express.static(path.resolve(__dirname, '../client')))
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
