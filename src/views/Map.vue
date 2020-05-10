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
    <div id="map-panel">
<!--      <div-->
<!--        id="image-container"-->
<!--      >-->
<!--        <v-img-->
<!--          v-else-->
<!--          :src="require('@/assets/jb-logo.png')"-->
<!--        />-->
<!--      </div>-->
      <v-img
        v-if="largeMapPanelVisibility"
        class="logo-image-large"
        :src="require('@/assets/jb-logo.png')"
      />
      <v-img
        v-else
        class="logo-image-small"
        :src="require('@/assets/jb-sygnet.png')"
      />
      <div align="center" id="view-icons">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-if="$vuetify.breakpoint.xsOnly" large color="white" v-on="on"
                   @click="$router.push('/dashboard')" icon>
              <v-icon>
                mdi-tablet-dashboard
              </v-icon>
            </v-btn>
            <v-btn v-else x-large color="white" v-on="on" @click="$router.push('/dashboard')" icon>
              <v-icon>
                mdi-tablet-dashboard
              </v-icon>
            </v-btn>
          </template>
          <span>Panel użytkownika</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn @click="test" v-if="$vuetify.breakpoint.xsOnly" large color="white" v-on="on" icon>
              <v-icon>
                search
              </v-icon>
            </v-btn>
            <v-btn @click="test" v-else x-large color="white" v-on="on" icon>
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
          <div v-if="stationDetails !== null">
            <div align="center" class="data-element">
              <v-img
                :src="require('@/assets/place-yellow.png')"
                class="icon sidebar"
              />
              <p class="icon-text-paragraph">Stacja pomiarowa</p>
              <p class="data-paragraph">{{stationDetails.stationName}}<br><span class="city-text">{{stationDetails
                  .city}}</span></p>
            </div>
            <div align="center" class="data-element">
              <v-img
                :src="require('@/assets/road-yellow.png')"
                class="icon sidebar"
              />
              <p class="icon-text-paragraph">Odległość</p>
              <p class="data-paragraph">{{stationDetails.stationDistance}}</p>
            </div>
            <div align="center" class="data-element" v-if="stationDetails.temperature !== null">
              <v-img
                :src="require('@/assets/termometer.png')"
                class="icon sidebar"
              />
              <p class="icon-text-paragraph">Temperatura</p>
              <p class="data-paragraph">{{stationDetails.temperature+' &ordm;C'}}</p>
            </div>
            <div align="center" class="data-element" v-if="stationDetails.pressure !== null">
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
                  <p class="sensor-symbol-paragraph">{{sensor.symbol}}</p>
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
import { LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet'
import StationsService from '@/services/StationsService'
import Functions from '@/libs/helperFunctions'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Map',
  data () {
    return {
      stationContentStatement: false,
      largeMapPanelVisibility: false,
      autocompleteVisibility: false,
      miniVariant: true,
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
    test () {
      if (this.largeMapPanelVisibility === false && this.stationDetails === null) {
        this.largeMapPanelVisibility = true
        setTimeout(function () { this.autocompleteVisibility = true }
            .bind(this),
          500)
        document.getElementById('map-panel').style.width = '300px'
        document.getElementById('map-panel').style.padding = '1rem'
        document.getElementById('map-panel').style.height = '40%'
      } else if (this.largeMapPanelVisibility === true && this.stationDetails === null) {
        this.autocompleteVisibility = false
        this.largeMapPanelVisibility = false
        document.getElementById('map-panel').style.height = '30%'
        document.getElementById('map-panel').style.width = '70px'
        document.getElementById('map-panel').style.padding = '0.3rem'
      } else if (this.largeMapPanelVisibility === true && this.stationDetails !== null) {
        this.autocompleteVisibility = !this.autocompleteVisibility
      }
    },
    ...mapActions('stations', ['setSelectedStationState']),
    ...mapActions('sensors', ['setApiResponseStateMap']),
    mapClick () {
      if (this.largeMapPanelVisibility === true) {
        this.autocompleteVisibility = false
        this.largeMapPanelVisibility = false
        document.getElementById('map-panel').style.height = '30%'
        document.getElementById('map-panel').style.width = '70px'
        document.getElementById('map-panel').style.padding = '0.3rem'
        document.getElementById('map-panel').style.borderRadius = '0 0 65px 0'
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
      const lastSensorsValues = this.mapLastValues(response)
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
        sensors: this.mapSensors(sensorsDetails, lastSensorsValues),
        stationDistance: this.roundStationDistance(this.functions.getDistance(station.coordinates, userLocation))
      }
      if (this.selectedStation !== null) {
        this.selectedStation = null
      }
      if (this.autocompleteVisibility === true) {
        this.autocompleteVisibility = false
      }
      this.largeMapPanelVisibility = true
      document.getElementById('map-panel').style.height = '100%'
      document.getElementById('map-panel').style.borderRadius = '0'
      document.getElementById('map-panel').style.width = '300px'
      document.getElementById('map-panel').style.padding = '1rem'
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
        document.getElementById('map-panel').style.height = '30%'
        document.getElementById('map-panel').style.width = '70px'
        document.getElementById('map-panel').style.padding = '0.3rem'
        document.getElementById('map-panel').style.borderRadius = '0 0 65px 0'
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
    zoomResetVisibility () {
      return (this.zoom !== this.zoomHolder) || this.stationId !== null
    },
    scrollableContentHeight () {
      if (this.autocompleteVisibility === true && this.stationDetails !== null) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    'stationDetails' (value) {
      if (value !== null) {
        setTimeout(function () { this.stationContentStatement = true }
            .bind(this),
          250)
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
    // 'inputVisibility' (value) {
    //   const content = document.getElementById('station-content')
    //   if (value === true) {
    //     setTimeout(function () { this.autocompleteVisibility = true }
    //         .bind(this),
    //       250)
    //     content.className = 'scrollable-content-input'
    //     document.getElementById('map-panel').style.width = '20%'
    //     document.getElementById('map-panel').style.padding = '1rem'
    //     document.getElementById('map-panel').style.height = '40%'
    //   } else {
    //     this.autocompleteVisibility = false
    //     content.className = 'scrollable-content'
    //     document.getElementById('map-panel').style.height = '30%'
    //     document.getElementById('map-panel').style.width = '5%'
    //     document.getElementById('map-panel').style.padding = '0.3rem'
    //   }
    // },
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
  // created () {
  //   bus.$on('setSelectedStation', (stationId) => {
  //   })
  // },
  mounted () {
    this.setZoom()
  }
}
</script>

<style lang="scss">
  #map-panel {
    padding: 0.3rem;
    align-content: center;
    justify-content: center;
    alignment: center;
    border-radius: 0 0 65px 0;
    background: rgba(0,77,64,.9);
    top: 0;
    left: 0;
    width: 70px;
    transition: height 0.5s, width 0.5s, border-radius 0.5s;
    height: 30%;
    position: absolute;
  }
  /*@import "~leaflet/dist/leaflet.css";*/
  /*@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";*/
</style>
