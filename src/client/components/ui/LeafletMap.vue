<template>
  <div class="custom-popup" id="map">
    <v-map
      ref="map"
      :zoom.sync="zoom"
      :center.sync="center"
      style="z-index: 0"
    >
      <v-tilelayer :url="url"
                   :attribution="attribution"></v-tilelayer>
      <l-marker
        :key="station.id"
        v-for="station in stations"
        :lat-lng="functions.getMark(station)"
        @click="functions.getStationDetails(station.id, stations)"
      >
<!--        <div class="leaflet-popup-content-wrapper">-->
<!--          <l-popup>-->
<!--            <div align="center">-->
<!--              <v-card-->
<!--                class="pa-3 white&#45;&#45;text"-->
<!--                color="#4DB6AC"-->
<!--              >-->
<!--                <strong>Location Name:</strong> {{station.stationName}}<br>-->
<!--                <v-tooltip bottom>-->
<!--                  <template v-slot:activator="{ on }">-->
<!--                    <v-btn round v-on="on" @click="openDialog(station.id)">-->
<!--                      <v-icon>mdi-chart-bar</v-icon>-->
<!--                    </v-btn>-->
<!--                  </template>-->
<!--                  <span>Show charts</span>-->
<!--                </v-tooltip>-->
<!--              </v-card>-->
<!--            </div>-->
<!--          </l-popup>-->
<!--        </div>-->
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
        <div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="functions.closestStation(stations, userLocation)" icon fab small color="teal lighten-2" v-on="on">
                <v-icon style="font-size:23px;color: white">mdi-crosshairs-gps</v-icon>
              </v-btn>
            </template>
            <span>Show closest location</span>
          </v-tooltip>
        </div>
        <div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon fab small color="teal lighten-2" v-on="on">
                <v-icon style="font-size:23px;color: white">mdi-earth</v-icon>
              </v-btn>
            </template>
            <span>Polution map</span>
           </v-tooltip>
        </div>
        <div>
          <v-tooltip v-if="buttonVisibility" bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="zoomReset" icon fab small color="teal lighten-2" v-on="on">
                <v-icon style="font-size:23px;color: white">mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>Go back</span>
          </v-tooltip>
        </div>
      </div>
    <transition name="station_card_popup">
      <div id="station_card" v-if="functions.stationDetails != null">
        <v-card
          color="teal lighten-2"
          class="pa-3 white--text"
          width="170"
        >
          <v-card-text align="center">
            <strong>{{functions.stationDetails.stationName}}</strong><br>
            {{functions.stationDetails.city}}
          </v-card-text>
        </v-card>
        <div id="sensor_panel" align="center">
          <div
            v-for="sensor in functions.stationDetails.sensors"
          >
            <v-tooltip
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn @click="functions.getSensorDetails(sensor.id)" round color="teal lighten-2"
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
              <v-btn @click="functions.stationDetails = null" icon fab small color="white" v-on="on" id="v-btn_close">
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
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from 'vue2-leaflet'
import Functions from '@/libs/helperFunctions'
import StationsService from '@/services/StationsService'

export default {
  name: 'LeafletMap',
  components: {
    'v-map': LMap,
    'v-tilelayer': LTileLayer,
    LMarker,
    LPopup,
    LIcon
  },
  props: {
    selectedStation: Object,
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
      stationsService: new StationsService()
    }
  },
  watch: {
    'selectedStation' (value) {
      this.center = {
        lat: value.coordinates[0],
        lng: value.coordinates[1]
      }
      this.functions.getStationDetails(value.id, this.stations)
      this.centerStationId = value.id
      this.zoom = 10
    },
    'functions.found' (value) {
      this.center = {
        lat: value.lat,
        lng: value.lng
      }
      this.functions.getStationDetails(value.id, this.stations)
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

  .station_card_popup-enter {
    opacity: 0;
    transform: rotateY(50deg);
  }
  .station_card_popup-enter-to {
    opacity: 1;
    transform: rotateY(0deg);
  }
  .station_card_popup-enter-active {
    transition: opacity, transform 200ms ease-out;
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
    top: 120px;
    left: 60px;
  }
  #station_input {
    width: 60%;
    position: absolute;
    top: 10px;
    left: 285px;
  }
  #close_button {
    top: -5px;
    left: 135px;
    position: absolute;
  }
  #v-btn_close {
    width: 25px;
    height: 25px;

  }
  .custom-popup .leaflet-popup-content-wrapper {
    background: #B2DFDB;
    color: white;
    font-size: 16px;
    line-height: 24px;
    border-radius: 5px;
  }
</style>
