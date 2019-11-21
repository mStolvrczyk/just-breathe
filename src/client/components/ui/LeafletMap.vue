<template>
  <div class="custom-popup" id="map">
    <v-map
      ref="map"
      :zoom.sync="zoom"
      :center.sync="center"
      style="z-index: 0"
      :options="options"
    >
      <v-tilelayer :url="url"
                   :attribution="attribution"></v-tilelayer>
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
    </v-map>
      <div align="center" id="button_panel">
        <div class="my-2">
          <v-tooltip bottom v-if="width > 768">
            <template v-slot:activator="{ on }">
              <v-btn @click="closestStation(stations, userLocation)" fab small color="teal lighten-1" v-on="on">
                <v-icon style="font-size:23px;color: white">mdi-crosshairs-gps</v-icon>
              </v-btn>
            </template>
            <span>Pokaż najbliższą stację</span>
          </v-tooltip>
          <v-btn v-else @click="closestStation(stations, userLocation)" fab small color="teal lighten-1">
            <v-icon style="font-size:23px;color: white">mdi-crosshairs-gps</v-icon>
          </v-btn>
        </div>
        <div class="my-2">
          <v-tooltip v-if="buttonVisibility" bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="zoomReset" fab small color="teal lighten-1" v-on="on">
                <v-icon style="font-size:23px;color: white">mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>Wróć</span>
          </v-tooltip>
        </div>
      </div>
    <transition name="station_popup">
      <div id="station_card" v-if="stationDetails != null">
        <v-card
          color="teal lighten-1"
          class="pa-1"
        >
          <v-card-text align="center" class="white--text">
            <strong>{{stationDetails.stationName}}</strong><br>
            {{stationDetails.city}}<br>
            <strong>{{'odległość: '+stationDetails.stationDistance}}</strong>
          </v-card-text>
        </v-card>
        <div id="close_button">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="stationDetails = null" text fab x-small color="white" v-on="on" id="v-btn_close">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Zamknij okno</span>
          </v-tooltip>
        </div>
      </div>
    </transition>
    <transition name="station_popup">
      <div id="sensor_panel" align="center" v-if="stationDetails != null">
          <v-container
            fluid class="pa-0"
            v-for="sensor in stationDetails.sensors"
          >
            <v-row align="center" dense>
              <v-col cols="5" lg="5" xs="5">
                  <v-tooltip
                    bottom
                  >
                    <template v-slot:activator="{ on }">
                      <v-card rounded color="teal lighten-1" block
                             class="white--text" v-on="on">
                        {{sensor.symbol}}
                      </v-card>
                    </template>
                    <span>{{sensor.name}}</span>
                  </v-tooltip>
              </v-col>
              <v-col cols="5" lg="5" xs="5">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-card
                      class="white--text"
                      :style="{'background-color': sensor.backgroundColor }" v-on="on">
                          <strong>{{sensor.pollutionLimit+'%'}}</strong>
                    </v-card>
                  </template>
                    <span>{{sensor.lastValue+' &#181/m'}}<sup>3</sup></span>
                </v-tooltip>
              </v-col>
              <v-col cols="2" lg="2" xs="2">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn @click="fillDatacollection(sensor.id, apiResponse)" fab x-small color="teal lighten-1" v-on="on">
                      <v-icon style="font-size:18px;color: white">mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </template>
                  <span>Pokaż szczegóły</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
      </div>
    </transition>
    <transition name="station_popup">
      <div id="station_input" v-if="autocompleteInput">
        <v-autocomplete
          background-color="white"
          v-model="selectedStation"
          :items="stations"
          flat
          search="searchValue"
          hide-no-data
          clearable
          item-value="id"
          item-text="stationName"
          label="Wybierz stację"
          solo
          return-object
        >
          <template v-slot:no-data>
            <v-list-tile>
              <v-list-tile-title>
                Brak stacji
              </v-list-tile-title>
            </v-list-tile>
          </template>
        </v-autocomplete>
      </div>
    </transition>
    <transition name="sensor_popup">
      <div
        id="chart_card"
        v-if="barDataColllection != null && width > 768"
      >
        <v-card
          class="pa-3"
          color="teal lighten-4"
          width="600"
        >
          <div align="center">
            <v-card
              color="white"
            >
              <v-card-text
                align="center"
                v-if="barDataColllection === null"
              >
                <strong>
                  Brak pomiarów
                </strong>
              </v-card-text>
              <div v-else>
                <bar-chart
                  v-if="chartSwitch"
                  :chart-data="barDataColllection"
                  :height="170"
                />
                <line-chart
                  v-else
                  :chart-data="lineDataCollection"
                  :height="170"
                />
              </div>
            </v-card>
            <div class="text-center pa-2" v-if="barDataColllection != null">
              <v-btn-toggle rounded v-model="alignment">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn @click="chartSwitch = true" color="white" v-on="on">
                      <v-icon style="font-size:23px;color: teal">mdi-chart-bar</v-icon>
                    </v-btn>
                  </template>
                  <span>Wykres słupkowy</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn @click="chartSwitch = false" color="white" v-on="on">
                      <v-icon style="font-size:23px;color: teal">mdi-chart-bell-curve</v-icon>
                    </v-btn>
                  </template>
                  <span>Wykres liniowy</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn @click="compareWithYesterday(sensorId, apiResponse)" color="white" v-on="on">
                      <v-icon style="font-size:23px;color: teal">mdi-compare</v-icon>
                    </v-btn>
                  </template>
                  <span>Porównaj z wczoraj</span>
                </v-tooltip>
              </v-btn-toggle>
            </div>
            <v-container fluid class="pa-0" v-if="barDataColllection != null">
              <v-row align="center">
                <v-col cols="12" sm="12">
                  <div class="text-center">
                    <v-card
                      color="teal lighten-1"
                    >
                      <v-card-text class="white--text">
                        <strong>uśredniony pomiar z dziś: {{sensorDetails.averageMeasurement.procentValue + '%'}} ({{sensorDetails.averageMeasurement.value + ' &#181/m'}}<sup>3</sup>) -
                          {{sensorDetails.averageMeasurement.pollutionLevel}}</strong><br>
                        <strong>ostatni pomiar: {{sensorDetails.lastMeasurement.procentValue + '%'}}
                          ({{sensorDetails.lastMeasurement.value + ' &#181/m'}}<sup>3</sup>) -
                          {{sensorDetails.lastMeasurement.pollutionLevel}}</strong>

                      </v-card-text>
                    </v-card>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card>
      </div>
    </transition>
  <MobileChartDialog
    :sensorDetails="sensorDetails"
    :barDataCollection="barDataColllection"
    :lineDataCollection="lineDataCollection"
    :mobileDialogVisibility.sync="mobileDialogVisibility"
    v-on:closeMobileDialog="closeMobileDialog"
  />
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from 'vue2-leaflet'
import StationsService from '@/services/StationsService'
import BarChart from '@/components/vue-chartjs/BarChart'
import LineChart from '@/components/vue-chartjs/LineChart'
import pollutionLevels from '@/libs/pollutionLevels'
import pollutionLimits from '@/libs/pollutionLimits'
import MobileChartDialog from '@/components/ui/MobileChartDialog'
export default {
  name: 'LeafletMap',
  data () {
    return {
      sensorDetails: {
        sensorId: null,
        averageMeasurement: null,
        lastMeasurement: null
      },
      mobileDialogVisibility: false,
      barDataColllection: null,
      lineDataCollection: null,
      date: this.formatDate(new Date()),
      sensorId: null,
      apiResponse: null,
      found: null,
      zoomHolder: null,
      alignment: 0,
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
      searchValue: '',
      stationDetails: null,
      stationsService: new StationsService(),
      selectedStation: null,
      chartSwitch: true,
      visibility: false
    }
  },
  components: {
    MobileChartDialog,
    'v-map': LMap,
    'v-tilelayer': LTileLayer,
    LMarker,
    LPopup,
    LIcon,
    BarChart,
    LineChart
  },
  props: {
    stations: Array,
    autocompleteInput: Boolean
  },
  methods: {
    closeMobileDialog (value) {
      this.mobileDialogVisibility = value
    },
    getMark (station) {
      return {
        lat: station.coordinates[0],
        lng: station.coordinates[1]
      }
    },
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
    },
    toRadian (degree) {
      return degree * Math.PI / 180
    },
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
      let filteredMeasurements = sensor.measurement.filter(({date}) => date >= this.date + ' 00:00:00')
      let filteredValues = filteredMeasurements.map(({value}) => value)
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
      if (this.width < 768) {
        this.mobileDialogVisibility = true
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
      this.sensorDetails.sensorId = sensor.details.id
    },
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
    },
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
        ]
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
    },
    mapLastValues (response) {
      let values = response.map(({measurement}) => measurement)
      let valuesArray = []
      values.forEach(value => {
        value.reverse()
        valuesArray.push(value[value.length-1].value)
      })
      return valuesArray
    },
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
    },
    getPollutionLimit (symbol, value) {
      let limit = pollutionLimits[symbol]
      return ((value*100)/limit).toFixed(1)
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
    'center' () {
      this.stationDetails = null
    },
    'sensorId' () {
      this.alignment = 0
      this.chartSwitch = true
      if (this.width < 768) {
        this.$emit('sendVisibility', true)
      }
    },
    'stationDetails' (value) {
      if (value !== null) {
        this.buttonVisibility = true
      } else if (this.zoom === 5 || this.zoom === 6) {
        this.buttonVisibility = false
      }
      this.barDataColllection = null
      this.lineDataColllection = null
      // console.log(value)
    },
    'selectedStation' (value) {
      if (value !== null) {
        this.center = {
          lat: value.coordinates[0],
          lng: value.coordinates[1]
        }
        this.getStationDetails(value.id, this.stations, this.userLocation)
        this.centerStationId = value.id
        this.zoom = 10
      }
    },
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

  .station_popup-enter,
  .station_popup-leave-to{
    transform: rotateY(50deg);
  }
  .station_popup-enter-to,
  .station_popup-leave {
    transform: rotateY(0deg);
  }
  .station_popup-enter-active,
  .station_popup-leave-active {
    transition: transform 400ms;
  }
  .sensor_popup-enter,
  .sensor_popup-leave-to{
    opacity: 0;
  }
  .sensor_popup-enter-active,
  .sensor_popup-leave-active {
    transition: opacity .5s;
  }
  #map{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
  @media only screen and (max-width: 767px) {
    #station_input {
      width: 90%;
      position: absolute;
      top: 10px;
      text-align: center;
      left: 20px;
    }
    #button_panel {
      position: absolute;
      bottom: 58.5%;
      right: 23px;
    }
    #station_card {
      position: absolute;
      bottom: 60%;
      left: 25%;
      width: 56%;
    }
    #sensor_panel {
      position: absolute;
      top: 58%;
      left: 25%;
      width: 56%;
    }
    #close_button {
      visibility: hidden;
      top: 1%;
      right: 1%;
      position: absolute;
    }
    #details {
      width: 25px;
      height: 25px;
    }
    /*#chart_card {*/
    /*  top: 250px;*/
    /*  left: 15px;*/
    /*  width: 350px;*/
    /*  height: 10%;*/
    /*  position: absolute;*/
    /*}*/
  }
  @media only screen and (min-width: 768px) {
    #station_input {
      width: 60%;
      position: absolute;
      top: 2%;
      /*left: 285px;*/
      right: 20%;
    }
    #button_panel {
      position: absolute;
      top: 20%;
      right: 3%;
    }
    #station_card {
      position: absolute;
      bottom: 65%;
      left: 40px;
      width: 220px;
    }
    #sensor_panel {
      position: absolute;
      top: 38%;
      left: 40px;
      width: 220px;
    }
    #close_button {
      top: 1%;
      right: 1%;
      position: absolute;
    }
    #v-btn_close {
      width: 30px;
      height: 30px;

    }
    #chart_card {
      top: 15%;
      left: 20%;
      position: absolute;
    }
  }
  /*#chart_card {*/
  /*  top: 100px;*/
  /*  left: 290px;*/
  /*  position: absolute;*/
  /*}*/
  .custom-popup .leaflet-popup-content-wrapper {
    background: #B2DFDB;
    color: white;
    font-size: 16px;
    line-height: 24px;
    border-radius: 5px;
  }
</style>
