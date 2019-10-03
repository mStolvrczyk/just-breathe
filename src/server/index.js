const express = require('express')
const path = require('path')
const app = require('./app')

app.use(express.static(path.resolve(__dirname, '../client')))
app.listen(8000)
