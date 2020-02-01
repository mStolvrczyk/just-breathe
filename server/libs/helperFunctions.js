// module.exports = {
//   getData: function ({ data }) {
//     return data
//   },
//   stationsFilter: function ({ id, stationName, city, gegrLat, gegrLon }) {
//     return {
//       id,
//       stationName: stationName.replace('_', ' '),
//       city: city ? city.name : '',
//       coordinates: [
//         gegrLat,
//         gegrLon
//       ],
//     }
//   },
//   stationFilter: function ({ id, param }) {
//     return {
//       id,
//       param: param ? param.paramName : '',
//       paramTwo: param ? param.paramFormula : ''
//     }
//   }
// }

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
      ],
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
