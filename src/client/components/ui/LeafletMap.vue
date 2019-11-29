<template>
  <div class="custom-popup" id="map">
    <l-map
      @click="hideStation"
      ref="map"
      :zoom.sync="zoom"
      :center.sync="center"
      style="z-index: 0"
      :options="options"
    >
      <l-tile-layer :url="url"
                   :attribution="attribution"></l-tile-layer>
      <l-marker
        :key="station.id"
        v-for="station in stations"
        :lat-lng="getMark(station)"
        @click="getStationDetails(station.id, stations, userLocation)"
      >
        <l-icon
          v-if="centerStationId === station.id"
          :icon-url="yellowIcon"
          :icon-size="yellowIconSize"
        ></l-icon>
        <l-icon
          v-else
          :icon-url="tealIcon"
          :icon-size="tealIconSize"
        ></l-icon>
      </l-marker>
    </l-map>
    <StationInput
    :stations="stations"
    v-on:setSelectedStation="setSelectedStation"
    :autocompleteInput="autocompleteInput"
    />
    <ButtonPanel
    :stations="stations"
    :width:="width"
    :userLocation="userLocation"
    :buttonVisibility="buttonVisibility"
    v-on:zoomReset="zoomReset"
    v-on:setFound="setFound"
    />
    <StationCard
      :stationDetails="stationDetails"
      v-on:closeStationCard="closeStationCard"
    />
    <SensorPanel
    :stationDetails="stationDetails"
    />
