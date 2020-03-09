<template>
  <v-app
  >
    <v-navigation-drawer
      height="100vh"
      light
      clipped
      v-model="drawer"
      :mini-variant="miniVariant"
      :permanent="$vuetify.breakpoint.mdOnly"
      stateless
      app
      :width="navbarWidth"
      :src="require('@/assets/appImage.jpg')"
    >
      <template v-slot:img="props">
        <v-img
          :gradient="'to top right, rgba(0,77,64,.9), rgba(0,77,64,.9)'"
          v-bind="props"
        />
      </template>
      <v-container
      id="container"
      >
        <nav>
          <div
            id="image-container"
          >
            <v-img
              class="logo-image"
              v-if="miniVariant"
              :src="require('@/assets/jb-sygnet.png')"
            />
            <v-img
              v-else
              :src="require('@/assets/jb-logo.png')"
            />
          </div>
          <div align="center" id="view-icons">
            <v-tooltip bottom v-if="miniVariant">
              <template v-slot:activator="{ on }">
                <v-btn v-if="$vuetify.breakpoint.xsOnly" large color="white" v-on="on" @click="mini = !mini" icon>
                  <v-icon>
                    search
                  </v-icon>
                </v-btn>
                <v-btn v-else x-large color="white" v-on="on" @click="mini = !mini" icon>
                  <v-icon>
                    search
                  </v-icon>
                </v-btn>
              </template>
              <span>Szukaj stacji</span>
            </v-tooltip>
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
                <v-btn v-if="$vuetify.breakpoint.xsOnly" large color="white" v-on="on" @click="$router.push('/map')"
                       icon>
                  <v-icon>
                    mdi-map-marker
                  </v-icon>
                </v-btn>
                <v-btn v-else x-large color="white" v-on="on" @click="$router.push('/map')" icon>
                  <v-icon>
                    mdi-map-marker
                  </v-icon>
                </v-btn>
              </template>
              <span>Mapa</span>
            </v-tooltip>
          </div>
          <transition name="popup">
            <v-autocomplete
              v-if="!miniVariant"
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
        </nav>
        <transition name="popup">
          <div
            id="scrollable-content"
            v-if="stationDetails !== null && !miniVariant"
          >
            <div align="center" class="sidebar-element">
              <v-img
                :src="require('@/assets/place-yellow.png')"
                class="sidebar-icon"
              />
             <p class="icon-text">Stacja pomiarowa</p>
              <p class="station-name-text">{{stationDetails.stationName}}<br><span class="city-text">{{stationDetails.city}}</span></p>
            </div>
            <div align="center" class="sidebar-element">
              <v-img
              :src="require('@/assets/road-yellow.png')"
              class="sidebar-icon"
              />
              <p class="icon-text">Odległość</p>
              <p class="distance-text">{{stationDetails.stationDistance}}</p>
            </div>
            <div align="center" class="sidebar-element">
              <v-img
                :src="require('@/assets/fog-yellow.png')"
                class="sidebar-icon"
              />
              <p class="icon-text">Jakość powietrza</p>
              <div
                class="sensor-row"
                v-for="sensor in stationDetails.sensors"
                :key="sensor.index"
              >
                <div class="sensor-column">
                  <p class="sensor-symbol">{{sensor.symbol}}</p>
                </div>
                <div class="sensor-column">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <p class="sensor-value" v-on="on" :style="{'color': sensor.backgroundColor}">{{sensor.pollutionLimit+'%'}}</p>
                    </template>
                    <span>{{sensor.lastValue+' &#181/m'}}<sup>3</sup></span>
                  </v-tooltip>
                </div>
                <div class="button-column">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn @click="fillDatacollection(sensor.id, apiResponse)" normal color="white" v-on="on" icon>
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
        </transition>
      </v-container>
    </v-navigation-drawer>
    <v-content>
      <router-view/>
      <ChartDialog
        :sensorDetails="sensorDetails"
        :apiResponse="apiResponse"
        :barDataCollection="barDataCollection"
        :lineDataCollection="lineDataCollection"
        :chartDialogVisibility.sync="chartDialogVisibility"
        :chartVisibility.sync="chartVisibility"
        v-on:closeChartDialog="closeChartDialog"
        v-on:barDataComparison="barDataComparison"
        v-on:lineDataComparison="lineDataComparison"
        v-on:withoutComparison="withoutComparison"
      />
    </v-content>
  </v-app>
</template>
<script>
import ChartDialog from '@/components/ui/ChartDialog'
import { bus } from '@/main'
import { mapActions, mapState } from 'vuex'
import Functions from '@/libs/helperFunctions'
import StationsService from '@/services/StationsService'
import pollutionLevels from '@/libs/pollutionLevels'

