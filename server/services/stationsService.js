// const axios = require('axios')
// const functions = require('../libs/helperFunctions')
// const apiGiosBaseUrl = require('../libs/Urls.js')
// module.exports = {
//   getAllStations: async () => {
//     return axios.get(`${apiGiosBaseUrl}/station/findAll`)
//       .then(functions.getData)
//       .then((data) => {
//         return data.map(functions.stationsFilter)
//       })
//   },
//   getStation: async (stationID) => {
//     return  axios.get(`${apiGiosBaseUrl}/station/sensors/${stationID}`)
//       .then(functions.getData)
//       .then((data) => data.map(functions.stationFilter))
//   },
//   getSensor: async (sensorID) => {
//     const sensorsData = await axios.get(`${apiGiosBaseUrl}/data/getData/${sensorID}`)
//       .then(functions.getData)
//     return {
//       id: sensorID,
//       key: sensorsData.key,
//       measurements: sensorsData.values.filter(({ value }) => value !== null),
//     }
//   }
// }

const axios = require('axios')
const functions = require('../libs/helperFunctions')
const Urls = require('../libs/Urls.js')

module.exports = {
  getAllStations: async () => {
    return axios.get(`${Urls.apiGiosBaseUrl}/station/findAll`)
      .then(functions.getData)
      .then((data) => {
        return data.map(functions.stationsFilter)
      })
  },
  getTotoData: async () => {
    return axios.get('https://danepubliczne.imgw.pl/api/data/synop')
      .then(functions.getData)
      .then((data) => {
        return data
      })
  },
  getStation: async (stationID) => {
    const sensors = await axios.get(`${Urls.apiGiosBaseUrl}/station/sensors/${stationID}`)
      .then(functions.getData)
      .then((data) => data.map(functions.sensorsFilter))

    const sensorsData = await Promise.all(sensors.map(({ id }) => {
      return axios.get(`${Urls.apiGiosBaseUrl}/data/getData/${id}`)
        .then(functions.getData)
    }))

    return sensorsData.map(({ key, values }) => ({
      details: sensors.find(({ paramTwo }) => paramTwo === key),
      measurement: values.filter(({ value }) => value !== null)
    }))
  }
}
