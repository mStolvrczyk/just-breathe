const express = require('express')
const path = require('path')
const app = require('./app')
const PORT = process.env.PORT || 8000

// if (process.env.NODE_ENV === 'production') {
//
//   app.get('*', (req, res) => {
//   })
// }

app.get('*', function (req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist/client'))
    res.sendFile(path.resolve(__dirname, 'dist', 'client', 'index.html'))
  }
})
app.use(express.static(path.resolve(__dirname, '../client')))
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
//   res.redirect('https://'+req.hostname+req.url)
// else
//   next() /* Continue to other routes if we're not redirecting */
