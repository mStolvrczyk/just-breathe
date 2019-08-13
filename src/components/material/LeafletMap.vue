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
                v-for="(station, index) in filterStations"
                :lat-lng="latLng(station.gegrLat, station.gegrLon)"
              ></l-marker>
            </l-map>
          </div>
        </v-card>
        <div>
<!--          <div v-for="station in allStations" :key="station.id" class="todo">-->
<!--            {{station.city}}-->
<!--          </div>-->
        </div>
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
    ...mapGetters('stations', ['allStations', 'filterStations']
    )
  },
  created () {
    this.getStations()
  },
  data () {
    return {
      zoom: 10,
      center: L.latLng(49.7215300, 18.8019800),
      url: 'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=fc31e976df5a44d7b5164bcbb91c70b0',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      marker: L.latLng(51.754613, 19.434925)
    }
  },
  // mounted () {
  //   console.log(this.allStations)
  // }
}
</script>

<style scoped>
.map {
  height: 75vh;
}
</style>
