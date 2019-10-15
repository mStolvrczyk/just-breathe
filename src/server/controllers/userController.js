const express = require('express')
const router = express.Router()
const stationsService = require('../services/stationsService')
/**
 * Pobieranie wszystkich stacji
 */
router.get('/stations', async (request, response) => {
  const stations = await stationsService.getAllStations()
  response.json(stations)
})

/**
 * Pobieranie danych dla konkretnej stacji
 */
router.get('/stations/:station', async (request, response) => {
  const station = await stationsService.getStation(request.params.station)
  response.json(station)
})

router.get('/sensors/:sensor', async (request, response) => {
  const sensor = await stationsService.getSensor(request.params.sensor)
  response.json(sensor)
})

module.exports = router
