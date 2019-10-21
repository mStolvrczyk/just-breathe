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
        :lat-lng="functions.getMark(station)"
        @click="functions.getStationDetails(station.id, stations, userLocation)"
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
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="functions.closestStation(stations, userLocation)" fab small color="teal lighten-2" v-on="on">
                <v-icon style="font-size:23px;color: white">mdi-crosshairs-gps</v-icon>
              </v-btn>
            </template>
            <span>Show closest location</span>
          </v-tooltip>
        </div>
        <div class="my-2">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn fab small color="teal lighten-2" v-on="on">
                <v-icon style="font-size:23px;color: white">mdi-earth</v-icon>
              </v-btn>
            </template>
            <span>Polution map</span>
           </v-tooltip>
        </div>
        <div class="my-2">
          <v-tooltip v-if="buttonVisibility" bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="zoomReset" fab small color="teal lighten-2" v-on="on">
                <v-icon style="font-size:23px;color: white">mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>Go back</span>
          </v-tooltip>
        </div>
      </div>
    <transition name="station_popup">
      <div id="station_card" v-if="functions.stationDetails != null">
        <v-card
          color="teal lighten-2"
          class="pa-3"
          width="170"
        >
          <v-card-text align="center" class="white--text">
            <strong>{{functions.stationDetails.stationName}}</strong><br>
            {{functions.stationDetails.city}}<br>
            <strong>{{'odległość: '+functions.stationDetails.stationDistance}}</strong>
          </v-card-text>
        </v-card>
        <div id="sensor_panel" align="center">
          <div
            class="my-2"
            v-for="sensor in functions.stationDetails.sensors"
          >
            <v-tooltip
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn @click="functions.getSensorDetails(sensor.id)" rounded color="teal lighten-2"
                       class="white--text" v-on="on">
                  {{sensor.paramTwo}}
                </v-btn>
              </template>
              <span>{{sensor.param}}</span>
            </v-tooltip>
          </div>
        </div>
        <div id="close_button">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="functions.stationDetails = null" text fab x-small color="white" v-on="on" id="v-btn_close">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Show closest location</span>
          </v-tooltip>
        </div>
      </div>
    </transition>
    <div id="station_input">
      <v-autocomplete
        background-color="teal lighten-4"
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
    <transition name="sensor_popup">
      <div
        id="chart_card"
        v-if="functions.sensorDetails != null"
      >
        <v-card
          class="pa-3"
          color="teal lighten-4"
          width="600"
        >
          <v-card
            color="white"
          >
            <v-card-text
              align="center"
              v-if="functions.sensorDetails.measurements.length === 0"
            >
              <strong>
                Brak pomiarów
              </strong>
            </v-card-text>
            <div v-else>
              <bar-chart
                v-if="chartSwitch"
                :chart-data="functions.datacollection"
                :height="170"
              />
              <line-chart
                v-else
                :chart-data="functions.datacollection"
                :height="170"
              />
            </div>
          </v-card>
          <v-btn @click="chartSwitch = false">
          </v-btn>
          <v-btn @click="chartSwitch = true">
          </v-btn>
        </v-card>
      </div>
    </transition>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from 'vue2-leaflet'
import Functions from '@/libs/helperFunctions'
import StationsService from '@/services/StationsService'
import BarChart from '@/components/vue-chartjs/BarChart'
import LineChart from '@/components/vue-chartjs/LineChart'

export default {
  name: 'LeafletMap',
  components: {
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
    visibility: Boolean
  },
  methods: {
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
      this.$refs.map.setZoom(6)
      this.$refs.map.setCenter([52.25, 19.3])
      this.centerStationId = null
      this.functions.stationDetails = null
    }
  },
  data () {
    return {
      options: {zoomControl: false},
      zoom: 6,
      center: [
        52.25,
        19.3
      ],
      buttonVisibility: false,
      url: 'https://tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=fc31e976df5a44d7b5164bcbb91c70b0',
      // url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      tealIcon: require('@/assets/tealPin.png'),
      yellowIcon: require('@/assets/yellowPin.png'),
      tealIconSize: [40, 40],
      yellowIconSize: [30, 40],
      initialLocation: [59.93428, 30.335098],
      userLocation: [],
      watcher: navigator.geolocation.watchPosition(this.setLocation),
      centerStationId: null,
      searchValue: '',
      stationDetails: null,
      sensorDetails: null,
      functions: new Functions(),
      stationsService: new StationsService(),
      selectedStation: null,
      chartSwitch: true
    }
  },
  watch: {
    'functions.sensorDetails' (value) {
      console.log(value)
    },
    'functions.stationDetails' () {
      this.functions.sensorDetails = null
    },
    'selectedStation' (value) {
      this.center = {
        lat: value.coordinates[0],
        lng: value.coordinates[1]
      }
      this.functions.getStationDetails(value.id, this.stations, this.userLocation)
      this.centerStationId = value.id
      this.zoom = 10
    },
    'functions.found' (value) {
      this.center = {
        lat: value.lat,
        lng: value.lng
      }
      this.functions.getStationDetails(value.id, this.stations, this.userLocation)
      this.centerStationId = value.id
      this.zoom = 10
    },
    'zoom' (value) {
      this.buttonVisibility = value !== 6;
    },
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
  #button_panel {
    position: absolute;
    top: 120px;
    right: 30px;
  }
  #station_card {
    position: absolute;
    top: 100px;
    left: 60px;
  }
  #station_input {
    width: 60%;
    position: absolute;
    top: 10px;
    left: 285px;
  }
  #close_button {
    top: 3px;
    left: 137px;
    position: absolute;
  }
  #v-btn_close {
    width: 25px;
    height: 25px;

  }
  #chart_card {
    top: 160px;
    left: 260px;
    position: absolute;
  }
  .custom-popup .leaflet-popup-content-wrapper {
    background: #B2DFDB;
    color: white;
    font-size: 16px;
    line-height: 24px;
    border-radius: 5px;
  }
</style>
