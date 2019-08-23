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
    let stationSensorsData = []

    const sensors = await axios.get(`${apiGiosBaseUrl}/station/sensors/${stationID}`)
      .then(functions.getData)
      .then((data) => data.map(functions.sensorsFilter))

    const qualityLevels = await axios.get(`${apiGiosBaseUrl}/aqindex/getIndex/${stationID}`)
      .then(functions.getData)

    for (let { id } of sensors) {
      axios.get(`${apiGiosBaseUrl}/data/getData/${id}`)
        .then(functions.getData)
        .then(({ key, values }) => {
          let qualityLevel = qualityLevels[`${key.replace('.', '').toLowerCase()}IndexLevel`]

          stationSensorsData.push({
            details: sensors.find(({ paramTwo }) => paramTwo === key),
            measurement: values.find(({ value }) => value !== null),
            qualityLevel: qualityLevel !== null ? qualityLevel.indexLevelName : 'Brak indeksu'
          })
        })
    }
    return stationSensorsData
  }
}
