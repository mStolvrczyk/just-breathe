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
  const stationSensorsData = await stationsService.getStation(request.params.station)
  response.json(stationSensorsData)
})

module.exports = router
