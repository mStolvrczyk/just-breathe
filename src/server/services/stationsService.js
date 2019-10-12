const axios = require('axios')
const functions = require('../libs/helperFunctions')
const apiGiosBaseUrl = require('../libs/apiGiosBaseUrl.js')
let station = []
module.exports = {
  getAllStations: async () => {
    return axios.get(`${apiGiosBaseUrl}/station/findAll`)
      .then(functions.getData)
      .then((data) => {
        return data.map(functions.stationsFilter)
      })
  },
  getStation: async (stationID) => {
    return station =  await axios.get(`${apiGiosBaseUrl}/station/sensors/${stationID}`)
      .then(functions.getData)
      .then((data) => data.map(functions.sensorsFilter))
  },
  getSensor: async (sensorID) => {
    const sensorsData = axios.get(`${apiGiosBaseUrl}/data/getData/${sensorID}`)
      .then(functions.getData)

    return sensorsData.map(({ key, values }) => ({
      details: station.find(({ paramTwo }) => paramTwo === key),
      measurement: values.filter(({ value }) => value !== null),
    }))
  }
}
