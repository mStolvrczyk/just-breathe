<template>
    <div id="dashboard">
    <vue-pull-refresh
      :on-refresh="onRefresh"
      :config="pullConfig"
    >
      <div id="dashboard-sidebar">
        <v-img
          class="logo-image"
          :src="require('@/assets/jb-sygnet.png')"
        />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-if="$vuetify.breakpoint.xsOnly" large color="white" v-on="on" @click="navigateTo('/map')"
                   icon>
              <v-icon>
                mdi-map-marker
              </v-icon>
            </v-btn>
            <v-btn v-else x-large color="white" v-on="on" @click="navigateTo('/map')" icon>
              <v-icon>
                mdi-map-marker
              </v-icon>
            </v-btn>
          </template>
          <span>Mapa</span>
        </v-tooltip>
      </div>
      <div class="row">
        <div id="chart">
          <v-tooltip max-width="250px" bottom>
            <template v-slot:activator="{ on }">
              <v-icon color="white" class="info-icon" v-on="on">
                mdi-information
              </v-icon>
            </template>
            <span>Wartość polskiego indeksu jakości powietrza liczona jest w oparciu o indywidualne przedziały dla
              poszczególnych zanieczyszczeń, następnie indeks ogólny przyjmuje wartość najgorszego indeksu
              indywidualnego spośród zanieczyszczeń mierzonych na tej stacji lub dominującej wartości (pył zawieszony
              lub ozon).</span>
          </v-tooltip>
          <vue-svg-gauge
            :start-angle="0"
            :end-angle="360"
            :value="closestStationState.gaugeChartData.lastPercentValue"
            :separator-step="0"
            :min="0"
            :max="100"
            :gauge-color="closestStationState.gaugeChartData.backgroundColor"
            base-color="#E0F2F1"
            :scale-interval="0"
            :innerRadius="85"
            :transitionDuration="gaugeTransitionDuration"
          >
            <div class="inner-text">
              <div class="row">
                <div class="column" v-if="closestStationState.gaugeChartData.lastPercentValue !== 0">
                  <p class="white-data-paragraph">
                    <animated-number
                      :value="closestStationState.gaugeChartData.lastPercentValue"
                      :formatValue="formatPercentValue"
                      :duration="closestStationState.gaugeChartData.lastPercentValue * 15"
                      :round="1"
                    /><br>
                    <animated-number
                      :value="closestStationState.gaugeChartData.lastValue"
                      :formatValue="formatValue"
                      :duration="closestStationState.gaugeChartData.lastValue * 15"
                      :round="1"
                    /><br>
                    {{closestStationState.gaugeChartData.symbol}}
                  </p>
                  <p class="index-level-paragraph" :style="{'color': closestStationState.gaugeChartData.backgroundColor}">
                    {{closestStationState.gaugeChartData.pollutionLevel}}</p>
                </div>
                <v-progress-circular
                  v-else
                  size="100"
                  indeterminate
                  color="#E6C136"
                  width="8"
                ></v-progress-circular>
              </div>
            </div>
          </vue-svg-gauge>
        </div>
      </div>
      <transition name="popup">
        <div class="row" v-if="dataStatement">
          <div id="data-container">
            <div class="row">
              <div align="center" class="data-element dashboard">
                <v-img
                  :src="require('@/assets/road-yellow.png')"
                  class="icon dashboard"
                />
                <p class="icon-text-paragraph">Odległość</p>
                  <p class="data-paragraph">{{closestStationState.stationDistance}}</p>
              </div>
              <div align="center" class="data-element dashboard station-name">
                <v-img
                  :src="require('@/assets/place-yellow.png')"
                  class="icon dashboard"
                />
                <p class="icon-text-paragraph">Stacja pomiarowa</p>
                <p class="data-paragraph">{{closestStationState.stationName }}<br><span class="city-text">
                  {{closestStationState.city}}</span></p>
              </div>
              <div align="center" class="data-element dashboard">
                <v-img
                  :src="require('@/assets/clock.png')"
                  class="icon dashboard"
                />
                <p class="icon-text-paragraph">Ostatni pomiar ({{closestStationState.gaugeChartData.symbol}})</p>
                <p class="data-paragraph">{{closestStationState.gaugeChartData.time}}</p>
              </div>
            </div>
            <div class="row">
              <div align="center" class="data-element">
                <v-img
                  :src="require('@/assets/fog-yellow.png')"
                  class="icon dashboard"
                />
                <p class="icon-text-paragraph">Jakość powietrza</p>
                <div class="row" v-for="sensor in closestStationState.sensors" :key="sensor.index">
                  <div class="column sensor-symbol">
                    <p class="sensor-symbol-paragraph">{{sensor.symbol}}</p>
                  </div>
                  <div class="column">
                    <vue-apex-charts type="bar" :height="horizontalChartHeight" :width="horizontalChartWidth" :options="mapHorizontalBarChartOptions(sensor)" :series="mapHorizontalBarChartSeries(sensor)"></vue-apex-charts>
                  </div>
                  <div class="column">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn @click="fillDatacollection(sensor.id, apiResponseStateDashboard)" class="details-button" normal color="white" v-on="on" icon>
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
            <div class="row" v-if="thirdRowStatement">
              <div align="center" class="data-element dashboard">
                <v-img
                  :src="require('@/assets/termometer.png')"
                  class="icon dashboard"
                />
                <p class="icon-text-paragraph">Temperatura</p>
                <p class="data-paragraph">{{closestStationState.temperature+' &ordm;C'}}</p>
              </div>
              <div align="center" class="data-element dashboard">
                <v-img
                  :src="require('@/assets/pressure.png')"
                  class="icon dashboard"
                />
                <p class="icon-text-paragraph">Ciśnienie</p>
                <p class="data-paragraph">{{closestStationState.pressure+' hPa'}}</p>
              </div>
              <div align="center" class="data-element dashboard">
                <v-img
                  :src="require('@/assets/wind.png')"
                  class="icon dashboard"
                />
                <p class="icon-text-paragraph">Prędkość wiatru</p>
                <p class="data-paragraph">{{closestStationState.wind+' km/h'}}</p>
              </div>
              <div align="center" class="data-element dashboard">
                <v-img
                  :src="require('@/assets/humidity.png')"
                  class="icon dashboard humidity"
                />
                <p class="icon-text-paragraph">Wilgotność</p>
                <p class="data-paragraph">{{closestStationState.humidity+'%'}}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
  </vue-pull-refresh>
    </div>
