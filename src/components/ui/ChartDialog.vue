<template>
  <v-dialog
    persistent
    v-model="measurementsStatement"
    max-width="100%"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <div id="chart-dialog-card">
      <h3 class="silver" v-if="noMeasurementsStatement">
        Brak pomiarów
      </h3>
      <transition name="popup">
        <div v-if="measurementsStatement">
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
          <div class="row chart action">
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
        </div>
      </transition>
      <div class="row chart" v-if="measurementsStatement">
        <div class="row chart">
          <p class="chart-dialog-paragraph">Średni pomiar: <span :style="{'color':sensorDetailsState.averageMeasurement.color}">{{sensorDetailsState.averageMeasurement.procentValue + '%'}} ({{sensorDetailsState.averageMeasurement.value + ' &#181;/m'}}<sup>3</sup>) - {{sensorDetailsState.averageMeasurement.pollutionLevel}}</span></p>
        </div>
        <div class="row chart">
          <p class="chart-dialog-paragraph">Ostatni pomiar: <span :style="{'color':sensorDetailsState.lastMeasurement.color}">{{sensorDetailsState.lastMeasurement.procentValue + '%'}} ({{sensorDetailsState.lastMeasurement.value + ' &#181;/m'}}<sup>3</sup>) - {{sensorDetailsState.lastMeasurement.pollutionLevel}}</span></p>
        </div>
      </div>
      <div class="row chart action button">
        <v-btn @click="resetChartDialogDataState" class="teal--text font-weight-bold" rounded color="#EEEEEE" dark>Wróć</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import BarChart from '@/components/vue-chartjs/BarChart'
import LineChart from '@/components/vue-chartjs/LineChart'
import Functions from '@/libs/sharedFunctions'
import { mapActions, mapState } from 'vuex'

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
  methods: {
    ...mapActions('sensors', ['setChartDialogDataState', 'resetChartDialogDataState', 'setBarDataCollectionState', 'setLineDataCollectionState']),
    async compareWithYesterday (id, apiResponse) {
      const yesterdaysDate = this.getYesterdaysDate()
      const sensor = apiResponse.find(sensor => sensor.details.id === id)
      const filteredMeasurements = sensor.measurement.filter(({ date }) => date >= this.functions.formatDate(new Date()) + ' 00:00:00')
      const filteredValues = filteredMeasurements.map(({ value }) => value)
      const averageMeasurement = this.functions.getAverage(filteredValues)
      const lastMeasurementsTime = filteredMeasurements[filteredMeasurements.length - 1].date.substring(11)
      const yesterdaysMeasurements = (sensor.measurement.filter(({ date }) => date >= yesterdaysDate + ' 00:00:00' && date <= yesterdaysDate + ' ' + lastMeasurementsTime)).reverse()
      const yesterdayValues = yesterdaysMeasurements.map(({ value }) => value)
      const yesterdaysAverageMeasurement = this.functions.getAverage(yesterdayValues)
      const updatedBarDataCollection = {
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
      const updatedLineDataCollection = {
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
      const yesterdayDate = new Date()
      yesterdayDate.setDate(yesterdayDate.getDate() - 1)
      return this.functions.formatDate(yesterdayDate)
    }
  },
  computed: {
    chartHeight () {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return this.height / 7
      } else {
        return this.height / 1.4
      }
    },
    noMeasurementsStatement () {
      return this.barDataCollectionState.datasets.length === 0 || this.lineDataCollectionState.datasets.length === 0
    },
    measurementsStatement () {
      return (this.barDataCollectionState.datasets.length > 0 || this.barDataCollectionState.datasets.length > 0) && (this.sensorDetailsState.averageMeasurement !== null || this.sensorDetailsState.lastMeasurement !== null)
    },
    ...mapState('sensors', ['barDataCollectionState', 'lineDataCollectionState', 'sensorDetailsState', 'apiResponseStateDashboard', 'apiResponseStateMap'])
  },
  watch: {
    'alignment' (value) {
      if (value === 0 && this.chartSwitch === true && this.measurementsStatement === true) {
        this.setChartDialogDataState({ id: this.sensorDetailsState.sensorId, apiResponse: this.apiResponseHolder })
        this.comparison = false
      } else if (value === 2 && this.chartSwitch === false && this.measurementsStatement === true) {
        this.setChartDialogDataState({ id: this.sensorDetailsState.sensorId, apiResponse: this.apiResponseHolder })
        this.comparison = false
      }
    },
    'comparison' (value) {
      if (value === false && this.measurementsStatement === true) {
        this.setChartDialogDataState({ id: this.sensorDetailsState.sensorId, apiResponse: this.apiResponseHolder })
      }
    },
    'measurementsStatement' (value) {
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
    }
  }
}
</script>
