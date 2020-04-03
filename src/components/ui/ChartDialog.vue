<template>
  <v-dialog
    persistent
    v-model="chartDialogVisibility"
    max-width="900px"
  >
    <div id="chart-dialog-card">
      <div id="chart-card">
        <h3 class="silver" v-if="barDataCollection === null || lineDataCollection === null">
          Brak pomiarów
        </h3>
        <transition name="popup">
          <div v-if="(barDataCollection !== null || lineDataCollection !== null) && chartVisibility">
            <bar-chart
              v-if="chartSwitch"
              :chart-data="barDataCollection"
              :height.sync="chartHeight"
            />
            <line-chart
              v-else
              :chart-data="lineDataCollection"
              :height.sync="chartHeight"
            />
          </div>
        </transition>
      </div>
      <div v-if="barDataCollection !== null || lineDataCollection !== null">
        <div class="chart-row">
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
                <v-btn @click="compareWithYesterday(sensorDetails.sensorId, apiResponse), comparison = !comparison" color="white" v-on="on">
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
        <h3 class="chart-info-text">Uśredniony pomiar z dziś: <br v-if="$vuetify.breakpoint.xs"> <span :style="{'color':sensorDetails.averageMeasurement.color}">{{sensorDetails.averageMeasurement.procentValue + '%'}}({{sensorDetails.averageMeasurement.value + ' &#181/m'}}<sup>3</sup>) -
          {{sensorDetails.averageMeasurement.pollutionLevel}}</span></h3> <h3 class="chart-info-text">Ostatni pomiar:
        <br v-if="$vuetify.breakpoint.xs"> <span :style="{'color':sensorDetails.lastMeasurement.color}">{{sensorDetails.lastMeasurement.procentValue + '%'}}
          ({{sensorDetails.lastMeasurement.value + ' &#181/m'}}<sup>3</sup>) -
          {{sensorDetails.lastMeasurement.pollutionLevel}}</span></h3>
      </div>
      <div class="chart-row button">
        <v-btn @click="closeDialog" class="teal--text font-weight-bold" rounded color="#EEEEEE" dark>Wróć</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import BarChart from '@/components/vue-chartjs/BarChart'
import LineChart from '@/components/vue-chartjs/LineChart'
import Functions from '@/libs/helperFunctions'

export default {
  name: 'ChartDialog',
  components: {
    BarChart, LineChart
  },
  data () {
    return {
      functions: new Functions(),
      updatedBarDataCollection: null,
      updatedLineDataCollection: null,
      height: document.documentElement.clientHeight,
      chartSwitch: true,
      comparison: false,
      alignment: 0
    }
  },
  props: {
    chartDialogVisibility: Boolean,
    chartVisibility: Boolean,
    sensorDetails: Object,
    apiResponse: Array,
    barDataCollection: Object,
    lineDataCollection: Object
  },
  methods: {
    closeDialog () {
      this.$emit('closeChartDialog', false)
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
      this.updatedBarDataCollection = {
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
      this.$emit('barDataComparison', this.updatedBarDataCollection)
      this.updatedLineDataCollection = {
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
      this.$emit('lineDataComparison', this.updatedLineDataCollection)
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
        return this.height / 4.6
      } else {
        return 270
      }
    }
  },
  watch: {
    'alignment' (value) {
      if (value === 0 && this.comparison === true && this.chartSwitch === true) {
        this.$emit('withoutComparison', this.sensorDetails.sensorId)
        this.comparison = false
      } else if (value === 2 && this.comparison === true && this.chartSwitch === false) {
        this.$emit('withoutComparison', this.sensorDetails.sensorId)
        this.comparison = false
      }
    },
    'comparison' (value) {
      if (value === false) {
        this.$emit('withoutComparison', this.sensorDetails.sensorId)
      }
    },
    'sensorDetails.sensorId' () {
      this.alignment = 0
      this.chartSwitch = true
    }
  }
}
</script>
