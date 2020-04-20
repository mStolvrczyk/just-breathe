<template>
  <v-app
  >
    <vue-pull-refresh :on-refresh="onRefresh"></vue-pull-refresh>
    <v-navigation-drawer
      height="100vh"
      light
      clipped
      v-model="drawer"
      :mini-variant="miniVariant"
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
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-if="$vuetify.breakpoint.xsOnly" large color="white" v-on="on"
                       @click="navigateTo('/dashboard')" icon>
                  <v-icon>
                    mdi-tablet-dashboard
                  </v-icon>
                </v-btn>
                <v-btn v-else x-large color="white" v-on="on" @click="navigateTo('/dashboard')" icon>
                  <v-icon>
                    mdi-tablet-dashboard
                  </v-icon>
                </v-btn>
              </template>
              <span>Panel użytkownika</span>
            </v-tooltip>
<!--            <v-tooltip bottom>-->
<!--              <template v-slot:activator="{ on }">-->
<!--                <v-btn v-if="$vuetify.breakpoint.xsOnly" large color="white" v-on="on" @click="navigateTo('/map')"-->
<!--                       icon>-->
<!--                  <v-icon>-->
<!--                    mdi-map-marker-->
<!--                  </v-icon>-->
<!--                </v-btn>-->
<!--                <v-btn v-else x-large color="white" v-on="on" @click="navigateTo('/map')" icon>-->
<!--                  <v-icon>-->
<!--                    mdi-map-marker-->
<!--                  </v-icon>-->
<!--                </v-btn>-->
<!--              </template>-->
<!--              <span>Mapa</span>-->
<!--            </v-tooltip>-->
<!--            <v-tooltip bottom>-->
<!--              <template v-slot:activator="{ on }">-->
<!--                <v-btn v-if="$vuetify.breakpoint.xsOnly" large color="white" v-on="on"-->
<!--                       @click="$router.push('/dashboard')" icon>-->
<!--                  <v-icon>-->
<!--                    mdi-tablet-dashboard-->
<!--                  </v-icon>-->
<!--                </v-btn>-->
<!--                <v-btn v-else x-large color="white" v-on="on" @click="$router.push('/dashboard')" icon>-->
<!--                  <v-icon>-->
<!--                    mdi-tablet-dashboard-->
<!--                  </v-icon>-->
<!--                </v-btn>-->
<!--              </template>-->
<!--              <span>Panel użytkownika</span>-->
<!--            </v-tooltip>-->
<!--            <v-tooltip bottom>-->
<!--              <template v-slot:activator="{ on }">-->
<!--                <v-btn v-if="$vuetify.breakpoint.xsOnly" large color="white" v-on="on" @click="$router.push('/map')"-->
<!--                       icon>-->
<!--                  <v-icon>-->
<!--                    mdi-map-marker-->
<!--                  </v-icon>-->
<!--                </v-btn>-->
<!--                <v-btn v-else x-large color="white" v-on="on" @click="$router.push('/map')" icon>-->
<!--                  <v-icon>-->
<!--                    mdi-map-marker-->
<!--                  </v-icon>-->
<!--                </v-btn>-->
<!--              </template>-->
<!--              <span>Mapa</span>-->
<!--            </v-tooltip>-->
            <v-tooltip bottom v-if=" $route.path === '/map'">
              <template v-slot:activator="{ on }">
                <v-btn v-if="$vuetify.breakpoint.xsOnly" large color="white" v-on="on" @click="setStationInput" icon>
                  <v-icon>
                    search
                  </v-icon>
                </v-btn>
                <v-btn v-else x-large color="white" v-on="on" @click="setStationInput" icon>
                  <v-icon>
                    search
                  </v-icon>
                </v-btn>
              </template>
              <span>Szukaj stacji</span>
            </v-tooltip>
          </div>
          <transition name="popup">
            <v-autocomplete
              v-if="inputVisibility && $route.path === '/map'"
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
            id="station-content"
            class="scrollable-content"
          >
            <div v-if="stationDetails !== null && !miniVariant">
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
      </v-container>
    </v-navigation-drawer>
    <v-content>
      <router-view/>
      <ChartDialog/>
<!--        :sensorDetails="sensorDetails"-->
<!--        :apiResponse="apiResponse"-->
<!--        :barDataCollection="barDataCollection"-->
<!--        :lineDataCollection="lineDataCollection"-->
<!--        :chartDialogVisibility.sync="chartDialogVisibility"-->
<!--        :chartVisibility.sync="chartVisibility"-->
<!--        v-on:closeChartDialog="closeChartDialog"-->
<!--        v-on:barDataComparison="barDataComparison"-->
<!--        v-on:lineDataComparison="lineDataComparison"-->
<!--        v-on:withoutComparison="withoutComparison"-->
    </v-content>
  </v-app>
