<template>
  <div id="dashboard">
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
    <div class="row">
      <div id="chart">
        <vue-svg-gauge
          v-if="closestStationState !== null"
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
          :transitionDuration="2000"
        >
          <div class="inner-text">
            <p>
              <animated-number
                :value="closestStationState.chartData.percentValue"
                :formatValue="formatPercentValue"
                :duration="2000"
                :round="1"
              /><br>
              <animated-number
                :value="closestStationState.chartData.value"
                :formatValue="formatValue"
                :duration="2000"
                :round="1"
              />
            </p>
          </div>
        </vue-svg-gauge>
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
    }
  },
  computed: {
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
  #info-panel {
    padding: 1rem;
    flex-direction: row;
    background: rgba(0,77,64,.9);
    height: 400px;
    width: 50%;
  }
  #chart {
    padding: 1rem;
    width: 20%;
    height: 20%;
  }
  #dashboard {
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
