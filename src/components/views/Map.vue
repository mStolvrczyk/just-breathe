<template>
  <v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <leaflet-map/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LeafletMap from './dashboard_components/LeafletMap'
export default {
  name: 'Map',
  components: { LeafletMap }
}
</script>

<style scoped>

</style>
