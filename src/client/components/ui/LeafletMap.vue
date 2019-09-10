<template>
  <v-container>
    <v-flex xs10 offset-xs1>
      <v-btn
        @click="closestStation"
      />
      <v-card
        class="pa-3"
        color="teal lighten-4"
      >
        <div class="custom-popup" id="map">
          <v-map
            ref="map"
            :zoom.sync="zoom"
            :center="center"
            style="z-index: 0"
          >
            <v-tilelayer :url="url"
                         :attribution="attribution"></v-tilelayer>
            <v-locatecontrol/>
            <l-marker
              :key="station.id"
              v-for="station in stations"
              :lat-lng="getMark(station)"
            >
              <div class="leaflet-popup-content-wrapper">
                <l-popup :content="station.stationName"></l-popup>
              </div>
              <l-icon
                v-if="center.id === station.id"
                :icon-url="yellowIcon"
                :icon-size="yellowIconSize"
              ></l-icon>
              <l-icon
                v-else
                :icon-url="tealIcon"
                :icon-size="tealIconSize"
              ></l-icon>
            </l-marker>
<!--            <l-marker-->
<!--              v-if="found"-->
<!--              :lat-lng="found"-->
<!--            >-->
<!--            </l-marker>-->
          </v-map>
        </div>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from 'vue2-leaflet'
import Vue2LeafletLocatecontrol from '@/components/leaflet/Vue2LeafletLocatecontrol'

export default {
  name: 'LeafletMap',
  components: {
    'v-map': LMap,
    'v-tilelayer': LTileLayer,
    LMarker,
    LPopup,
    LIcon,
    'v-locatecontrol': Vue2LeafletLocatecontrol
  },
  props: {
    selectedStation: Object,
    stations: Array
  },
  methods: {
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
    getMark: (station) => {
      return {
        id: station.id,
        lat: station.coordinates[0],
        lng: station.coordinates[1],
        color: 'blue'
      }
    },
    closestStation () {
      let minDist = Infinity
      let nearest_text = '*None*'
      let markerDist
      let stationId
      // get all objects added to the map
      let objects = Object.values(this.$refs.map.mapObject._layers)
      // iterate over objects and calculate distance between them
      for (let i = 0; i < this.stations.length; i += 1) {
        markerDist = this.getDistance(this.stations[i].coordinates.map(Number), this.userLocation)
        if (markerDist < minDist) {
          minDist = markerDist
          // eslint-disable-next-line camelcase
          nearest_text = this.stations[i].coordinates
          stationId = this.stations[i].id
        }
      }

      this.found = {
        id: stationId,
        lat: nearest_text[0],
        lng: nearest_text[1]
      }
    },
    setLocation (pos) {
      if(this.userLocation.length >= 0) {
        navigator.geolocation.clearWatch(this.watcher)
      }
      this.userLocation.push(
        pos.coords.latitude,
        pos.coords.longitude
      )
    }
  },
  data () {
    return {
      zoom: 6,
      center: [
        52.25,
        19.3
      ],
      url: 'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=fc31e976df5a44d7b5164bcbb91c70b0',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      tealIcon: require('@/assets/tealPin.png'),
      yellowIcon: require('@/assets/yellowPin.png'),
      tealIconSize: [40, 40],
      yellowIconSize: [30, 40],
      initialLocation: [59.93428, 30.335098],
      userLocation: [],
      watcher: navigator.geolocation.watchPosition(this.setLocation),
      found: null
    }
  },
  watch: {
    'selectedStation' (value) {
      this.center = {
        id: value.id,
        lat: value.coordinates[0],
        lng: value.coordinates[1]
      }
      this.zoom = 10
    },
    'found' (value) {
      this.center = {
        id: value.id,
        lat: value.lat,
        lng: value.lng
      }
      this.zoom = 10
    }
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
