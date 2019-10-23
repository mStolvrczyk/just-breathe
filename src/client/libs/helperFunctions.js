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
    console.log(lastMeasurement)
    this.sensorDetails = {
      name: sensorNames[response.key],
      symbol: response.key,
      measurements: filteredMeasurements,
      backgroundColor: this.setBackgroundColor(filteredValues, response.key),
      averageMeasurement: {
        measurement: averageMeasurement[0],
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
    let sensorValue = null
    let compartment = {}
    let infinity = Infinity
    let compartments = [
      {
        symbol: 'PM10',
        limits: [
          [0,20], [20, 60], [60,100], [100, 140], [140, 200], [200, infinity]
        ],
      },
      {
        symbol: 'PM2.5',
        limits: [
          [0,12], [12, 36], [36,60], [60, 84], [84, 120], [120, infinity]
        ],
      },
      {
        symbol: 'O3',
        limits: [
          [0,30], [30, 70], [70,120], [120, 160], [160, 240], [240, infinity]
        ],
      },
      {
        symbol: 'NO2',
        limits: [
          [0,40], [40, 100], [100,150], [150, 200], [200, 400], [400, infinity]
        ],
      },
      {
        symbol: 'SO2',
        limits: [
          [0,50], [50, 100], [100,200], [200, 350], [350, 500], [500, infinity]
        ],
      },
      {
        symbol: 'C6H6',
        limits: [
          [0,5], [5,10], [10,15], [15, 20], [20, 50], [50, infinity]
        ],
      },
      {
        symbol: 'CO',
        limits: [
          [0,2499], [2499, 6499], [6499,10499], [10499, 14499], [14499, 20499], [20499, infinity]
        ],
      }
    ]
    let colors = [
      '#57b108',
      '#b0dd10',
      '#ffd911',
      '#e58100',
      '#e50000',
      '#990000'
    ]
    for (let i=0; i<compartments.length; i+=1) {
      if (symbol === compartments[i].symbol) {
        compartment = compartments[i]
        for (let i=0; i<measurements.length; i+=1) {
          sensorValue = measurements[i]
          for (let i=0; i<compartment.limits.length; i+=1) {
            if (compartment.limits[i][0] <= sensorValue && sensorValue <= compartment.limits[i][1]) {
              colorArray.push(colors[i])
            }
          }
        }
      }
    }
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
}























