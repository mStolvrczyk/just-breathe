import StationsService from '@/services/StationsService'
import sensorNames from '@/libs/sensorNames'
import pollutionLevels from '@/libs/pollutionLevels'
import pollutionLimits from '@/libs/pollutionLimits'
import { forEach } from 'ramda'

export default class Functions {
  // LeafletMap.vue functions
  apiResponse = null
  sensorId = null
  found = null
  stationsService = new StationsService()
  stationDetails = null
  averageMeasurement = null
  lastMeasurement = null
  barDataColllection = null
  lineDataCollection = null
  date = this.formatDate(new Date())

  getMark (station) {
    return {
      lat: station.coordinates[0],
      lng: station.coordinates[1]
    }
  }

  getDistance (origin, destination) {
    // return distance in meters
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
  closestStation (stations, userLocation) {
    let minDist = Infinity
    let nearest_text = '*None*'
    let markerDist
    let stationId
    // get all objects added to the map
    // iterate over objects and calculate distance between them
    for (let i = 0; i < stations.length; i += 1) {
      markerDist = this.getDistance(stations[i].coordinates.map(Number), userLocation)
      if (markerDist < minDist) {
        minDist = markerDist
        // eslint-disable-next-line camelcase
        nearest_text = stations[i].coordinates
        stationId = stations[i].id
      }
    }
    this.found = {
      id: stationId,
      lat: nearest_text[0],
      lng: nearest_text[1]
    }
  }

  async getStationDetails (id, stations, userLocation) {
    let response = (await this.stationsService.getStation(id)).filter(({measurement}) => measurement.length>0)
    this.apiResponse = response
    let stationId = id
    let station = await stations.find(({ id }) => id === stationId)
    let sensorsDetails = response.map(({ details }) => details)
    let lastSensorsValues = this.mapLastValues(response)
    this.stationDetails = {
      stationName: station.stationName,
      city: station.city,
      sensors: this.mapSensors(sensorsDetails, lastSensorsValues),
      stationDistance: this.roundStationDistance(this.getDistance(station.coordinates, userLocation))
    }
  }
  roundStationDistance (stationDistance) {
    if (stationDistance >= 1000) {
      stationDistance = (stationDistance / 1000).toFixed(1)+'km'
    } else {
      stationDistance = stationDistance.toFixed(0)+'m'
    }
    return stationDistance
  }
  // async getSensorDetails (id) {
  //   let response = await this.stationsService.getSensor(id)
  //   let filteredMeasurements = (response.measurements.filter(({date}) => date >= this.date+' 00:00:00')).reverse()
  //   let filteredValues = filteredMeasurements.map(({value}) => value)
  //   let averageMeasurement = this.getAverage(filteredValues)
  //   let lastMeasurement = this.getLastMeasurement(filteredValues)
  //   this.sensorDetails = {
  //     id: response.id,
  //     name: sensorNames[response.key],
  //     symbol: response.key,
  //     measurements: filteredMeasurements,
  //     backgroundColor: this.setBackgroundColor(filteredValues, response.key),
  //     averageMeasurement: {
  //       measurement: averageMeasurement[0].toFixed(2),
  //       backgroundColor: this.setBackgroundColor(averageMeasurement, response.key)[0],
  //       pollutionLevel: pollutionLevels[this.setBackgroundColor(averageMeasurement, response.key)[0]]
  //     },
  //     lastMeasurement: {
  //       measurement: lastMeasurement[0],
  //       pollutionLevel: pollutionLevels[this.setBackgroundColor(lastMeasurement, response.key)[0]]
  //     }
  //   }
  //   this.fillDatacollection(this.sensorDetails)
  // }

  async fillDatacollection (id, apiResponse) {
    let sensor = apiResponse.find(sensor => sensor.details.id === id)
    let filteredMeasurements = sensor.measurement.filter(({date}) => date >= this.date + ' 00:00:00')
    let filteredValues = filteredMeasurements.map(({value}) => value)
    let averageMeasurement = this.getAverage(filteredValues)
    let lastMeasurement = this.getLastMeasurement(filteredValues)
    this.sensorId = sensor.details.id
    this.averageMeasurement = {
      value: averageMeasurement[0].toFixed(2),
      procentValue: this.getPollutionLimit(sensor.details.paramTwo, averageMeasurement[0]),
      pollutionLevel: pollutionLevels[this.setBackgroundColor(averageMeasurement, sensor.details.paramTwo, false)[0]]
    }
    this.lastMeasurement = {
      value: lastMeasurement[0].toFixed(2),
      procentValue: this.getPollutionLimit(sensor.details.paramTwo, lastMeasurement[0]),
      pollutionLevel: pollutionLevels[this.setBackgroundColor(lastMeasurement, sensor.details.paramTwo, false)[0]]
    }
    this.barDataColllection = {
      labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
      datasets: [
        {
          label: sensor.details.param+' ('+sensor.details.paramTwo+')',
          backgroundColor: this.setBackgroundColor(filteredValues, sensor.details.paramTwo, true),
          data: filteredMeasurements.map(({value}) => value.toFixed(2))
        }
      ]
    }
    this.lineDataCollection = {
      labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
      datasets: [
        {
          label: sensor.details.param+' ('+sensor.details.paramTwo+')',
          backgroundColor: this.setBackgroundColor(averageMeasurement, sensor.details.paramTwo, true)[0],
          data: filteredMeasurements.map(({value}) => value.toFixed(2))
        }
      ]
    }
  }
  formatDate (date) {
    let d = date,
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  setBackgroundColor (measurements, symbol, opacity) {
    let colorArray = []
    let compartments = [
      {
        symbol: 'PM10',
        limits: [20.00, 60.00, 100.00, 140.00, 200.00],
      },
      {
        symbol: 'PM2.5',
        limits: [12.00, 36.00, 60.00, 84.00, 120.00],
      },
      {
        symbol: 'O3',
        limits: [30.00, 70.00, 120.00, 160.00, 240.00],
      },
      {
        symbol: 'NO2',
        limits: [40.00, 100.00, 150.00, 200.00, 400.00],
      },
      {
        symbol: 'SO2',
        limits: [50.00, 100.00, 200.00, 350.00, 500.00],
      },
      {
        symbol: 'C6H6',
        limits: [5.00, 10.00, 15.00, 20.00, 50.00],
      },
      {
        symbol: 'CO',
        limits: [2499.00, 6499.00, 10499.00, 14499.00, 20499.00],
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
    let currSymbolLimits = compartments.find(test => test.symbol === symbol).limits;
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
  getAverage (values) {
    let sum = null
    values.forEach((value) => {
      sum = sum+value
    })
    return  [
      sum/values.length
    ]
  }
  getLastMeasurement (measurements) {
    return [
      measurements[measurements.length-1]
    ]
  }
  getYesterdaysDate () {
    let yesterdayDate = new Date
    yesterdayDate.setDate(yesterdayDate.getDate() - 1)
    return this.formatDate(yesterdayDate)
  }
  async compareWithYesterday (id, apiResponse) {
  let yesterdaysDate = this.getYesterdaysDate()
  let sensor = apiResponse.find(sensor => sensor.details.id === id)
  let filteredMeasurements = sensor.measurement.filter(({date}) => date >= this.date+' 00:00:00')
  let filteredValues = filteredMeasurements.map(({value}) => value)
  let averageMeasurement = this.getAverage(filteredValues)
  let lastMeasurementsTime = filteredMeasurements[filteredMeasurements.length-1].date.substring(11)
  let yesterdaysMeasurements = (sensor.measurement.filter(({date}) => date >= yesterdaysDate+' 00:00:00' && date <= yesterdaysDate+' '+lastMeasurementsTime )).reverse()
  let yesterdayValues = yesterdaysMeasurements.map(({value}) => value)
  let yesterdaysAverageMeasurement = this.getAverage(yesterdayValues)
    // if( sensorDetails.measurements.length === yesterdaysMeasurements.length) {
      this.barDataColllection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: yesterdaysDate,
            backgroundColor: this.setBackgroundColor(yesterdayValues, sensor.details.paramTwo, true),
            data: yesterdayValues
          },
          {
            label: this.date,
            backgroundColor: this.setBackgroundColor(filteredValues, sensor.details.paramTwo, true),
            data: filteredMeasurements.map(({value}) => value)
          }
        ],
      }
      this.lineDataCollection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: yesterdaysDate,
            backgroundColor: this.setBackgroundColor(yesterdaysAverageMeasurement, sensor.details.paramTwo, true)[0],
            data: yesterdayValues
          },
          {
            label: this.date,
            backgroundColor: this.setBackgroundColor(averageMeasurement, sensor.details.paramTwo, true)[0],
            data: filteredMeasurements.map(({value}) => value)
          }
        ]
      }
    // }
  }
  mapLastValues (response) {
    let values = response.map(({measurement}) => measurement)
    let valuesArray = []
    values.forEach(value => {
      value.reverse()
      valuesArray.push(value[value.length-1].value)
    })
    return valuesArray
  }
  mapSensors (sensorsDetails, lastSensorsValues) {
    let sensorsArray = []
    for(let i = 0; i<sensorsDetails.length && i<lastSensorsValues.length; i++) {
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
  getPollutionLimit (symbol, value) {
    let limit = pollutionLimits[symbol]
    return ((value*100)/limit).toFixed(1)
  }
}























