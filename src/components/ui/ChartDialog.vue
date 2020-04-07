<template>
  <v-dialog
    persistent
    v-model="chartDialogVisibilityState"
    max-width="100%"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <div id="chart-dialog-card">
<!--      <div id="chart-card">-->
      <h3 class="silver" v-if="barDataCollectionState.datasets.length === 0 || lineDataCollectionState.datasets.length === 0">
        Brak pomiarów
      </h3>
      <transition name="popup">
        <div v-if="(barDataCollectionState.datasets.length > 0 || barDataCollectionState.datasets.length > 0) && chartDialogVisibilityState">
          <bar-chart
            v-if="chartSwitch"
            :chart-data="barDataCollectionState"
            :height.sync="chartHeight"
          />
          <line-chart
            v-else
            :chart-data="lineDataCollectionState"
            :height.sync="chartHeight"
          />
        </div>
      </transition>
      <div v-if="barDataCollectionState.datasets.length > 0 || lineDataCollectionState.datasets.length > 0">
        <div class="row chart">
          <v-btn-toggle rounded v-model="alignment">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn @click="chartSwitch = true" color="white" v-on="on">
                  <v-icon style="font-size:23px;color: teal">mdi-chart-bar</v-icon>
                </v-btn>
              </template>
              <span>Wykres słupkowy</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn @click="compareWithYesterday(sensorDetailsState.sensorId, apiResponseHolder), comparison = !comparison" color="white" v-on="on">
                  <v-icon style="font-size:23px;color: teal">mdi-compare</v-icon>
                </v-btn>
              </template>
              <span>Porównaj z wczoraj</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn @click="chartSwitch = false" color="white" v-on="on">
                  <v-icon style="font-size:23px;color: teal">mdi-chart-bell-curve</v-icon>
                </v-btn>
              </template>
              <span>Wykres liniowy</span>
            </v-tooltip>
          </v-btn-toggle>
        </div>
<!--        <h3 class="chart-info-text">Uśredniony pomiar z dziś: <br v-if="$vuetify.breakpoint.xs"> <span :style="{'color':sensorDetailsState.averageMeasurement.color}">{{sensorDetailsState.averageMeasurement.procentValue-->
<!--          + '%'}}({{sensorDetailsState.averageMeasurement.value + ' &#181/m'}}<sup>3</sup>) - -->
<!--          {{sensorDetailsState.averageMeasurement.pollutionLevel}}</span></h3> <h3 class="chart-info-text">Ostatni pomiar:-->
<!--        <br v-if="$vuetify.breakpoint.xs"> <span :style="{'color':sensorDetailsState.lastMeasurement.color}">{{sensorDetailsState.lastMeasurement.procentValue + '%'}}-->
<!--          ({{sensorDetailsState.lastMeasurement.value + ' &#181/m'}}<sup>3</sup>) - -->
<!--          {{sensorDetailsState.lastMeasurement.pollutionLevel}}</span></h3>-->
      </div>
      <div class="row chart button">
        <v-btn @click="closeDialog" class="teal--text font-weight-bold" rounded color="#EEEEEE" dark>Wróć</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import BarChart from '@/components/vue-chartjs/BarChart'
import LineChart from '@/components/vue-chartjs/LineChart'
import Functions from '@/libs/helperFunctions'
import { mapActions, mapState } from 'vuex'
import pollutionLevels from '@/libs/pollutionLevels'