</template>
<script>
  import VuePullRefresh from 'vue-pull-refresh'
import ChartDialog from '@/components/ui/ChartDialog'
import { bus } from '@/main'
import { mapActions, mapState } from 'vuex'
import Functions from '@/libs/helperFunctions'
import StationsService from '@/services/StationsService'
import pollutionLevels from '@/libs/pollutionLevels'
import pollutionLevelsSort from '@/libs/pollutionLevelsSort'
import pollutionLevelsSortReversed from '@/libs/pollutionLevelsSortReversed'

export default {
  components: { ChartDialog, 'vue-pull-refresh': VuePullRefresh },
  template: '<vue-pull-refresh :on-refresh="onRefresh"></vue-pull-refresh>',
  data () {
    return {
      drawer: false,
      inputVisibility: false,
      searchValue: '',
      apiResponse: null,
      sensorDetails: {
        sensorId: null,
        averageMeasurement: null,
        lastMeasurement: null
      },
      chartDialogVisibility: false,
      chartVisibility: false,
      barDataCollection: null,
      lineDataCollection: null,
      stationDetails: null,
      stationsService: new StationsService(),
      functions: new Functions(),
      watcher: navigator.geolocation.watchPosition(this.getLocation, this.handleError, {
        enableHighAccuracy: true,
        maximumAge: 0
      }),
      allStations: null,
      selectedStation: null
    }
  },
  methods: {
    onRefresh: function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve()
        }, 1000)
      })
    },
    navigateTo (path) {
      if (this.$route.path !== path) {
        this.drawer = false
        setTimeout(function () {
          this.$router.push(path)
        }
          .bind(this),
        150)
      }
    },
    ...mapActions('stations', ['setAllStationsState', 'setClosestStationState', 'setUserLocationState', 'setSelectedStationState', 'setRouteState']),
    ...mapActions('sensors', ['setBarDataCollectionState', 'setLineDataCollectionState', 'setSensorDetailsState', 'setChartDialogVisibilityState', 'setApiResponseStateDashboard']),
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
    setStationInput () {
      this.inputVisibility = !this.inputVisibility
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
      // this.allStations.forEach(station => {
      //   if (station.id === 10158) {
      //     closestStationDetails = station
      //   }
      // })
      const response = (await this.stationsService.getStation(closestStationDetails.id)).filter(({ measurement }) => measurement.length > 0)
      this.setApiResponseStateDashboard(response)
      const sensorsDetails = response.map(({ details }) => details)
      const lastSensorsValues = this.functions.mapLastValues(response)
      const closestStation = {
        response: response,
        id: closestStationDetails.id,
        stationName: closestStationDetails.stationName,
        city: closestStationDetails.city,
        temperature: closestStationDetails.temperature,
        pressure: closestStationDetails.pressure,
        wind: closestStationDetails.wind,
        humidity: closestStationDetails.humidity,
        sensors: this.functions.mapSensors(sensorsDetails, lastSensorsValues),
        gaugeChartData: this.mapGaugeChartData(this.functions.mapSensors(sensorsDetails, lastSensorsValues)),
        horizontalBarChartData: this.mapHorizontalBarChartData(this.functions.mapSensors(sensorsDetails, lastSensorsValues)),
        stationDistance: this.functions.roundStationDistance(this.functions.getDistance(closestStationDetails.coordinates,
          userLocation))
      }
      this.setClosestStationState(closestStation)
    },
    getLocation (pos) {
      const userLocation = [
        pos.coords.latitude,
        pos.coords.longitude
      ]
      this.closestStation(userLocation)
      this.setUserLocationState(userLocation)
      navigator.geolocation.clearWatch(this.watcher)
    },
    mapHorizontalBarChartLimit (sensors) {
      const lastPercentValuesArray = sensors.map((sensor) => {
        return sensor.lastPercentValue
      })
      const highestPercentValue = lastPercentValuesArray.reduce((prev, current) => (prev > current) ? prev : current)
      // lastPercentValuesArray.sort(function (a, b) {
      //   return a - b
      // })
      if (highestPercentValue > 100) {
        return Math.ceil(highestPercentValue / 50) * 50
      } else {
        return 100
      }
    },
    mapHorizontalBarChartData (sensors) {
      return {
        series: [{
          name: 'Ostatni pomiar',
          data: sensors.map(({ lastPercentValue }) => lastPercentValue)
        }],
        chartOptions: {
          tooltip: {
            y: {
              formatter: (value) => { return value + '%' }
            }
          },
          colors: sensors.map(({ backgroundColor }) => backgroundColor),
          legend: {
            show: false
          },
          chart: {
            events: {
              click: function (event, chartContext, config) {
                console.log(config)
                console.log(config.seriesIndex)
                console.log(config.dataPointIndex)
              }
            },
            foreSize: 15,
            foreColor: '#fff',
            toolbar: {
              show: false
            },
            type: 'bar',
            height: 150
          },
          plotOptions: {
            bar: {
              horizontal: true,
              distributed: true
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: sensors.map(({ symbol }) => symbol),
            labels: {
              style: {
                fontSize: '15px'
              }
            }
          },
          yaxis: {
            max: this.mapHorizontalBarChartLimit(sensors),
            labels: {
              style: {
                fontSize: '16px'
              }
            }
          }
        },
        symbols: sensors.map(({ symbol }) => symbol),
        values: sensors.map(({ pollutionLimit }) => pollutionLimit),
        backgroundColor: sensors.map(({ backgroundColor }) => backgroundColor)
      }
    },
    mapGaugeChartData (sensors) {
      const sensorsTable = sensors.map((sensor) => {
        return pollutionLevelsSort[sensor.pollutionLevel]
      })
      const worstPollutionLevelSensor = sensorsTable.reduce((prev, current) => (prev > current) ? prev : current)
      // sensorsTable.sort(function (a, b) {
      //   return a - b
      // })
      const worstPollutionLevelSensors = sensors.filter(({ pollutionLevel }) => pollutionLevel === pollutionLevelsSortReversed[worstPollutionLevelSensor])
      if (worstPollutionLevelSensors.includes(worstPollutionLevelSensors.find(({ symbol }) => symbol === 'PM10'))) {
        return worstPollutionLevelSensors.find(({ symbol }) => symbol === 'PM10')
      } else if (worstPollutionLevelSensors.includes(worstPollutionLevelSensors.find(({ symbol }) => symbol === 'PM2.5'))) {
        return worstPollutionLevelSensors.find(({ symbol }) => symbol === 'PM2.5')
      } else if (worstPollutionLevelSensors.includes(worstPollutionLevelSensors.find(({ symbol }) => symbol === 'O3'))) {
        return worstPollutionLevelSensors.find(({ symbol }) => symbol === 'O3')
      } else {
        return worstPollutionLevelSensors[Math.floor(Math.random() * worstPollutionLevelSensors.length)]
      }
    },
    handleError (error) {
      switch (error.code) {
        case 1:
          alert('permission denied')
          break
        case 2:
          alert('position unavailable')
          break
        case 3:
          alert('timeout')
          break
        default:
          alert('unknown error')
          break
      }
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
      return this.stationDetails === null && this.inputVisibility === false
    },
    navbarWidth () {
      if (this.$vuetify.breakpoint.xsOnly) {
        return 200
      } else {
        return 270
      }
    },
    ...mapState('stations', ['allStationsState', 'selectedStationState', 'userLocationState']),
    ...mapState('sensors', ['apiResponseStateMap'])
  },
  watch: {
    '$route.path' (value) {
      setTimeout(function () { this.setRouteState(value) }
        .bind(this),
      250)
      if (value === '/map') {
        this.drawer = true
      } else {
        this.stationDetails = null
      }
    },
    'inputVisibility' (value) {
      const content = document.getElementById('station-content')
      if (value === true) {
        content.className = 'scrollable-content-input'
      } else {
        content.className = 'scrollable-content'
      }
    },
    'chartDialogVisibility' (value) {
      if (value === true) {
        setTimeout(function () { this.chartVisibility = true }
          .bind(this),
        50)
      }
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
        setTimeout(function () { this.inputVisibility = false }
          .bind(this),
        50)
      },
      deep: true
    },
    'selectedStation' (value) {
      this.setSelectedStationState(value)
    }
  },
  beforeMount () {
    bus.$on('setStationDetails', (data) => {
      this.stationDetails = data
    })
    // bus.$on('setMini', (value) => {
    //   this.mini = value
    // })
    bus.$on('resetStationDetails', (value) => {
      this.stationDetails = value
    })
    bus.$on('resetSelectedStation', (value) => {
      this.selectedStation = value
    })
  },
  mounted () {
    this.setAllStationsState()
    this.$nextTick(function () {
      window.setInterval(() => {
        this.closestStation(this.userLocationState)
      }, 900000)
    })
  }
}
</script>
<style lang="scss">
  @import "style";
</style>
