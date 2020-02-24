// const express = require('express')
// const router = express.Router()
// const stationsService = require('../services/stationsService')
// /**
//  * Pobieranie wszystkich stacji
//  */
// router.get('/stations', async (request, response) => {
//   const stations = await stationsService.getAllStations()
//   response.json(stations)
// })
//
// /**
//  * Pobieranie danych dla konkretnej stacji
//  */
// router.get('/stations/:station', async (request, response) => {
//   const station = await stationsService.getStation(request.params.station)
//   response.json(station)
// })
//
// router.get('/sensors/:sensor', async (request, response) => {
//   const sensor = await stationsService.getSensor(request.params.sensor)
//   response.json(sensor)
// })
//
// module.exports = router

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

/**
 * Pobieranie danych dla konkretnej stacji
 */
router.get('/toto', async (request, response) => {
  const totoData = await stationsService.getTotoData()
  response.json(totoData)
})

module.exports = router
