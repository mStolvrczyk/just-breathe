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
        <vue-svg-gauge
          :start-angle="0"
          :end-angle="360"
          :value="closestStationState.chartData.percentValue"
          :separator-step="0"
          :min="0"
          :max="100"
          :gauge-color="closestStationState.chartData.backgroundColor"
          base-color="#E0F2F1"
          :scale-interval="0"
          :innerRadius="85"
          :transitionDuration="gaugeTransitionDuration"
        >
          <div class="inner-text">
            <p>
              <animated-number
                :value="closestStationState.chartData.percentValue"
                :formatValue="formatPercentValue"
                :duration="closestStationState.chartData.percentValue * 30"
                :round="1"
              /><br>
              <animated-number
                :value="closestStationState.chartData.value"
                :formatValue="formatValue"
                :duration="closestStationState.chartData.value * 30"
                :round="1"
              /><br>
              {{closestStationState.chartData.symbol}}
            </p>
          </div>
        </vue-svg-gauge>
      </div>
    </div>
    <div class="row">
      <div id="data-container">
        <div class="row">
          <div align="center" class="data-element dashboard left">
            <v-img
              :src="require('@/assets/place-yellow.png')"
              class="icon dashboard"
            />
            <p class="icon-text">Stacja pomiarowa</p>
            <!--        <p class="distance-text">{{stationDetails.stationDistance}}</p>-->
          </div>
          <div align="center" class="data-element dashboard right">
            <v-img
              :src="require('@/assets/road-yellow.png')"
              class="icon dashboard"
            />
            <p class="icon-text">Odległość</p>
            <!--        <p class="distance-text">{{stationDetails.stationDistance}}</p>-->
          </div>
        </div>
        <div class="row">
          <div align="center" class="data-element dashboard">
            <v-img
              :src="require('@/assets/termometer.png')"
              class="icon dashboard"
            />
            <p class="icon-text">Temperatura</p>
            <!--        <p class="distance-text">{{stationDetails.stationDistance}}</p>-->
          </div>
          <div align="center" class="data-element dashboard">
            <v-img
              :src="require('@/assets/pressure.png')"
              class="icon dashboard"
            />
            <p class="icon-text">Ciśnienie</p>
            <!--        <p class="distance-text">{{stationDetails.stationDistance}}</p>-->
          </div>
          <div align="center" class="data-element dashboard">
            <v-img
              :src="require('@/assets/place-yellow.png')"
              class="icon dashboard"
            />
            <p class="icon-text">Odległość</p>
            <!--        <p class="distance-text">{{stationDetails.stationDistance}}</p>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AnimatedNumber from 'animated-number-vue'
import { VueSvgGauge } from 'vue-svg-gauge'
import { mapState } from 'vuex'
import HelperFunctions from '@/libs/helperFunctions'
import StationsService from '@/services/StationsService'
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
      chartData: {
        chartValue: null,
        backgroundColor: null
      },
      chartColor: null
    }
  },
  components: {
    VueSvgGauge,
    AnimatedNumber
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
    gaugeTransitionDuration () {
      if (this.closestStationState.chartData.percentValue <= 100) {
        return this.closestStationState.chartData.percentValue * 30
      } else {
        return 3000
      }
    },
    ...mapState('stations', ['closestStationState'])
  },
  watch: {
    closestStationState: {
      handler: function (value) {
        this.chartData.chartValue = value.chartData.chartValue
        this.chartData.backgroundColor = value.chartData.backgroundColor
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
  #data-container {
    alignment: center;
    justify-content: center;
    text-align: center;
    width: 30%;
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
    flex-direction: row;
  }
  .inner-text {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    p {
      text-align: center;
      color: #ffff;
      line-height: 10px;
      margin-top: 0.8rem;
    }

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
