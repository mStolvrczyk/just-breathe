<template>
  <div class="custom-popup" id="map">
    <l-map
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
        v-for="station in stations"
        :lat-lng="getMark(station)"
        @click="getStationDetails(station.id, stations, userLocation), stationId = station.id"
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
    <ButtonPanel
      :stations="stations"
      :userLocation="userLocation"
      :zoomResetVisibility="zoomResetVisibility"
      v-on:zoomReset="zoomReset"
      v-on:setFound="setFound"
    />
  </div>
</template>
<script>
import { bus } from '@/main'
import { LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet'
import StationsService from '@/services/StationsService'
import Functions from '@/libs/helperFunctions'
import ButtonPanel from '@/components/ui/ButtonPanel'
export default {
  name: 'Map',
  data () {
    return {
      stations: null,
      functions: new Functions(),
      apiResponse: null,
      found: null,
      zoomHolder: null,
      options: { zoomControl: false },
      zoom: 6,
      center: [
        52.25,
        19.3
      ],
      buttonVisibility: false,
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      tealIcon: require('@/assets/tealPin.png'),
      yellowIcon: require('@/assets/yellowPin.png'),
      tealIconSize: [40, 40],
      yellowIconSize: [30, 40],
      initialLocation: [59.93428, 30.335098],
      userLocation: [],
      watcher: navigator.geolocation.watchPosition(this.setLocation),
      stationId: null,
      stationDetails: null,
      stationsService: new StationsService(),
      selectedStation: null
    }
  },
  components: {
    ButtonPanel,
    LMap,
    LTileLayer,
    LMarker,
    LIcon
  },
  methods: {
    setSelectedStation (value) {
      if (value !== null) {
        this.center = {
          lat: value.coordinates[0],
          lng: value.coordinates[1]
        }
        this.getStationDetails(value.id, this.stations, this.userLocation)
        this.zoom = 10
        this.stationId = value.id
      }
      this.$emit('closeStationInput', false)
      this.selectedStation = null
    },
    setFound (value) {
      this.found = value
    },
    getMark (station) {
      return {
        lat: station.coordinates[0],
        lng: station.coordinates[1]
      }
    },
    async getStationDetails (id, stations, userLocation) {
      let response = (await this.stationsService.getStation(id)).filter(({ measurement }) => measurement.length > 0)
      this.apiResponse = response
      let stationId = id
      let station = await stations.find(({ id }) => id === stationId)
      let sensorsDetails = response.map(({ details }) => details)
      let lastSensorsValues = this.mapLastValues(response)
      this.$refs.map.mapObject.flyTo([station.coordinates[0], station.coordinates[1]], 7)
      this.stationDetails = {
        stationName: station.stationName,
        city: station.city,
        sensors: this.mapSensors(sensorsDetails, lastSensorsValues),
        stationDistance: this.roundStationDistance(this.functions.getDistance(station.coordinates, userLocation))
      }
      bus.$emit('setStationDetails', this.stationDetails)
      bus.$emit('setMini', false)
    },
    roundStationDistance (stationDistance) {
      if (stationDistance >= 1000) {
        stationDistance = (stationDistance / 1000).toFixed(1) + 'km'
      } else {
        stationDistance = stationDistance.toFixed(0) + 'm'
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
      this.stationId = null
      this.$refs.map.setZoom(this.zoomHolder)
      this.$refs.map.setCenter([52.25, 19.3])
      bus.$emit('setStationDetails', null)
      bus.$emit('setMini', true)
    },
    async getAllStations () {
      this.stations = await this.stationsService.getAll()
    }
  },
  computed: {
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
    'stationDetails' (value) {
      if (value === null) {
        this.stationId = null
      }
      // if (value !== null) {
      //   this.buttonVisibility = true
      // }
      // if (this.zoom === 5 || this.zoom === 6) {
      //   this.buttonVisibility = false
      // }
    },
    'found' (value) {
      this.center = {
        lat: value.lat,
        lng: value.lng
      }
      this.getStationDetails(value.id, this.stations, this.userLocation)
      this.stationId = value.id
      this.zoom = 10
    }
  },
  mounted () {
    this.getAllStations()
  }
}
</script>

<style>
  @import "~leaflet/dist/leaflet.css";
  @import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
  #map{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
  .custom-popup .leaflet-popup-content-wrapper {
    background: #B2DFDB;
    color: white;
    font-size: 16px;
    line-height: 24px;
    border-radius: 5px;
  }
</style>

  // methods: {
  //   closeStationInput (value) {
  //     this.$emit('closeStationInput', value)
  //   },
  //   closeUserPanel (value) {
  //     this.$emit('closeUserPanel', value)
  //   }
  // },
