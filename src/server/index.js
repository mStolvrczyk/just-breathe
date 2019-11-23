const express = require('express')
const path = require('path')
const sslRedirect = require('heroku-ssl-redirect')
const app = require('./app')
app.use(sslRedirect())
const PORT = process.env.PORT || 8000

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist/client'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'client', 'index.html'))
  })
}
app.use(express.static(path.resolve(__dirname, '../client')))
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