export default {
  name: 'ChartDialog',
  components: {
    BarChart, LineChart
  },
  data () {
    return {
      apiResponseHolder: null,
      functions: new Functions(),
      updatedBarDataCollection: null,
      updatedLineDataCollection: null,
      height: document.documentElement.clientHeight,
      chartSwitch: true,
      comparison: false,
      alignment: 0
    }
  },
  // props: {
  //   chartDialogVisibility: Boolean,
  //   chartVisibility: Boolean,
  //   sensorDetails: Object,
  //   apiResponse: Array,
  //   barDataCollection: Object,
  //   lineDataCollection: Object
  // },
  methods: {
    ...mapActions('sensors', ['setBarDataCollectionState', 'setLineDataCollectionState', 'setSensorDetailsState', 'setChartDialogVisibilityState']),
    closeDialog () {
      let barDataCollectionState = {
        labels: null,
        datasets: []
      }
      let lineDataCollectionState = {
        labels: null,
        datasets: []
      }
      let sensorDetailsState = {
        sensorId: null,
        averageMeasurement: null,
        lastMeasurement: null
      }
      this.setBarDataCollectionState(barDataCollectionState)
      this.setLineDataCollectionState(lineDataCollectionState)
      this.setSensorDetailsState(sensorDetailsState)
      this.setChartDialogVisibilityState(false)
    },
    async fillDatacollection (id, apiResponse) {
      let sensor = apiResponse.find(sensor => sensor.details.id === id)
      let filteredMeasurements = sensor.measurement.filter(({ date }) => date >= this.functions.formatDate(new Date()) + ' 00:00:00')
      let filteredValues = filteredMeasurements.map(({ value }) => value)
      let averageMeasurement = this.functions.getAverage(filteredValues)
      let lastMeasurement = this.functions.getLastMeasurement(filteredValues)
      let barDataCollection = {
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
      let lineDataCollection = {
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
      let sensorDetails = {
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
    },
    async compareWithYesterday (id, apiResponse) {
      let yesterdaysDate = this.getYesterdaysDate()
      let sensor = apiResponse.find(sensor => sensor.details.id === id)
      let filteredMeasurements = sensor.measurement.filter(({ date }) => date >= this.functions.formatDate(new Date()) + ' 00:00:00')
      let filteredValues = filteredMeasurements.map(({ value }) => value)
      let averageMeasurement = this.functions.getAverage(filteredValues)
      let lastMeasurementsTime = filteredMeasurements[filteredMeasurements.length - 1].date.substring(11)
      let yesterdaysMeasurements = (sensor.measurement.filter(({ date }) => date >= yesterdaysDate + ' 00:00:00' && date <= yesterdaysDate + ' ' + lastMeasurementsTime)).reverse()
      let yesterdayValues = yesterdaysMeasurements.map(({ value }) => value)
      let yesterdaysAverageMeasurement = this.functions.getAverage(yesterdayValues)
      let updatedBarDataCollection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: yesterdaysDate,
            backgroundColor: this.functions.setBackgroundColor(yesterdayValues, sensor.details.paramTwo, true),
            data: yesterdayValues
          },
          {
            label: this.functions.formatDate(new Date()),
            backgroundColor: this.functions.setBackgroundColor(filteredValues, sensor.details.paramTwo, true),
            data: filteredMeasurements.map(({ value }) => value)
          }
        ]
      }
      this.setBarDataCollectionState(updatedBarDataCollection)
      let updatedLineDataCollection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: yesterdaysDate,
            backgroundColor: this.functions.setBackgroundColor([yesterdaysAverageMeasurement], sensor.details.paramTwo, true)[0],
            data: yesterdayValues
          },
          {
            label: this.functions.formatDate(new Date()),
            backgroundColor: this.functions.setBackgroundColor([averageMeasurement], sensor.details.paramTwo, true)[0],
            data: filteredMeasurements.map(({ value }) => value)
          }
        ]
      }
      this.setLineDataCollectionState(updatedLineDataCollection)
    },
    getYesterdaysDate () {
      let yesterdayDate = new Date()
      yesterdayDate.setDate(yesterdayDate.getDate() - 1)
      return this.functions.formatDate(yesterdayDate)
    }
  },
  computed: {
    chartHeight () {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return this.height / 5.7
      } else {
        return this.height / 1.2
      }
    },
    ...mapState('sensors', ['barDataCollectionState', 'lineDataCollectionState', 'sensorDetailsState', 'chartDialogVisibilityState', 'apiResponseStateDashboard', 'apiResponseStateMap'])
  },
  watch: {
    'alignment' (value) {
      if (value === 0 && this.chartSwitch === true && this.chartDialogVisibilityState === true) {
        this.fillDatacollection(this.sensorDetailsState.sensorId, this.apiResponseHolder)
        this.comparison = false
      } else if (value === 2 && this.chartSwitch === false && this.chartDialogVisibilityState === true) {
        this.fillDatacollection(this.sensorDetailsState.sensorId, this.apiResponseHolder)
        this.comparison = false
      }
    },
    'comparison' (value) {
      if (value === false && this.chartDialogVisibilityState === true) {
        this.fillDatacollection(this.sensorDetailsState.sensorId, this.apiResponseHolder)
      }
    },
    chartDialogVisibilityState: {
      handler: function (value) {
        if (value === false) {
          this.alignment = 0
          this.chartSwitch = true
          this.comparison = false
        } else {
          if (this.$route.path === '/dashboard') {
            this.apiResponseHolder = this.apiResponseStateDashboard
          } else if (this.$route.path === '/map') {
            this.apiResponseHolder = this.apiResponseStateMap
          }
        }
      },
      deep: true
    }
  }
}
</script>
