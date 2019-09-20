<template>
  <v-container
    fill-height
    fluid
    grid-list-sm
  >
    <v-layout wrap>
      <v-flex xs12 offset-xs0 md12 offset-md0 sm12 offset-sm0 lg10 offset-lg1>
        <v-card
          class="pa-3"
          color="teal lighten-4"
        >
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
              >
                <div class="leaflet-popup-content-wrapper">
                  <l-popup :content="station.stationName"></l-popup>
                </div>
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
          </div>
        </v-card>
      </v-flex>
      <v-flex xs12 md12 sm12 lg1 offset-lg0>
        <div align="center">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="functions.closestStation(stations, userLocation)" icon fab small color="white" v-on="on">
                <v-icon>mdi-crosshairs-gps</v-icon>
              </v-btn>
            </template>
            <span>Show closest location</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon fab small color="white" v-on="on">
                <v-icon>mdi-earth</v-icon>
              </v-btn>
            </template>
            <span>Polution map</span>
          </v-tooltip>
          <v-tooltip v-if="buttonVisibility" bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="zoomReset" icon fab small color="white" v-on="on">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>Go back</span>
          </v-tooltip>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from 'vue2-leaflet'
import Functions from '@/libs/helperFunctions'

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
    stations: Array
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
      url: 'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=fc31e976df5a44d7b5164bcbb91c70b0',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      tealIcon: require('@/assets/tealPin.png'),
      yellowIcon: require('@/assets/yellowPin.png'),
      tealIconSize: [40, 40],
      yellowIconSize: [30, 40],
      initialLocation: [59.93428, 30.335098],
      userLocation: [],
      watcher: navigator.geolocation.watchPosition(this.setLocation),
      centerStationId: null,
      functions: new Functions()
    }
  },
  watch: {
    'selectedStation' (value) {
      this.center = {
        lat: value.coordinates[0],
        lng: value.coordinates[1]
      }
      this.centerStationId = value.id
      this.zoom = 10
    },
    'functions.found' (value) {
      this.center = {
        lat: value.lat,
        lng: value.lng
      }
      this.centerStationId = value.id
      this.zoom = 10
    },
    'zoom' (value) {
      this.buttonVisibility = value !== 6;
    },
  }
}
</script>

<style lang="stylus">
  @import "~leaflet/dist/leaflet.css";
  @import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

  #map {
    height: 80vh;
  }

  .custom-popup .leaflet-popup-content-wrapper {
    background: #4DB6AC;
    color: white;
    font-size: 16px;
    line-height: 24px;
    border-radius: 5px;
  }
</style>
