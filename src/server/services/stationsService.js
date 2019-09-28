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
    const sensors = await axios.get(`${apiGiosBaseUrl}/station/sensors/${stationID}`)
      .then(functions.getData)
      .then((data) => data.map(functions.sensorsFilter))

    const qualityLevels = await axios.get(`${apiGiosBaseUrl}/aqindex/getIndex/${stationID}`)
      .then(functions.getData)

    const sensorsData = await Promise.all(sensors.map(({ id }) => {
      return axios.get(`${apiGiosBaseUrl}/data/getData/${id}`)
        .then(functions.getData)
    }))

    return sensorsData.map(({ key, values }) => ({
      details: sensors.find(({ paramTwo }) => paramTwo === key),
      measurement: values.filter(({ value }) => value !== null),
      qualityLevel: qualityLevels[`${key.replace('.', '').toLowerCase()}IndexLevel`].indexLevelName || 'Brak indeksu'
    }))
  }
}
