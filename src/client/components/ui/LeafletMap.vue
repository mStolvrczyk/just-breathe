<template>
  <v-container>
    <v-flex xs10 offset-xs1>
      <v-btn
      @click="closestStation()"
      />
      <v-card
        class="pa-3"
        color="teal lighten-4"
      >
        <div class="custom-popup" id="map">
                      <v-map
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
                      </v-map>
<!--          <v-map :zoom="6" :center="center">-->
<!--            <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>-->
<!--            <v-locatecontrol/>-->
<!--          </v-map>-->
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
    getMark: (station) => {
      return {
        id: station.id,
        lat: station.gegrLat,
        lng: station.gegrLon,
        color: 'blue'
      }
    },
    closestStation ()  {
      L.GeometryUtil.closestLayer(LMap, this.coordinates, this.center)
    },
    coordinatesFilter: ({gegrLat, gegrLon}) => {
      return [
        gegrLat,
        gegrLon
      ]

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
      myStation: L.latLng(52.25, 19.3),
      coordinates: [],
      stationsLoaded: false
    }
  },
  watch: {
    'selectedStation' (value) {
      this.center = {
        id: value.id,
        lat: value.gegrLat,
        lng: value.gegrLon
      }
      this.zoom = 10
    },
    'stations' (value) {
      this.coordinates.push(value.map(this.coordinatesFilter))
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
