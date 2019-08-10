<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-card
          class="pa-3"
          color="teal lighten-4"
        >
          <div class="row map">
            <l-map :zoom="zoom" :center="center" style="z-index: 0">
              <l-tile-layer :url="url"
              :attribution="attribution"></l-tile-layer>
              <l-marker :lat-lng="marker"></l-marker>
            </l-map>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
export default {
  name: 'LeafletMap',
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  data () {
    return {
      zoom: 13,
      center: L.latLng(49.719731, 18.826722),
      url: 'https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=fc31e976df5a44d7b5164bcbb91c70b0',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      marker: L.latLng(51.754613, 19.434925)
    }
  }
}
</script>

<style scoped>
.map {
  height: 75vh;
}
</style>
