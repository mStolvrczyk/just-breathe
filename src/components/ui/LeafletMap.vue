<template>
  <div class="custom-popup" id="map">
    <l-map
      @click="hideStation"
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
<!--    <StationInput-->
<!--    :stations="stations"-->
<!--    v-on:setSelectedStation="setSelectedStation"-->
<!--    :stationInputVisibility="stationInputVisibility"-->
<!--    />-->
    <ButtonPanel
    :stations="stations"
    :width:="width"
    :userLocation="userLocation"
    :buttonVisibility="buttonVisibility"
    v-on:zoomReset="zoomReset"
    v-on:setFound="setFound"
    />
    <StationCard
      :stationDetails="stationDetails"
      v-on:closeStationCard="closeStationCard"
    />
    <SensorPanel
    :stationDetails="stationDetails"
    :apiResponse="apiResponse"
    />
  </div>
</template>

<script>
import { bus } from '@/main'
import { LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet'
import StationsService from '@/services/StationsService'
import Functions from '@/libs/helperFunctions'
import StationInput from '@/components/ui/StationInput'
import ButtonPanel from '@/components/ui/ButtonPanel'
import StationCard from '@/components/ui/StationCard'
import SensorPanel from '@/components/ui/SensorPanel'
export default {
  name: 'LeafletMap',
  data () {
    return {
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
      width: document.documentElement.clientWidth,
      userLocation: [],
      watcher: navigator.geolocation.watchPosition(this.setLocation),
      stationId: null,
      stationDetails: null,
      stationsService: new StationsService(),
      selectedStation: null
    }
  },
  components: {
    StationInput,
    ButtonPanel,
    StationCard,
    SensorPanel,
    LMap,
    LTileLayer,
    LMarker,
    LIcon
  },
  props: {
    stations: Array,
    stationInputVisibility: Boolean
  },
  methods: {
    closeStationCard (value) {
      this.stationDetails = value
    },
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
    hideStation () {
      this.stationDetails = null
      this.$emit('closeStationInput', false)
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
      console.log(station)
      let sensorsDetails = response.map(({ details }) => details)
      let lastSensorsValues = this.mapLastValues(response)
      this.center = {
        lat: station.coordinates[0],
        lng: station.coordinates[1]
      }
      this.stationDetails = {
        stationName: station.stationName,
        city: station.city,
        sensors: this.mapSensors(sensorsDetails, lastSensorsValues),
        stationDistance: this.roundStationDistance(this.functions.getDistance(station.coordinates, userLocation))
      }
      bus.$emit('setStationDetails', this.stationDetails)
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
      this.$refs.map.setZoom(this.zoomHolder)
      this.$refs.map.setCenter([52.25, 19.3])
      this.centerStationId = null
      this.stationDetails = null
      this.selectedStation = null
      this.$emit('closeStationInput', false)
    }
  },
  watch: {
    'stationDetails' (value) {
      if (value === null) {
        this.stationId = null
      }
      if (value !== null) {
        this.buttonVisibility = true
      }
      if (this.zoom === 5 || this.zoom === 6) {
        this.buttonVisibility = false
      }
    },
    'found' (value) {
      this.center = {
        lat: value.lat,
        lng: value.lng
      }
      this.getStationDetails(value.id, this.stations, this.userLocation)
      this.stationId = value.id
      this.zoom = 10
    },
    'zoom' (value) {
      if (this.width < 768) {
        this.buttonVisibility = value !== 5
      } else {
        this.buttonVisibility = value !== 6
      }
    }
  },
  mounted () {
    if (this.width < 768) {
      this.zoomHolder = 5
      this.tealIconSize = [25, 25]
      this.yellowIconSize = [15, 25]
      this.$refs.map.setZoom(5)
    } else {
      this.zoomHolder = 6
    }
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
