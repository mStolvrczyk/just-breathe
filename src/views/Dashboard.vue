<template>
  <div id="dashboard">
    <div id="chart">
      <vue-svg-gauge
        v-if="closestStationState !== null"
        :start-angle="-110"
        :end-angle="110"
        :value="closestStationState.chartData.percentValue"
        :separator-step="0"
        :min="0"
        :max="100"
        :gauge-color="closestStationState.chartData.backgroundColor"
        :scale-interval="0"
        :innerRadius="75"
      >
        <div class="inner-text">
          <p
            :style="{'color': closestStationState.chartData.backgroundColor}">{{closestStationState.chartData.percentValue + '%'}}<br><span>{{closestStationState.chartData.value +' &#181/m'}}<sup>3</sup></span></p>
        </div>
      </vue-svg-gauge>
    </div>
  </div>
</template>

<script>
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
    VueSvgGauge
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
  .inner-text {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;

    p {
      font-weight: bold;
      line-height: 30px;
      margin-top: 2rem;
      margin-bottom: 0;
      font-size: 30px;
      text-align: center;
      max-width: 100px;
      span {
        font-weight: normal;
        padding: 0;
        margin-top: 0;
        font-size: 20px;
      }
    }
  }
  #chart {
    margin: 1rem;
    width: 30%;
    height: 30%;
  }
  #dashboard {
    display: flex;
    justify-content: center;
    alignment: center;
    width: 100%;
    height: 100%;
    background: #E0F2F1;
  }
</style>
