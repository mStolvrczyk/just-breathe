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
    <div id="map-panel" class="map-panel">
      <v-img
        @click="$router.push('/dashboard')"
        v-if="largeMapPanelVisibility"
        class="logo-image-large"
        :src="require('@/assets/jb-logo.png')"
      />
      <v-img
        @click="$router.push('/dashboard')"
        v-else
        class="logo-image-small"
        :src="require('@/assets/jb-sygnet.png')"
      />
      <div align="center" id="view-icons">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-if="$vuetify.breakpoint.xsOnly" class="my-1 mx-1" small color="white" v-on="on"
                   @click="$router.push('/dashboard')" icon>
              <v-icon>
                mdi-tablet-dashboard
              </v-icon>
            </v-btn>
            <v-btn v-else large color="white" v-on="on" @click="$router.push('/dashboard')" icon>
              <v-icon>
                mdi-tablet-dashboard
              </v-icon>
            </v-btn>
          </template>
          <span>Panel użytkownika</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn class="my-1 mx-1" @click="mapPanelAction" v-if="$vuetify.breakpoint.xsOnly" small color="white" v-on="on" icon>
              <v-icon>
                search
              </v-icon>
            </v-btn>
            <v-btn class="my-1 mx-1" @click="mapPanelAction" v-else large color="white" v-on="on" icon>
              <v-icon>
                search
              </v-icon>
            </v-btn>
          </template>
          <span>Szukaj stacji</span>
        </v-tooltip>
      </div>
      <transition name="autocomplete-popup">
        <v-autocomplete
          v-if="autocompleteVisibility"
          background-color="white"
          v-model="selectedStation"
          :items="allStationsState"
          flat
          append-icon="false"
          search="searchValue"
          hide-no-data
          item-value="id"
          item-text="stationName"
          label="Wybierz stację"
          solo
          return-object
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                Brak stacji
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-autocomplete>
      </transition>
      <transition name="popup">
        <div
          v-if="stationContentStatement"
          id="station-content"
          class="scrollable-content"
        >
          <div v-if="mainDataStatement">
            <div align="center" class="data-element">
              <v-img
                :src="require('@/assets/place-yellow.png')"
                class="icon sidebar"
              />
              <p class="icon-text-paragraph">Stacja pomiarowa</p>
              <p class="data-paragraph">{{stationDetails.stationName}}<br><span class="city-text">{{stationDetails.city}}</span></p>
            </div>
            <div align="center" class="data-element">
              <v-img
                :src="require('@/assets/road-yellow.png')"
                class="icon sidebar"
              />
              <p class="icon-text-paragraph">Odległość</p>
              <p class="data-paragraph">{{stationDetails.stationDistance}}</p>
            </div>
            <div align="center" class="data-element" v-if="temperatureStatement">
              <v-img
                :src="require('@/assets/termometer.png')"
                class="icon sidebar"
              />
              <p class="icon-text-paragraph">Temperatura</p>
              <p class="data-paragraph">{{stationDetails.temperature+' &ordm;C'}}</p>
            </div>
            <div align="center" class="data-element" v-if="pressureStatement">
              <v-img
                :src="require('@/assets/pressure.png')"
                class="icon sidebar"
              />
              <p class="icon-text-paragraph">Ciśnienie</p>
              <p class="data-paragraph">{{stationDetails.pressure+' hPa'}}</p>
            </div>
            <div align="center" class="data-element">
              <v-img
                :src="require('@/assets/fog-yellow.png')"
                class="icon sidebar"
              />
              <p class="icon-text-paragraph">Jakość powietrza</p>
              <div
                class="row sensor"
                v-for="sensor in stationDetails.sensors"
                :key="sensor.index"
              >
                <div class="column sensor">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <p v-on="on" class="sensor-symbol-paragraph">{{ sensor.symbol }}</p>
                    </template>
                    <span>{{ sensor.name }}</span>
                  </v-tooltip>
                </div>
                <div class="column sensor">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <p class="sensor-value" v-on="on" :style="{'color': sensor.backgroundColor}">{{sensor.lastPercentValue+'%'}}</p>
                    </template>
                    <span>{{sensor.lastValue+' &#181;/m'}}<sup>3</sup></span>
                  </v-tooltip>
                </div>
                <div class="column button">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn @click="fillDatacollection(sensor.id, apiResponseStateMap)" normal color="white" v-on="on" icon>
                        <v-icon>
                          mdi-dots-horizontal
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Pokaż szczegóły</span>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
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
      </div>
    </div>
  </div>
