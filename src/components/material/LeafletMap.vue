<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-card
          class="pa-3"
          color="teal lighten-4"
        >
          <div class="row map">
            <l-map
              :zoom="zoom"
              :center="center"
              style="z-index: 0"
            >
              <l-tile-layer :url="url"
              :attribution="attribution"></l-tile-layer>
              <l-marker
                :key="index"
                v-for="(station, index) in allStations"
                :lat-lng="latLng(station.gegrLat, station.gegrLon)"
                @click="centerStation(station)"
              ></l-marker>
            </l-map>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'LeafletMap',
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  methods: {
    ...mapActions('stations', ['getStations']),
    latLng: (lat, lng) => {
      return L.latLng(lat, lng)
    }
  },
  computed: {
    ...mapGetters('stations', ['allStations', 'selectedStation']
    ),
    centerStation () {
      return L.latLng(this.selectedStation.gegrLat, this.selectedStation.gegrLon)
    }
  },
  created () {
    this.getStations()
  },
  data () {
    return {
      zoom: 6,
      center: L.latLng(52.25, 19.3),
      url: 'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=fc31e976df5a44d7b5164bcbb91c70b0',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      marker: L.latLng(51.754613, 19.434925)
    }
  }
//   watch: {
//   }
}
</script>

<style scoped>
.map {
  height: 75vh;
}
</style>
