const axios = require('axios')
const functions = require('../libs/helperFunctions')
const apiGiosBaseUrl = require('../libs/apiGiosBaseUrl.js')
module.exports = {
  getAllStations: async () => {
    return axios.get(`${apiGiosBaseUrl}/station/findAll`)
      .then(functions.getData)
      .then((data) => {
        return data.map(functions.stationsFilter)
      })
  },
  getStation: async (stationID) => {
    return  axios.get(`${apiGiosBaseUrl}/station/sensors/${stationID}`)
      .then(functions.getData)
      .then((data) => data.map(functions.stationFilter))
  },
  getSensor: async (sensorID) => {
    const sensorsData = await axios.get(`${apiGiosBaseUrl}/data/getData/${sensorID}`)
      .then(functions.getData)

    return {
      key: sensorsData.key,
      measurements: sensorsData.values.filter(({ value }) => value !== null)
    }
  }
}
