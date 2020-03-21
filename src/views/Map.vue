<template>
  <div class="custom-popup" id="map">
    <l-map
      @click="mapClick"
      ref="map"
      :zoom.sync="zoom"
      :center.sync="center"
      style="z-index: 0"
      :options="options"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      <l-marker
        :key="station.id"
        v-for="station in allStationsState"
        :lat-lng="getMark(station)"
        @click="getStationDetails(station.id, allStationsState, userLocationState, false)"
      >
        <l-icon
          v-if="stationId === station.id"
          :icon-url="yellowIcon"
          :icon-size="yellowIconSize"
        />
        <l-icon
          v-else
          :icon-url="tealIcon"
          :icon-size="tealIconSize"
        />
      </l-marker>
    </l-map>
    <div align="center" id="button_panel">
      <div class="my-2">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click="getStationDetails(closestStationState.id, allStationsState, userLocationState, true)" fab small color="rgba(0,77,64,.9)">
              <v-icon style="color: white">mdi-crosshairs-gps</v-icon>
            </v-btn>
          </template>
          <span>Pokaż najbliższą stację</span>
        </v-tooltip>
<!--        <v-btn @click="closestStation(stations, userLocation)" fab small color="rgba(0,77,64,.9)">-->
<!--          <v-icon style="color: white">mdi-crosshairs-gps</v-icon>-->
<!--        </v-btn>-->
      </div>
      <div class="my-2">
        <v-tooltip v-if="zoomResetVisibility" bottom>
          <template v-slot:activator="{ on }">
            <v-btn @click="zoomReset" v-on="on" fab small color="rgba(0,77,64,.9)">
              <v-icon style="font-size:23px;color: white">mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>Wróć</span>
        </v-tooltip>
<!--        <v-btn v-else-if="zoomResetVisibility" @click="zoomReset" fab small color="rgba(0,77,64,.9)">-->
<!--          <v-icon style="font-size:23px;color: white">mdi-arrow-left</v-icon>-->
<!--        </v-btn>-->
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '@/main'
import { LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet'
import StationsService from '@/services/StationsService'
import Functions from '@/libs/helperFunctions'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Map',
  data () {
    return {
      functions: new Functions(),
      zoomHolder: null,
      options: { zoomControl: false },
      zoom: 6,
      center: [
        52.25,
        19.3
      ],
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      tealIcon: require('@/assets/tealPin.png'),
      yellowIcon: require('@/assets/yellowPin.png'),
      tealIconSize: [40, 40],
      yellowIconSize: [30, 40],
      initialLocation: [59.93428, 30.335098],
      stationId: null,
      stationsService: new StationsService(),
      selectedStation: null
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon
  },
  methods: {
    ...mapActions('stations', ['setSelectedStationState']),
    mapClick () {
      this.stationId = null
      bus.$emit('resetStationDetails', null)
    },
    getMark (station) {
      return {
        lat: station.coordinates[0],
        lng: station.coordinates[1]
      }
    },
    async getStationDetails (id, stations, userLocation, extraZoom) {
      this.stationId = id
      let response = (await this.stationsService.getStation(id)).filter(({ measurement }) => measurement.length > 0)
      let stationId = id
      let station = await stations.find(({ id }) => id === stationId)
      let sensorsDetails = response.map(({ details }) => details)
      let lastSensorsValues = this.mapLastValues(response)
      if (this.zoom === 5 || this.zoom === 6) {
        this.$refs.map.mapObject.flyTo([station.coordinates[0], station.coordinates[1]], 7)
      } else {
        this.$refs.map.mapObject.flyTo([station.coordinates[0], station.coordinates[1]])
      }
      if (extraZoom) {
        this.$refs.map.mapObject.flyTo([station.coordinates[0], station.coordinates[1]], 10)
      }
      let stationDetails = {
        stationName: station.stationName,
        city: station.city,
        temperature: station.temperature,
        pressure: station.pressure,
        wind: station.wind,
        humidity: station.humidity,
        sensors: this.mapSensors(sensorsDetails, lastSensorsValues),
        stationDistance: this.roundStationDistance(this.functions.getDistance(station.coordinates, userLocation))
      }
      bus.$emit('setStationDetails', { stationDetails, response })
      if (this.selectedStationState !== null) {
        this.setSelectedStationState(null)
      }
    },
    roundStationDistance (stationDistance) {
      if (stationDistance >= 1000) {
        stationDistance = (stationDistance / 1000).toFixed(1) + ' km'
      } else {
        stationDistance = stationDistance.toFixed(0) + ' m'
      }
      return stationDistance
    },
    mapLastValues (response) {
      let values = response.map(({ measurement }) => measurement)
      let valuesArray = []
      values.forEach(value => {
        value.reverse()
        valuesArray.push(value[value.length - 1].value)
      })
      return valuesArray
    },
    mapSensors (sensorsDetails, lastSensorsValues) {
      let sensorsArray = []
      for (let i = 0; i < sensorsDetails.length && i < lastSensorsValues.length; i++) {
        let currentValue = [lastSensorsValues[i]]
        sensorsArray.push({
          id: sensorsDetails[i].id,
          name: sensorsDetails[i].param,
          symbol: sensorsDetails[i].paramTwo,
          lastValue: (lastSensorsValues[i]).toFixed(1),
          backgroundColor: this.functions.setBackgroundColor(currentValue, sensorsDetails[i].paramTwo, false)[0],
          pollutionLimit: this.functions.getPollutionLimit(sensorsDetails[i].paramTwo, (lastSensorsValues[i]).toFixed(1))
        })
      }
      return sensorsArray
    },
    zoomReset () {
      this.stationId = null
      this.$refs.map.setZoom(this.zoomHolder)
      this.$refs.map.setCenter([52.25, 19.3])
      bus.$emit('resetStationDetails', null)
      bus.$emit('resetSelectedStation', null)
      if (this.selectedStationState !== null) {
        this.setSelectedStationState(null)
      }
    },
    setZoom () {
      if (this.$vuetify.breakpoint.xsOnly) {
        this.zoom = 5
        this.zoomHolder = 5
      } else {
        this.zoom = 6
        this.zoomHolder = 6
      }
    }
  },
  computed: {
    ...mapState('stations', ['closestStationState', 'allStationsState', 'userLocationState', 'selectedStationState']),
    zoomResetVisibility () {
      return (this.zoom !== this.zoomHolder) || this.stationId !== null
    }
  },
  watch: {
    '$vuetify.breakpoint.xsOnly' (value) {
      if (value === true) {
        this.zoom = 5
        this.zoomHolder = 5
      } else {
        this.zoom = 6
        this.zoomHolder = 6
      }
    },
    selectedStationState: {
      handler: function (value) {
        if (value !== null) {
          this.getStationDetails(value.id, this.allStationsState, this.userLocationState, true)
        }
      },
      deep: true
    }
  },
  // created () {
  //   bus.$on('setSelectedStation', (stationId) => {
  //   })
  // },
  mounted () {
    this.setZoom()
  },
  beforeDestroy () {
    bus.$off()
  }
}
</script>

<style>
  /*@import "~leaflet/dist/leaflet.css";*/
  /*@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";*/
</style>
