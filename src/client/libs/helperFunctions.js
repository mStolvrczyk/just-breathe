import StationsService from '@/services/StationsService'
import sensorNames from '@/libs/sensorNames'
import pollutionLevels from '@/libs/pollutionLevels'
import { forEach } from 'ramda'


export default class Functions {

  //LeafletMap.vue functions

  found = null
  stationsService = new StationsService()
  stationDetails = null
  sensorDetails = null
  barDataColllection = {}
  lineDataCollection = {}
  date = this.formatDate(new Date)


  getMark (station) {
    return {
      lat: station.coordinates[0],
      lng: station.coordinates[1],
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
    let stationId  = id
    let station = await stations.find(({ id }) => id === stationId)
    this.stationDetails = {
      stationName: station.stationName,
      city: station.city,
      sensors: await this.stationsService.getStation(station.id),
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
  async getSensorDetails (id) {
    let response = await this.stationsService.getSensor(id)
    let filteredMeasurements = (response.measurements.filter(({date}) => date >= this.date+' 00:00:00')).reverse()
    let filteredValues = filteredMeasurements.map(({value}) => value)
    let averageMeasurement = this.getAverage(filteredValues)
    let lastMeasurement = this.getLastMeasurement(filteredValues)
    this.sensorDetails = {
      id: response.id,
      name: sensorNames[response.key],
      symbol: response.key,
      measurements: filteredMeasurements,
      backgroundColor: this.setBackgroundColor(filteredValues, response.key),
      averageMeasurement: {
        measurement: averageMeasurement[0].toFixed(2),
        backgroundColor: this.setBackgroundColor(averageMeasurement, response.key)[0],
        pollutionLevel: pollutionLevels[this.setBackgroundColor(averageMeasurement, response.key)[0]]
      },
      lastMeasurement: {
        measurement: lastMeasurement[0],
        pollutionLevel: pollutionLevels[this.setBackgroundColor(lastMeasurement, response.key)[0]]
      }
    }
    this.fillDatacollection(this.sensorDetails)
  }

  fillDatacollection (sensor) {
    this.barDataColllection = {
      labels: sensor.measurements.map(({ date }) => date.substring(11, 16)),
      datasets: [
        {
          label: sensor.name+' ('+sensor.symbol+')',
          backgroundColor: sensor.backgroundColor,
          data: sensor.measurements.map(({value}) => value)
        },
      ],
    }
    this.lineDataCollection = {
      labels: sensor.measurements.map(({ date }) => date.substring(11, 16)),
      datasets: [
        {
          label: sensor.name+' ('+sensor.symbol+')',
          backgroundColor: sensor.averageMeasurement.backgroundColor,
          data: sensor.measurements.map(({value}) => value)
        },
      ],
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

  setBackgroundColor (measurements, symbol) {
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
      'rgba(87, 177, 8, 0.5)',
      'rgba(176, 221, 16, 0.5)',
      'rgba(255, 217, 17, 0.5)',
      'rgba(229, 129, 0, 0.5)',
      'rgba(229, 0, 0, 0.5)',
      'rgba(153, 0, 0, 0.5)',
    ]
    let currSymbolLimits = compartments.find(test => test.symbol === symbol).limits;
    measurements.forEach(measurement => {
      let currMeasurementWithLimits = currSymbolLimits.concat([measurement]);
      currMeasurementWithLimits.sort((a,b) => {return a - b});
      colorArray.push(colors[currMeasurementWithLimits.indexOf(measurement)]);
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
  async compareWithYesterday (measurementsId, sensorDetails) {
  let yesterdaysDate = this.getYesterdaysDate()
  let response = await this.stationsService.getSensor(measurementsId)
  let lastMeasurementsTime = sensorDetails.measurements[sensorDetails.measurements.length-1].date.substring(11)
  let yesterdaysMeasurements = (response.measurements.filter(({date}) => date >= yesterdaysDate+' 00:00:00' && date <= yesterdaysDate+' '+lastMeasurementsTime )).reverse()
  let yesterdayValues = yesterdaysMeasurements.map(({value}) => value)
  let yesterdaysAverage = this.getAverage(yesterdayValues)
    // if( sensorDetails.measurements.length === yesterdaysMeasurements.length) {
      this.barDataColllection = {
        labels: sensorDetails.measurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: yesterdaysDate,
            backgroundColor: this.setBackgroundColor(yesterdayValues, response.key),
            data: yesterdayValues
          },
          {
            label: this.date,
            backgroundColor: sensorDetails.backgroundColor,
            data: sensorDetails.measurements.map(({value}) => value)
          }
        ],
      }
      this.lineDataCollection = {
        labels: sensorDetails.measurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: yesterdaysDate,
            backgroundColor: this.setBackgroundColor(yesterdaysAverage, response.key)[0],
            data: yesterdayValues
          },
          {
            label: this.date,
            backgroundColor: sensorDetails.averageMeasurement.backgroundColor,
            data: sensorDetails.measurements.map(({value}) => value)
          }
        ],
      }
    // }
  }
}























