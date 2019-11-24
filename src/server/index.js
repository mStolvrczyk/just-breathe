const express = require('express')
const path = require('path')
const app = require('./app')
const PORT = process.env.PORT || 8000

/* Redirect http to https */
app.get('*', function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect('https://' + req.hostname + req.url)
    next() /* Continue to other routes if we're not redirecting */
    app.use(express.static('dist/client'))
    res.sendFile(path.resolve(__dirname, 'dist', 'client', 'index.html'))
  } else if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist/client'))
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'client', 'index.html'))
    })
  }
})

app.use(express.static(path.resolve(__dirname, '../client')))
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
