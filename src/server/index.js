const express = require('express')
const path = require('path')
const app = require('./app')
const enforce = require('express-sslify')
const PORT = process.env.PORT || 8000

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist/client'))
  app.use(enforce.https({ trustProtoHeader: true }))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'client', 'index.html'))
  })
}
app.use(express.static(path.resolve(__dirname, '../client')))
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
