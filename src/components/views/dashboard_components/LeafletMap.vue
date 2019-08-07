<template>
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
      center: L.latLng(50.413220, 19.219482),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      marker: L.latLng(47.413220, -1.219482)
    }
  }
}
</script>

<style scoped>
.map {
  height: 75vh;
}
</style>
