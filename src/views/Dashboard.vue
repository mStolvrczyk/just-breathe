<template>
  <div id="dashboard">
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
            indywidualnego spośród zanieczyszczeń mierzonych na tej stacji.</span>
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
              <div class="column">
                <p id="white-data-paragraph">
                  <animated-number
                    :value="closestStationState.gaugeChartData.lastPercentValue"
                    :formatValue="formatPercentValue"
                    :duration="closestStationState.gaugeChartData.lastPercentValue * 30"
                    :round="1"
                  /><br>
                  <animated-number
                    :value="closestStationState.gaugeChartData.lastValue"
                    :formatValue="formatValue"
                    :duration="closestStationState.gaugeChartData.lastValue * 30"
                    :round="1"
                  /><br>
                  {{closestStationState.gaugeChartData.symbol}}
                </p>
                <p id="index-level-paragraph" :style="{'color': closestStationState.gaugeChartData.backgroundColor}">
                  {{closestStationState.gaugeChartData.pollutionLevel}}</p>
              </div>
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
              <p class="icon-text">Odległość</p>
                <p class="distance-text">{{closestStationState.stationDistance}}</p>
            </div>
            <div align="center" class="data-element dashboard station-name">
              <v-img
                :src="require('@/assets/place-yellow.png')"
                class="icon dashboard"
              />
              <p class="icon-text">Stacja pomiarowa</p>
              <p class="station-name-text">{{closestStationState.stationName }}<br><span class="city-text">{{closestStationState.city}}</span></p>
            </div>
            <div align="center" class="data-element dashboard">
              <v-img
                :src="require('@/assets/clock.png')"
                class="icon dashboard"
              />
              <p class="icon-text">Ostatni pomiar ({{closestStationState.gaugeChartData.symbol}})</p>
              <p class="distance-text">{{closestStationState.gaugeChartData.time}}</p>
            </div>
          </div>
          <div class="row">
            <div align="center" class="data-element dashboard">
              <v-img
                :src="require('@/assets/fog-yellow.png')"
                class="icon dashboard"
              />
              <p class="icon-text">Jakość powietrza</p>
              <div class="row">
                <vue-apex-charts type="bar" height="150" width="500" :options="closestStationState.horizontalBarChartData.chartOptions" :series="closestStationState.horizontalBarChartData.series"></vue-apex-charts>
              </div>
            </div>
          </div>
<!--          <div class="row" v-if="secondRowStatement">-->
<!--            <div align="center" class="data-element dashboard">-->
<!--              <v-img-->
<!--                :src="require('@/assets/termometer.png')"-->
<!--                class="icon dashboard"-->
<!--              />-->
<!--              <p class="icon-text">Temperatura</p>-->
<!--              <p class="distance-text">{{closestStationState.temperature+' &ordm;C'}}</p>-->
<!--            </div>-->
<!--            <div align="center" class="data-element dashboard">-->
<!--              <v-img-->
<!--                :src="require('@/assets/pressure.png')"-->
<!--                class="icon dashboard"-->
<!--              />-->
<!--              <p class="icon-text">Ciśnienie</p>-->
<!--              <p class="distance-text">{{closestStationState.pressure+' hPa'}}</p>-->
<!--            </div>-->
<!--            <div align="center" class="data-element dashboard">-->
<!--              <v-img-->
<!--                :src="require('@/assets/wind.png')"-->
<!--                class="icon dashboard"-->
<!--              />-->
<!--              <p class="icon-text">Prędkość wiatru</p>-->
<!--                      <p class="distance-text">{{closestStationState.wind+' km/h'}}</p>-->
<!--            </div>-->
<!--            <div align="center" class="data-element dashboard">-->
<!--              <v-img-->
<!--                :src="require('@/assets/humidity.png')"-->
<!--                class="icon dashboard humidity"-->
<!--              />-->
<!--              <p class="icon-text">Wilgotność</p>-->
<!--                      <p class="distance-text">{{closestStationState.humidity+'%'}}</p>-->
<!--            </div>-->
<!--          </div>-->
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AnimatedNumber from 'animated-number-vue'
import { VueSvgGauge } from 'vue-svg-gauge'
import { mapState } from 'vuex'
import HelperFunctions from '@/libs/helperFunctions'
import StationsService from '@/services/StationsService'
import VueApexCharts from 'vue-apexcharts'
export default {
  name: 'Dashboard',
  data () {
    return {
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
    VueSvgGauge,
    AnimatedNumber,
    VueApexCharts
  },
  methods: {
    formatPercentValue (value) {
      return `<p id="percent-value-paragraph">${value + '%'}</p>`
    },
    formatValue (value) {
      return `<p id="value-paragraph">(${value + ' &#181/m'}<sup>3</sup>)</p>`
    },
    navigateTo (path) {
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    }
  },
  computed: {
    dataStatement () {
      return this.closestStationState.stationDistance !== null && this.closestStationState.stationName !== null && this.closestStationState.gaugeChartData.time !== null && this.routeState === '/dashboard'
    },
    secondRowStatement () {
      return this.closestStationState.temperature !== null || this.closestStationState.pressure !== null || this.closestStationState.wind !== null || this.closestStationState.humidity !== null
    },
    gaugeTransitionDuration () {
      if (this.closestStationState.gaugeChartData.lastPercentValue <= 100) {
        return this.closestStationState.gaugeChartData.lastPercentValue * 30
      } else {
        return 3000
      }
    },
    ...mapState('stations', ['closestStationState', 'routeState'])
  }
}
</script>

<style lang="scss">
  .info-icon {
    right: 0;
    position: absolute;
  }
  #data-container {
    /*display: flex;*/
    alignment: center;
    justify-content: center;
    text-align: center;
    width: 60%;
  }
  .logo-image {
    width: 55px;
    height: 55px;
  }
  #dashboard-sidebar {
    margin: 0.6rem;
    position: absolute;
  }
  .row {
    margin-right: 0;
    margin-left: 0;
    margin-bottom: 0.5rem;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    width: 100%;
    &.data-row {
    }
  }
  .column {
    flex-direction: column;
    align-content: center;
    justify-content: center;
  }
  .inner-text {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;

  }
  #white-data-paragraph {
    color: #ffff;
    text-align: center;
    line-height: 10px;
    margin-top: 0.8rem;
    margin-bottom: 2rem;
  }
  #index-level-paragraph {
    text-align: center;
    line-height: 11px;
    margin-top: 1rem;
  }
  #pollution-name-paragraph {
    margin-top: 0;
    padding: 0;
    font-family: Rubik;
    font-weight: bold;
    text-align: center;
    font-size: 20px;
    color: teal;
  }
  #percent-value-paragraph {
    font-family: Rubik;
    margin-bottom: 0;
    font-size: 30px;
    text-align: center;
    max-width: 100px;
  }
  #value-paragraph {
    font-family: Rubik;
    font-weight: normal;
    padding: 0;
    margin-top: 0;
    font-size: 15px;
  }
  #chart {
    position: relative;
    padding: 1rem;
    width: 20%;
    height: 20%;
  }
  #dashboard {
    align-content: center;
    overflow-y: auto;
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
