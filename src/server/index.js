const express = require('express')
const path = require('path')
const app = require('./app')
const PORT = process.env.PORT || 8000

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist/client'))
  app.get('*', (req, res) => {
    if (!req.secure) {
      res.redirect('https://' + req.headers.host + req.url)
      res.sendFile(path.resolve(__dirname, 'dist', 'client', 'index.html'))
    } else {
      res.sendFile(path.resolve(__dirname, 'dist', 'client', 'index.html'))
    }
  })
}
app.use(express.static(path.resolve(__dirname, '../client')))
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