<!--    <transition name="station_popup">-->
<!--      <div id="sensor_panel" align="center" v-if="stationDetails != null">-->
<!--        <v-container-->
<!--          fluid class="pa-0"-->
<!--          v-for="sensor in stationDetails.sensors"-->
<!--          :key="sensor.id"-->
<!--        >-->
<!--          <v-row align="center" dense>-->
<!--            <v-col cols="5">-->
<!--                <v-tooltip bottom>-->
<!--                  <template v-slot:activator="{ on }">-->
<!--                    <v-card v-on="on" rounded color="teal lighten-1" block class="white&#45;&#45;text">-->
<!--                      {{sensor.symbol}}-->
<!--                    </v-card>-->
<!--                  </template>-->
<!--                  <span>{{sensor.name}}</span>-->
<!--                </v-tooltip>-->
<!--            </v-col>-->
<!--            <v-col cols="5">-->
<!--              <v-tooltip bottom>-->
<!--                <template v-slot:activator="{ on }">-->
<!--                  <v-card v-on="on" class="white&#45;&#45;text" :style="{ 'background-color': sensor.backgroundColor }">-->
<!--                        <strong>{{sensor.pollutionLimit+'%'}}</strong>-->
<!--                  </v-card>-->
<!--                </template>-->
<!--                  <span>{{sensor.lastValue+' &#181/m'}}<sup>3</sup></span>-->
<!--              </v-tooltip>-->
<!--            </v-col>-->
<!--            <v-col cols="2">-->
<!--              <v-tooltip bottom>-->
<!--                <template v-slot:activator="{ on }">-->
<!--                  <v-btn v-on="on" @click="fillDatacollection(sensor.id, apiResponse)" fab x-small color="teal lighten-1">-->
<!--                    <v-icon style="font-size:18px;color: white">mdi-dots-horizontal</v-icon>-->
<!--                  </v-btn>-->
<!--                </template>-->
<!--                <span>Pokaż szczegóły</span>-->
<!--              </v-tooltip>-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--        </v-container>-->
<!--      </div>-->
<!--    </transition>-->
    <ChartDialog
      :sensorDetails="sensorDetails"
      :apiResponse="apiResponse"
      :barDataCollection="barDataColllection"
      :lineDataCollection="lineDataCollection"
      :chartDialogVisibility.sync="chartDialogVisibility"
      :chartVisibility.sync="chartVisibility"
      v-on:closeChartDialog="closeChartDialog"
      v-on:barDataComparison="barDataComparison"
      v-on:lineDataComparison="lineDataComparison"
      v-on:withoutComparison="withoutComparison"
    />
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet'
import StationsService from '@/services/StationsService'
import pollutionLevels from '@/libs/pollutionLevels'
import pollutionLimits from '@/libs/pollutionLimits'
import ChartDialog from '@/components/ui/ChartDialog'
import ButtonPanel from '@/components/ui/ButtonPanel'
import StationInput from '@/components/ui/StationInput'
import StationCard from '@/components/ui/StationCard'
import SensorPanel from '@/components/ui/SensorPanel'
export default {
  name: 'LeafletMap',
  data () {
    return {
      sensorDetails: {
        sensorId: null,
        averageMeasurement: null,
        lastMeasurement: null
      },
      chartDialogVisibility: false,
      chartVisibility: false,
      barDataColllection: null,
      lineDataCollection: null,
      date: this.formatDate(new Date()),
      apiResponse: null,
      found: null,
      zoomHolder: null,
      options: { zoomControl: false },
      zoom: 6,
      center: [
        52.25,
        19.3
      ],
      buttonVisibility: false,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      tealIcon: require('@/assets/tealPin.png'),
      yellowIcon: require('@/assets/yellowPin.png'),
      tealIconSize: [40, 40],
      yellowIconSize: [30, 40],
      initialLocation: [59.93428, 30.335098],
      width: document.documentElement.clientWidth,
      userLocation: [],
      watcher: navigator.geolocation.watchPosition(this.setLocation),
      centerStationId: null,
      stationDetails: null,
      stationsService: new StationsService(),
      selectedStation: null
    }
  },
  components: {
    SensorPanel,
    StationCard,
    StationInput,
    ButtonPanel,
    ChartDialog,
    LMap,
    LTileLayer,
    LMarker,
    LIcon
  },
  props: {
    stations: Array,
    autocompleteInput: Boolean
  },
  methods: {
    closeStationCard (value) {
      this.stationDetails = value
    },
    setSelectedStation (value) {
      if (value !== null) {
        this.center = {
          lat: value.coordinates[0],
          lng: value.coordinates[1]
        }
        this.getStationDetails(value.id, this.stations, this.userLocation)
        this.centerStationId = value.id
        this.zoom = 10
      }
      this.$emit('closeAutocompleteDialog', false)
      this.selectedStation = null
    },
    setFound (value) {
      this.found = value
    },
    withoutComparison (value) {
      this.fillDatacollection(value, this.apiResponse)
    },
    barDataComparison (value) {
      this.barDataColllection = value
    },
    lineDataComparison (value) {
      this.lineDataCollection = value
    },
    hideStation () {
      this.$emit('closeAutocompleteDialog', false)
      this.stationDetails = null
    },
    closeChartDialog (value) {
      this.chartDialogVisibility = value
      this.chartVisibility = value
    },
    getMark (station) {
      return {
        lat: station.coordinates[0],
        lng: station.coordinates[1]
      }
    },
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
    },
    toRadian (degree) {
      return degree * Math.PI / 180
    },
    async getStationDetails (id, stations, userLocation) {
      let response = (await this.stationsService.getStation(id)).filter(({ measurement }) => measurement.length > 0)
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
    },
    roundStationDistance (stationDistance) {
      if (stationDistance >= 1000) {
        stationDistance = (stationDistance / 1000).toFixed(1) + 'km'
      } else {
        stationDistance = stationDistance.toFixed(0) + 'm'
      }
      return stationDistance
    },
    async fillDatacollection (id, apiResponse) {
      let sensor = apiResponse.find(sensor => sensor.details.id === id)
      let filteredMeasurements = sensor.measurement.filter(({ date }) => date >= this.date + ' 00:00:00')
      let filteredValues = filteredMeasurements.map(({ value }) => value)
      let averageMeasurement = this.getAverage(filteredValues)
      let lastMeasurement = this.getLastMeasurement(filteredValues)
      this.barDataColllection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: sensor.details.param + ' (' + sensor.details.paramTwo + ')',
            backgroundColor: this.setBackgroundColor(filteredValues, sensor.details.paramTwo, true),
            data: filteredMeasurements.map(({ value }) => value.toFixed(2))
          }
        ]
      }
      this.lineDataCollection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: sensor.details.param + ' (' + sensor.details.paramTwo + ')',
            backgroundColor: this.setBackgroundColor(averageMeasurement, sensor.details.paramTwo, true)[0],
            data: filteredMeasurements.map(({ value }) => value.toFixed(2))
          }
        ]
      }
      this.sensorDetails.averageMeasurement = {
        value: averageMeasurement[0].toFixed(2),
        procentValue: this.getPollutionLimit(sensor.details.paramTwo, averageMeasurement[0]),
        pollutionLevel: pollutionLevels[this.setBackgroundColor(averageMeasurement, sensor.details.paramTwo, false)[0]]
      }
      this.sensorDetails.lastMeasurement = {
        value: lastMeasurement[0].toFixed(2),
        procentValue: this.getPollutionLimit(sensor.details.paramTwo, lastMeasurement[0]),
        pollutionLevel: pollutionLevels[this.setBackgroundColor(lastMeasurement, sensor.details.paramTwo, false)[0]]
      }
      this.chartDialogVisibility = true
      this.sensorDetails.sensorId = sensor.details.id
    },
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
    },
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
    },
    getAverage (values) {
      let sum = null
      values.forEach((value) => {
        sum = sum + value
      })
      return [
        sum / values.length
      ]
    },
    getLastMeasurement (measurements) {
      return [
        measurements[measurements.length - 1]
      ]
    },
    getYesterdaysDate () {
      let yesterdayDate = new Date()
      yesterdayDate.setDate(yesterdayDate.getDate() - 1)
      return this.formatDate(yesterdayDate)
    },
    mapLastValues (response) {
      let values = response.map(({ measurement }) => measurement)
      let valuesArray = []
      values.forEach(value => {
        value.reverse()
        valuesArray.push(value[value.length - 1].value)
      })
      return valuesArray
    },
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
    },
    getPollutionLimit (symbol, value) {
      let limit = pollutionLimits[symbol]
      return ((value * 100) / limit).toFixed(1)
    },
    setLocation (pos) {
      if (this.userLocation.length >= 0) {
        navigator.geolocation.clearWatch(this.watcher)
      }
      this.userLocation.push(
        pos.coords.latitude,
        pos.coords.longitude
      )
    },
    zoomReset () {
      this.$refs.map.setZoom(this.zoomHolder)
      this.$refs.map.setCenter([52.25, 19.3])
      this.centerStationId = null
      this.stationDetails = null
      this.selectedStation = null
    }
  },
  watch: {
    'chartDialogVisibility' (value) {
      if (value === true) {
        setTimeout(function () { this.chartVisibility = true }
          .bind(this),
        50)
      }
    },
    'stationDetails' (value) {
      if (value !== null) {
        this.buttonVisibility = true
      } else if (this.zoom === 5 || this.zoom === 6) {
        this.buttonVisibility = false
      }
      this.barDataColllection = null
      this.lineDataCollection = null
    },
    // 'selectedStation' (value) {
    //   if (value !== null) {
    //     this.center = {
    //       lat: value.coordinates[0],
    //       lng: value.coordinates[1]
    //     }
    //     this.getStationDetails(value.id, this.stations, this.userLocation)
    //     this.centerStationId = value.id
    //     this.zoom = 10
    //   }
    //   this.$emit('closeAutocompleteDialog', false)
    //   this.selectedStation = null
    // },
    'found' (value) {
      this.center = {
        lat: value.lat,
        lng: value.lng
      }
      this.getStationDetails(value.id, this.stations, this.userLocation)
      this.centerStationId = value.id
      this.zoom = 10
    },
    'zoom' (value) {
      if (this.width < 768) {
        this.buttonVisibility = value !== 5
      } else {
        this.buttonVisibility = value !== 6
      }
    }
  },
  mounted () {
    if (this.width < 768) {
      this.zoomHolder = 5
      this.tealIconSize = [25, 25]
      this.yellowIconSize = [15, 25]
      this.$refs.map.setZoom(5)
    } else {
      this.zoomHolder = 6
    }
  }

}
</script>

<style>
  @import "~leaflet/dist/leaflet.css";
  @import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
  #map{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
  .custom-popup .leaflet-popup-content-wrapper {
    background: #B2DFDB;
    color: white;
    font-size: 16px;
    line-height: 24px;
    border-radius: 5px;
  }
</style>
