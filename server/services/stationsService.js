const { prop } = require('ramda')
const indexBy = require('ramda/src/indexBy')
const axios = require('axios')
const functions = require('../libs/helperFunctions')
const apiGiosBaseUrl = require('../libs/apiGiosBaseUrl.js')
const apiImgwUrl = require('../libs/apiImgwUrl.js')

module.exports = {
  getAllStations: async () => {
    const giosData = await axios.get(`${apiGiosBaseUrl}/station/findAll`)
      .then(functions.getData)
      .then((data) => data.map(functions.stationsFilter))
    const imgwData = await axios.get(`${apiImgwUrl}`)
      .then(functions.getData)
      .then((data) => data.map(functions.imgwFilter))
    let indexedImgwData = indexBy(prop('station'), imgwData)
    return giosData.map((obiect) => {
      return {
        ...obiect,
        temperature: indexedImgwData[obiect.city] ? indexedImgwData[obiect.city].temperature : null,
        pressure: indexedImgwData[obiect.city] ? indexedImgwData[obiect.city].pressure : null,
        wind: indexedImgwData[obiect.city] ? indexedImgwData[obiect.city].wind : null,
        humidity: indexedImgwData[obiect.city] ? indexedImgwData[obiect.city].humidity : null
      }
    })
  },
  getStation: async (stationID) => {
    const sensors = await axios.get(`${apiGiosBaseUrl}/station/sensors/${stationID}`)
      .then(functions.getData)
      .then((data) => data.map(functions.sensorsFilter))

    const sensorsData = await Promise.all(sensors.map(({ id }) => {
      return axios.get(`${apiGiosBaseUrl}/data/getData/${id}`)
        .then(functions.getData)
    }))

    return sensorsData.map(({ key, values }) => ({
      details: sensors.find(({ paramTwo }) => paramTwo === key),
      measurement: values.filter(({ value }) => value !== null)
    }))
  }
}
