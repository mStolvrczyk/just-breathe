import pollutionLimits from './pollutionLimits'
import pollutionLevels from '@/libs/pollutionLevels'

export default class Functions {
  setBackgroundColor (measurements, symbol, opacity) {
    const colorArray = []
    const compartments = [
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
    const colors = [
      'rgba(87, 177, 8)',
      'rgba(176, 221, 16)',
      'rgba(255, 217, 17)',
      'rgba(229, 129, 0)',
      'rgba(229, 0, 0)',
      'rgba(153, 0, 0)'
    ]
    const opacityColors = [
      'rgba(87, 177, 8, 0.6)',
      'rgba(176, 221, 16, 0.6)',
      'rgba(255, 217, 17, 0.6)',
      'rgba(229, 129, 0, 0.6)',
      'rgba(229, 0, 0, 0.6)',
      'rgba(153, 0, 0, 0.6)'
    ]
    const currSymbolLimits = compartments.find(test => test.symbol === symbol).limits
    measurements.forEach(measurement => {
      const currMeasurementWithLimits = currSymbolLimits.concat([measurement])
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
    const lon1 = this.toRadian(origin[1])
    const lat1 = this.toRadian(origin[0])
    const lon2 = this.toRadian(destination[1])
    const lat2 = this.toRadian(destination[0])

    const deltaLat = lat2 - lat1
    const deltaLon = lon2 - lon1

    const a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2)
    const c = 2 * Math.asin(Math.sqrt(a))
    const EARTH_RADIUS = 6371
    return c * EARTH_RADIUS * 1000
  }

  toRadian (degree) {
    return degree * Math.PI / 180
  }

  formatDate (date) {
    const d = date
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    const year = d.getFullYear()

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
    const limit = pollutionLimits[symbol]
    return ((value * 100) / limit).toFixed(1)
  }

  mapLastValues (response) {
    const sensorsMeasurements = response.map(({ measurement }) => measurement)
    const measurementsArray = []
    sensorsMeasurements.forEach(sensorMeasurements => {
      sensorMeasurements.reverse()
      measurementsArray.push({
        value: sensorMeasurements[sensorMeasurements.length - 1].value,
        date: sensorMeasurements[sensorMeasurements.length - 1].date
      })
    })
    return measurementsArray
  }

  mapSensors (sensorsDetails, lastSensorsValues) {
    console.log(lastSensorsValues)
    const sensorsArray = []
    for (let i = 0; i < sensorsDetails.length && i < lastSensorsValues.length; i++) {
      sensorsArray.push({
        id: sensorsDetails[i].id,
        name: sensorsDetails[i].param,
        symbol: sensorsDetails[i].paramTwo,
        lastValue: parseFloat((lastSensorsValues[i].value).toFixed(1)),
        pollutionLevel: pollutionLevels[this.setBackgroundColor([lastSensorsValues[i].value], sensorsDetails[i].paramTwo, false)[0]],
        time: lastSensorsValues[i].date.substring(11, 16),
        backgroundColor: this.setBackgroundColor([lastSensorsValues[i].value], sensorsDetails[i].paramTwo, false)[0],
        lastPercentValue: parseFloat(this.getPollutionLimit(sensorsDetails[i].paramTwo, (lastSensorsValues[i].value).toFixed(1)))
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
}