</template>
<script>
import { LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet'
import StationsService from '@/services/StationsService'
import Functions from '@/libs/sharedFunctions'
import { mapState, mapActions } from 'vuex'
import pollutionLevels from '@/libs/pollutionLevels'
export default {
  name: 'Map',
  data () {
    return {
      stationContentStatement: false,
      largeMapPanelVisibility: false,
      autocompleteVisibility: false,
      functions: new Functions(),
      zoomHolder: null,
      options: { zoomControl: false },
      zoom: 6,
      center: [
        52.25,
        19.3
      ],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<a/> contributors',
      tealIcon: require('@/assets/tealPin.png'),
      yellowIcon: require('@/assets/yellowPin.png'),
      tealIconSize: [40, 40],
      yellowIconSize: [30, 40],
      stationId: null,
      stationsService: new StationsService(),
      stationDetails: null,
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
    ...mapActions('sensors', ['setBarDataCollectionState', 'setLineDataCollectionState', 'setSensorDetailsState', 'setChartDialogVisibilityState', 'setApiResponseStateMap']),
    async fillDatacollection (id, apiResponse) {
      const sensor = apiResponse.find(sensor => sensor.details.id === id)
      const filteredMeasurements = sensor.measurement.filter(({ date }) => date >= this.functions.formatDate(new Date()) + ' 00:00:00')
      const filteredValues = filteredMeasurements.map(({ value }) => value)
      const averageMeasurement = this.functions.getAverage(filteredValues)
      const lastMeasurement = this.functions.getLastMeasurement(filteredValues)
      const barDataCollection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: sensor.details.param + ' (' + sensor.details.paramTwo + ')',
            backgroundColor: this.functions.setBackgroundColor(filteredValues, sensor.details.paramTwo, true),
            data: filteredMeasurements.map(({ value }) => value.toFixed(2))
          }
        ]
      }
      this.setBarDataCollectionState(barDataCollection)
      const lineDataCollection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: sensor.details.param + ' (' + sensor.details.paramTwo + ')',
            backgroundColor: this.functions.setBackgroundColor([averageMeasurement], sensor.details.paramTwo, true)[0],
            data: filteredMeasurements.map(({ value }) => value.toFixed(2))
          }
        ]
      }
      this.setLineDataCollectionState(lineDataCollection)
      const sensorDetails = {
        sensorId: sensor.details.id,
        averageMeasurement: {
          value: averageMeasurement.toFixed(2),
          procentValue: this.functions.getPollutionLimit(sensor.details.paramTwo, averageMeasurement),
          pollutionLevel: pollutionLevels[this.functions.setBackgroundColor([averageMeasurement], sensor.details.paramTwo, false)[0]],
          color: this.functions.setBackgroundColor([averageMeasurement], sensor.details.paramTwo, false)[0]
        },
        lastMeasurement: {
          value: lastMeasurement.toFixed(2),
          procentValue: this.functions.getPollutionLimit(sensor.details.paramTwo, lastMeasurement),
          pollutionLevel: pollutionLevels[this.functions.setBackgroundColor([lastMeasurement], sensor.details.paramTwo, false)[0]],
          color: this.functions.setBackgroundColor([lastMeasurement], sensor.details.paramTwo, false)[0]
        }
      }
      this.setSensorDetailsState(sensorDetails)
      this.setChartDialogVisibilityState(true)
    },
    mapPanelAction () {
      if (this.largeMapPanelVisibility === false && this.stationDetails === null) {
        this.largeMapPanelVisibility = true
        setTimeout(function () { this.autocompleteVisibility = true }
            .bind(this),
          600)
        document.getElementById('map-panel').className = 'map-panel large'
      } else if (this.largeMapPanelVisibility === true && this.stationDetails === null) {
        this.autocompleteVisibility = false
        this.largeMapPanelVisibility = false
        document.getElementById('map-panel').className = 'map-panel'
      } else if (this.largeMapPanelVisibility === true && this.stationDetails !== null) {
        this.autocompleteVisibility = !this.autocompleteVisibility
      }
    },
    mapClick () {
      if (this.largeMapPanelVisibility === true) {
        if (this.autocompleteVisibility === true) {
          this.autocompleteVisibility = false
        }
        this.largeMapPanelVisibility = false
        document.getElementById('map-panel').className = 'map-panel'
      }
    },
    getMark (station) {
      return {
        lat: station.coordinates[0],
        lng: station.coordinates[1]
      }
    },
    async getStationDetails (id, stations, userLocation, extraZoom) {
      this.stationId = id
      const response = (await this.stationsService.getStation(id)).filter(({ measurement }) => measurement.length > 0)
      this.setApiResponseStateMap(response)
      const stationId = id
      const station = await stations.find(({ id }) => id === stationId)
      const sensorsDetails = response.map(({ details }) => details)
      const lastSensorsValues = this.functions.mapLastValues(response)
      if (this.zoom === 5 || this.zoom === 6) {
        this.$refs.map.mapObject.flyTo([station.coordinates[0], station.coordinates[1]], 7)
      } else {
        this.$refs.map.mapObject.flyTo([station.coordinates[0], station.coordinates[1]])
      }
      if (extraZoom) {
        this.$refs.map.mapObject.flyTo([station.coordinates[0], station.coordinates[1]], 10)
      }
      this.stationDetails = {
        stationName: station.stationName,
        city: station.city,
        temperature: station.temperature,
        pressure: station.pressure,
        wind: station.wind,
        humidity: station.humidity,
        sensors: this.functions.mapSensors(sensorsDetails, lastSensorsValues),
        stationDistance: this.functions.roundStationDistance(this.functions.getDistance(station.coordinates, userLocation))
      }
      if (this.selectedStation !== null) {
        this.selectedStation = null
      }
      if (this.autocompleteVisibility === true) {
        this.autocompleteVisibility = false
      }
      this.largeMapPanelVisibility = true
      document.getElementById('map-panel').className = 'map-panel large station'
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
      const values = response.map(({ measurement }) => measurement)
      const valuesArray = []
      values.forEach(value => {
        value.reverse()
        valuesArray.push(value[value.length - 1].value)
      })
      return valuesArray
    },
    mapSensors (sensorsDetails, lastSensorsValues) {
      const sensorsArray = []
      for (let i = 0; i < sensorsDetails.length && i < lastSensorsValues.length; i++) {
        const currentValue = [lastSensorsValues[i]]
        sensorsArray.push({
          id: sensorsDetails[i].id,
          name: sensorsDetails[i].param,
          symbol: sensorsDetails[i].paramTwo,
          lastValue: (lastSensorsValues[i]).toFixed(1),
          backgroundColor: this.functions.setBackgroundColor(currentValue, sensorsDetails[i].paramTwo, false)[0],
          lastPercentValue: this.functions.getPollutionLimit(sensorsDetails[i].paramTwo, (lastSensorsValues[i]).toFixed(1))
        })
      }
      return sensorsArray
    },
    zoomReset () {
      this.stationId = null
      this.$refs.map.setZoom(this.zoomHolder)
      this.$refs.map.setCenter([52.25, 19.3])
      this.stationDetails = null
      this.selectedStation = null
      if (this.largeMapPanelVisibility === true) {
        this.autocompleteVisibility = false
        this.largeMapPanelVisibility = false
        document.getElementById('map-panel').className = 'map-panel'
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
    ...mapState('sensors', ['apiResponseStateMap']),
    mainDataStatement () {
      return this.stationDetails !== null
    },
    temperatureStatement () {
      return this.stationDetails.temperature !== null
    },
    pressureStatement () {
      return this.stationDetails.pressure !== null
    },
    zoomResetVisibility () {
      return (this.zoom !== this.zoomHolder) || this.stationId !== null
    }
  },
  watch: {
    'stationDetails' (value) {
      if (value !== null) {
        setTimeout(function () { this.stationContentStatement = true }
            .bind(this),
          600)
      } else {
        setTimeout(function () { this.stationContentStatement = false }
            .bind(this),
          250)
      }
    },
    'largeMapPanelVisibility' (value) {
      if (value === false) {
        this.stationDetails = null
      }
    },
    'scrollableContentHeight' (value) {
      if (value === true) {
        document.getElementById('station-content').className = 'scrollable-content-input'
      } else {
        document.getElementById('station-content').className = 'scrollable-content'
      }
    },
    '$vuetify.breakpoint.xsOnly' (value) {
      if (value === true) {
        this.zoom = 5
        this.zoomHolder = 5
      } else {
        this.zoom = 6
        this.zoomHolder = 6
      }
    },
    'selectedStation' (value) {
      if (value !== null) {
        this.getStationDetails(value.id, this.allStationsState, this.userLocationState, true)
      }
    }
  },
  mounted () {
    this.setZoom()
  }
}
</script>
