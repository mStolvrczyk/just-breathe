import pollutionLimits from './pollutionLimits'

export default class Functions {
  setBackgroundColor (measurements, symbol, opacity) {
    let colorArray = []
    let compartments = [
      {
        symbol: 'PM10',
        limits: [20.00, 60.00, 100.00, 140.00, 200.00]
      },
      {
        symbol: 'PM2.5',
        limits: [12.00, 36.00, 60.00, 84.00, 120.00]
      },
      {
        symbol: 'O3',
        limits: [30.00, 70.00, 120.00, 160.00, 240.00]
      },
      {
        symbol: 'NO2',
        limits: [40.00, 100.00, 150.00, 200.00, 400.00]
      },
      {
        symbol: 'SO2',
        limits: [50.00, 100.00, 200.00, 350.00, 500.00]
      },
      {
        symbol: 'C6H6',
        limits: [5.00, 10.00, 15.00, 20.00, 50.00]
      },
      {
        symbol: 'CO',
        limits: [2499.00, 6499.00, 10499.00, 14499.00, 20499.00]
      }
    ]
    let colors = [
      'rgba(87, 177, 8)',
      'rgba(176, 221, 16)',
      'rgba(255, 217, 17)',
      'rgba(229, 129, 0)',
      'rgba(229, 0, 0)',
      'rgba(153, 0, 0)'
    ]
    let opacityColors = [
      'rgba(87, 177, 8, 0.6)',
      'rgba(176, 221, 16, 0.6)',
      'rgba(255, 217, 17, 0.6)',
      'rgba(229, 129, 0, 0.6)',
      'rgba(229, 0, 0, 0.6)',
      'rgba(153, 0, 0, 0.6)'
    ]
    let currSymbolLimits = compartments.find(test => test.symbol === symbol).limits
    measurements.forEach(measurement => {
      let currMeasurementWithLimits = currSymbolLimits.concat([measurement])
      currMeasurementWithLimits.sort((a, b) => { return a - b })
      if (opacity) {
        colorArray.push(opacityColors[currMeasurementWithLimits.indexOf(measurement)])
      } else {
        colorArray.push(colors[currMeasurementWithLimits.indexOf(measurement)])
      }
    })
    return colorArray
  }
  getDistance (origin, destination) {
    let lon1 = this.toRadian(origin[1])
    let lat1 = this.toRadian(origin[0])
    let lon2 = this.toRadian(destination[1])
    let lat2 = this.toRadian(destination[0])

    let deltaLat = lat2 - lat1
    let deltaLon = lon2 - lon1

    let a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2)
    let c = 2 * Math.asin(Math.sqrt(a))
    let EARTH_RADIUS = 6371
    return c * EARTH_RADIUS * 1000
  }
  toRadian (degree) {
    return degree * Math.PI / 180
  }
  formatDate (date) {
    let d = date
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    let year = d.getFullYear()

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }
    return [year, month, day].join('-')
  }
  getAverage (values) {
    let sum = null
    values.forEach((value) => {
      sum = sum + value
    })
    return sum / values.length
  }
  getLastMeasurement (measurements) {
    return measurements[measurements.length - 1]
  }
  getPollutionLimit (symbol, value) {
    let limit = pollutionLimits[symbol]
    return ((value * 100) / limit).toFixed(1)
  }
  mapLastValues (response) {
    let values = response.map(({ measurement }) => measurement)
    let valuesArray = []
    values.forEach(value => {
      value.reverse()
      valuesArray.push(value[value.length - 1].value)
    })
    return valuesArray
  }
  mapSensors (sensorsDetails, lastSensorsValues) {
    let sensorsArray = []
    for (let i = 0; i < sensorsDetails.length && i < lastSensorsValues.length; i++) {
      let currentValue = [lastSensorsValues[i]]
      sensorsArray.push({
        id: sensorsDetails[i].id,
        name: sensorsDetails[i].param,
        symbol: sensorsDetails[i].paramTwo,
        lastValue: (lastSensorsValues[i]).toFixed(1),
        backgroundColor: this.setBackgroundColor(currentValue, sensorsDetails[i].paramTwo, false)[0],
        pollutionLimit: this.getPollutionLimit(sensorsDetails[i].paramTwo, (lastSensorsValues[i]).toFixed(1))
      })
    }
    return sensorsArray
  }
  roundStationDistance (stationDistance) {
    if (stationDistance >= 1000) {
      stationDistance = (stationDistance / 1000).toFixed(1) + ' km'
    } else {
      stationDistance = stationDistance.toFixed(0) + ' m'
    }
    return stationDistance
  }
  chartDataFilter ({ pollutionLimit, backgroundColor }) {
    return {
      pollutionLimit: pollutionLimit,
      backgroundColor: backgroundColor
    }
  }
}