export default {
  components: { ChartDialog },
  data () {
    return {
      searchValue: '',
      apiResponse: null,
      sensorDetails: {
        averageMeasurement: null,
        lastMeasurement: null
      },
      chartDialogVisibility: false,
      chartVisibility: false,
      barDataCollection: null,
      lineDataCollection: null,
      stationDetails: null,
      drawer: true,
      mini: true,
      stationsService: new StationsService(),
      functions: new Functions(),
      watcher: navigator.geolocation.watchPosition(this.getLocation),
      allStations: null,
      selectedStation: null
    }
  },
  methods: {
    ...mapActions('stations', ['setAllStationsState', 'setClosestStationState', 'setUserLocationState', 'setSelectedStationState']),
    async fillDatacollection (id, apiResponse) {
      let sensor = apiResponse.find(sensor => sensor.details.id === id)
      let filteredMeasurements = sensor.measurement.filter(({ date }) => date >= this.functions.formatDate(new Date()) + ' 00:00:00')
      let filteredValues = filteredMeasurements.map(({ value }) => value)
      let averageMeasurement = this.functions.getAverage(filteredValues)
      let lastMeasurement = this.getLastMeasurement(filteredValues)
      this.barDataCollection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: sensor.details.param + ' (' + sensor.details.paramTwo + ')',
            backgroundColor: this.functions.setBackgroundColor(filteredValues, sensor.details.paramTwo, true),
            data: filteredMeasurements.map(({ value }) => value.toFixed(2))
          }
        ]
      }
      this.lineDataCollection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: sensor.details.param + ' (' + sensor.details.paramTwo + ')',
            backgroundColor: this.functions.setBackgroundColor(averageMeasurement, sensor.details.paramTwo, true)[0],
            data: filteredMeasurements.map(({ value }) => value.toFixed(2))
          }
        ]
      }
      this.sensorDetails.averageMeasurement = {
        value: averageMeasurement[0].toFixed(2),
        procentValue: this.functions.getPollutionLimit(sensor.details.paramTwo, averageMeasurement[0]),
        pollutionLevel: pollutionLevels[this.functions.setBackgroundColor(averageMeasurement, sensor.details.paramTwo, false)[0]]
      }
      this.sensorDetails.lastMeasurement = {
        value: lastMeasurement[0].toFixed(2),
        procentValue: this.functions.getPollutionLimit(sensor.details.paramTwo, lastMeasurement[0]),
        pollutionLevel: pollutionLevels[this.functions.setBackgroundColor(lastMeasurement, sensor.details.paramTwo, false)[0]]
      }
      this.chartDialogVisibility = true
      this.sensorDetails.sensorId = sensor.details.id
    },
    getLastMeasurement (measurements) {
      return [
        measurements[measurements.length - 1]
      ]
    },
    async closestStation (userLocation) {
      if (this.allStations === null) {
        await this.setAllStationsState()
      }
      let minDist = Infinity
      let markerDist
      let closestStationDetails
      this.allStations.forEach(station => {
        markerDist = this.functions.getDistance(station.coordinates.map(Number), userLocation)
        if (markerDist < minDist) {
          minDist = markerDist
          closestStationDetails = station
        }
      })
      let response = (await this.stationsService.getStation(closestStationDetails.id)).filter(({ measurement }) => measurement.length > 0)
      let sensorsDetails = response.map(({ details }) => details)
      let lastSensorsValues = this.functions.mapLastValues(response)
      let closestStation = {
        id: closestStationDetails.id,
        stationName: closestStationDetails.stationName,
        city: closestStationDetails.city,
        coordinates: closestStationDetails.coordinates,
        sensors: this.functions.mapSensors(sensorsDetails, lastSensorsValues),
        stationDistance: this.functions.roundStationDistance(this.functions.getDistance(closestStationDetails.coordinates,
          userLocation))
      }
      this.setClosestStationState(closestStation)
    },
    getLocation (pos) {
      navigator.geolocation.clearWatch(this.watcher)
      let userLocation = [
        pos.coords.latitude,
        pos.coords.longitude
      ]
      this.closestStation(userLocation)
      this.setUserLocationState(userLocation)
    },
    closeChartDialog (value) {
      this.chartDialogVisibility = value
      this.chartVisibility = value
    },
    withoutComparison (value) {
      this.fillDatacollection(value, this.apiResponse)
    },
    barDataComparison (value) {
      this.barDataCollection = value
    },
    lineDataComparison (value) {
      this.lineDataCollection = value
    }
  },
  computed: {
    miniVariant () {
      return this.$vuetify.breakpoint.smAndDown && this.mini
    },
    navbarWidth () {
      if (this.$vuetify.breakpoint.xsOnly) {
        return 200
      } else {
        return 270
      }
    },
    ...mapState('stations', ['allStationsState', 'selectedStationState'])
  },
  watch: {
    'miniVariant' (value) {
      console.log(value)
    },
    'chartDialogVisibility' (value) {
      if (value === true) {
        setTimeout(function () { this.chartVisibility = true }
          .bind(this),
        50)
      }
    },
    '$vuetify.breakpoint.mdOnly' (value) {
      this.mini = !value
    },
    allStationsState: {
      handler: function (value) {
        this.allStations = value
      },
      deep: true
    },
    selectedStationState: {
      handler: function (value) {
        this.selectedStation = value
      },
      deep: true
    },
    'selectedStation' (value) {
      this.setSelectedStationState(value)
      // if (value !== null) {
      //   bus.$emit('setSelectedStation', value.id)
      // }
      // this.$nextTick(() => {
      //   this.selectedStation = null
      // })
    }
  },
  created () {
    bus.$on('setStationDetails', (data) => {
      this.stationDetails = data.stationDetails
      this.apiResponse = data.response
    })
    bus.$on('setMini', (value) => {
      this.mini = value
    })
    bus.$on('resetStationDetails', (value) => {
      this.stationDetails = value
    })
    bus.$on('resetSelectedStation', (value) => {
      this.selectedStation = value
    })
  }
}
</script>
<style lang="scss">
  @import "style";
</style>
