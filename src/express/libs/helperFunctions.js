
module.exports = {
  getData: function ({ data }) {
    return data
  },
  stationsFilter: function ({ id, stationName, city, gegrLat, gegrLon }) {
    return {
      id,
      stationName: stationName.replace('_', ' '),
      city: city ? city.name : '',
      coordinates: [
        gegrLat,
        gegrLon
      ]
    }
  },
  // eslint-disable-next-line camelcase
  imgwFilter: function ({ stacja, temperatura, predkosc_wiatru, wilgotnosc_wzgledna, cisnienie }) {
    return {
      station: stacja.replace(' ', '-'),
      temperature: temperatura,
      pressure: cisnienie,
      wind: predkosc_wiatru,
      humidity: wilgotnosc_wzgledna
    }
  },
  sensorsFilter: function ({ id, param }) {
    return {
      id,
      param: param ? param.paramName : '',
      paramTwo: param ? param.paramFormula : ''
    }
  }
}