</template>

<script>
import { bus } from '@/main'
import VuePullRefresh from 'vue-pull-refresh'
import AnimatedNumber from 'animated-number-vue'
import { VueSvgGauge } from 'vue-svg-gauge'
import { mapActions, mapState } from 'vuex'
import HelperFunctions from '@/libs/helperFunctions'
import StationsService from '@/services/StationsService'
import VueApexCharts from 'vue-apexcharts'
import pollutionLevels from '@/libs/pollutionLevels'
export default {
  name: 'Dashboard',
  data () {
    return {
      pullConfig: {
        errorLabel: 'Wystąpił błąd',
        startLabel: 'Start',
        readyLabel: 'Gotowe',
        loadingLabel: 'Proszę czekać...'
      },
      dataStatement: false,
      functions: new HelperFunctions(),
      stationsService: new StationsService(),
      chartValue: null,
      userLocation: null,
      allStations: null,
      closestStation: null,
      chartColor: null
    }
  },
  components: {
    'vue-pull-refresh': VuePullRefresh,
    VueSvgGauge,
    AnimatedNumber,
    VueApexCharts
  },
  methods: {
    onRefresh: function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          if (navigator.onLine) {
            window.location.reload(true)
          } else {
            bus.$emit('setInformationDialog', { informationDialogVisibility: true, informationDialogText: 'Brak połączenia z internetem.' })
            resolve()
          }
        }, 1000)
      })
    },
    ...mapActions('sensors', ['setBarDataCollectionState', 'setLineDataCollectionState', 'setSensorDetailsState', 'setChartDialogVisibilityState']),
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
    mapHorizontalBarChartLimit (sensor) {
      if (sensor.lastPercentValue > 100) {
        return Math.ceil(sensor.lastPercentValue / 50) * 50
      } else {
        return 100
      }
    },
    mapHorizontalBarChartSeries (sensor) {
      return [{
        name: sensor.pollutionLevel,
        data: [sensor.lastPercentValue]
      }]
    },
    mapHorizontalBarChartOptions (sensor) {
      return {
        tooltip: {
          y: {
            formatter: (value) => { return value + '%' }
          }
        },
        colors: [sensor.backgroundColor],
        legend: {
          show: false
        },
        chart: {
          parentHeightOffset: 0,
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
          type: 'bar'
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
          categories: [sensor.symbol],
          labels: {
            style: {
              fontSize: '15px'
            }
          }
        },
        yaxis: {
          max: this.mapHorizontalBarChartLimit(sensor),
          labels: {
            show: false,
            style: {
              fontSize: '16px'
            }
          }
        }
      }
    },
    formatPercentValue (value) {
      return `<p class="percent-value-paragraph">${value + '%'}</p>`
    },
    formatValue (value) {
      return `<p class="value-paragraph">(${value + ' &#181/m'}<sup>3</sup>)</p>`
    },
    navigateTo (path) {
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    }
  },
  computed: {
    dataStatementHolder () {
      return this.closestStationState.stationDistance !== null && this.closestStationState.stationName !== null && this.closestStationState.gaugeChartData.time !== null && this.routeState === '/dashboard'
    },
    thirdRowStatement () {
      return this.closestStationState.temperature !== null || this.closestStationState.pressure !== null || this.closestStationState.wind !== null || this.closestStationState.humidity !== null
    },
    gaugeTransitionDuration () {
      if (this.closestStationState.gaugeChartData.lastPercentValue <= 100) {
        return this.closestStationState.gaugeChartData.lastPercentValue * 15
      } else {
        return 1500
      }
    },
    horizontalChartWidth () {
      if (this.$vuetify.breakpoint.xsOnly) {
        return 230
      } else {
        return 550
      }
    },
    horizontalChartHeight () {
      if (this.$vuetify.breakpoint.xsOnly) {
        return 90
      } else {
        return 100
      }
    },
    // progressCircularSize () {
    //   if (this.$vuetify.breakpoint.xsOnly) {
    //     return 100
    //   } else {
    //     return 100
    //   }
    // },
    ...mapState('stations', ['closestStationState', 'routeState']),
    ...mapState('sensors', ['apiResponseStateDashboard'])
  },
  watch: {
    'dataStatementHolder' (value) {
      if (value === true) {
        setTimeout(function () {
          this.dataStatement = true
        }
          .bind(this),
        this.closestStationState.gaugeChartData.lastPercentValue * 16)
      }
    }
  }
}
</script>

<style lang="scss">
  #dashboard {
    ::-webkit-scrollbar {
      display: none;
    }
    align-content: center;
    overflow-y: hidden;
    overflow-x: hidden;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background: linear-gradient(
        to top right,
        rgba(0,77,64,.9),
        rgba(0,77,64,.9)
    ),url(../assets/appImage.jpg)
  }
</style>
