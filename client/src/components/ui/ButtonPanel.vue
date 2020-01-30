<template>
  <div align="center" id="button_panel">
    <div class="my-2">
      <v-tooltip v-if="width > 768" bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" @click="closestStation(stations, userLocation)" fab small color="teal lighten-1">
            <v-icon style="font-size:23px;color: white">mdi-crosshairs-gps</v-icon>
          </v-btn>
        </template>
        <span>Pokaż najbliższą stację</span>
      </v-tooltip>
      <v-btn v-else @click="closestStation(stations, userLocation)" fab small color="teal lighten-1">
        <v-icon style="font-size:23px;color: white">mdi-crosshairs-gps</v-icon>
      </v-btn>
    </div>
    <div class="my-2">
      <v-tooltip v-if="buttonVisibility && width > 768" bottom>
        <template v-slot:activator="{ on }">
          <v-btn @click="zoomReset" v-on="on" fab small color="teal lighten-1">
            <v-icon style="font-size:23px;color: white">mdi-close</v-icon>
          </v-btn>
        </template>
        <span>Wróć</span>
      </v-tooltip>
      <v-btn v-else-if="buttonVisibility" @click="zoomReset" fab small color="teal lighten-1">
        <v-icon style="font-size:23px;color: white">mdi-close</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import Functions from '../../libs/helperFunctions'

export default {
  name: 'ButtonPanel',
  data () {
    return {
      functions: new Functions()
    }
  },
  props: {
    width: Number,
    stations: Array,
    userLocation: Array,
    buttonVisibility: Boolean
  },
  methods: {
    zoomReset () {
      this.$emit('zoomReset')
    },
    closestStation (stations, userLocation) {
      let minDist = Infinity
      let nearestText = '*None*'
      let markerDist
      let stationId
      for (let i = 0; i < stations.length; i += 1) {
        markerDist = this.functions.getDistance(stations[i].coordinates.map(Number), userLocation)
        if (markerDist < minDist) {
          minDist = markerDist
          nearestText = stations[i].coordinates
          stationId = stations[i].id
        }
      }
      let found = {
        id: stationId,
        lat: nearestText[0],
        lng: nearestText[1]
      }
      this.$emit('setFound', found)
    }
  }
}
</script>

<style>
  @media only screen and (max-width: 767px) {
    #button_panel {
      position: absolute;
      bottom: 55%;
      right: 2%;
    }
  }
  @media only screen and (min-width: 768px) {
    #button_panel {
      position: absolute;
      top: 20%;
      right: 3%;
    }
  }
</style>
