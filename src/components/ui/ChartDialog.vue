<template>
  <v-dialog
    persistent
    v-model="chartDialogVisibility"
    max-width="900px"
  >
    <div id="chart-dialog-card">
      <div id="chart-card">
        <h3 class="silver" v-if="barDataCollection === null">
          Brak pomiarów
        </h3>
        <transition name="station_popup">
          <div v-if="barDataCollection !== null && chartVisibility">
            <bar-chart
              v-if="chartSwitch"
              :chart-data="barDataCollection"
              :height="chartHeight"
            />
            <line-chart
              v-else
              :chart-data="lineDataCollection"
              :height="chartHeight"
            />
          </div>
        </transition>
      </div>
      <div id="chart-buttons">
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
<!--      <div id="chart-info">-->
        <h3 class="chart-info-text">Uśredniony pomiar z dziś: {{sensorDetails.averageMeasurement.procentValue + '%'}} ({{sensorDetails.averageMeasurement.value + ' &#181/m'}}<sup>3</sup>) -
        {{sensorDetails.averageMeasurement.pollutionLevel}}</h3>
        <h3 class="chart-info-text">Ostatni pomiar: {{sensorDetails.lastMeasurement.procentValue + '%'}}
          ({{sensorDetails.lastMeasurement.value + ' &#181/m'}}<sup>3</sup>) -
          {{sensorDetails.lastMeasurement.pollutionLevel}}</h3>
<!--      </div>-->
    </div>
  </v-dialog>
<!--  <v-row justify="center">-->
<!--    <v-dialog-->
<!--    >-->
<!--          <v-card-->
<!--            class="pa-3"-->
<!--            color="rgba(0,77,64,.9)"-->
<!--          >-->
<!--              <v-card-->
<!--                id="charts"-->
<!--                color="white"-->
<!--              >-->
<!--                <v-card-text-->
<!--                  align="center"-->
<!--                  v-if="barDataCollection === null"-->
<!--                >-->
<!--                  <strong>-->
<!--                    Brak pomiarów-->
<!--                  </strong>-->
<!--                </v-card-text>-->
<!--                <transition name="station_popup">-->
<!--                  <div v-if="barDataCollection !== null && chartVisibility">-->
<!--                      <bar-chart-->
<!--                        v-if="chartSwitch"-->
<!--                        :chart-data="barDataCollection"-->
<!--                        :height="chartHeight"-->
<!--                      />-->
<!--                      <line-chart-->
<!--                        v-else-->
<!--                        :chart-data="lineDataCollection"-->
<!--                        :height="chartHeight"-->
<!--                      />-->
<!--                  </div>-->
<!--                </transition>-->
<!--              </v-card>-->
<!--              <div class="text-center pa-2" v-if="barDataCollection != null">-->
<!--                <v-btn-toggle rounded v-model="alignment">-->
<!--                  <v-tooltip bottom>-->
<!--                    <template v-slot:activator="{ on }">-->
<!--                      <v-btn @click="chartSwitch = true" color="white" v-on="on">-->
<!--                        <v-icon style="font-size:23px;color: teal">mdi-chart-bar</v-icon>-->
<!--                      </v-btn>-->
<!--                    </template>-->
<!--                    <span>Wykres słupkowy</span>-->
<!--                  </v-tooltip>-->
<!--                  <v-tooltip bottom>-->
<!--                    <template v-slot:activator="{ on }">-->
<!--                      <v-btn @click="compareWithYesterday(sensorDetails.sensorId, apiResponse), comparison = !comparison" color="white" v-on="on">-->
<!--                        <v-icon style="font-size:23px;color: teal">mdi-compare</v-icon>-->
<!--                      </v-btn>-->
<!--                    </template>-->
<!--                    <span>Porównaj z wczoraj</span>-->
<!--                  </v-tooltip>-->
<!--                  <v-tooltip bottom>-->
<!--                    <template v-slot:activator="{ on }">-->
<!--                      <v-btn @click="chartSwitch = false" color="white" v-on="on">-->
<!--                        <v-icon style="font-size:23px;color: teal">mdi-chart-bell-curve</v-icon>-->
<!--                      </v-btn>-->
<!--                    </template>-->
<!--                    <span>Wykres liniowy</span>-->
<!--                  </v-tooltip>-->
<!--                </v-btn-toggle>-->
<!--              </div>-->
<!--              <v-container fluid class="pa-0" v-if="barDataCollection != null">-->
<!--                <v-row align="center">-->
<!--                  <v-col cols="6" sm="12">-->
<!--                    <div class="text-center">-->
<!--                      <v-card-->
<!--                        color="white"-->
<!--                      >-->
<!--                        <v-card-text class="teal&#45;&#45;text font-weight-bold">-->
<!--                          <strong>uśredniony pomiar z dziś:<br v-if="width < 768">{{sensorDetails.averageMeasurement.procentValue + '%'}}-->
<!--                            ({{sensorDetails.averageMeasurement.value + ' &#181/m'}}<sup>3</sup>) - -->
<!--                            {{sensorDetails.averageMeasurement.pollutionLevel}}</strong><br>-->
<!--                          <strong>ostatni pomiar:<br v-if="width < 768"> {{sensorDetails.lastMeasurement.procentValue + '%'}}-->
<!--                            ({{sensorDetails.lastMeasurement.value + ' &#181/m'}}<sup>3</sup>) - -->
<!--                            {{sensorDetails.lastMeasurement.pollutionLevel}}</strong>-->

<!--                        </v-card-text>-->
<!--                      </v-card>-->
<!--                    </div>-->
<!--                  </v-col>-->
<!--                </v-row>-->
<!--              </v-container>-->
<!--            <div class="text-center">-->
<!--              <v-btn @click="closeDialog" class="teal&#45;&#45;text font-weight-bold" rounded color="#EEEEEE" dark>Wróć</v-btn>-->
<!--            </div>-->
<!--          </v-card>-->
<!--    </v-dialog>-->
<!--  </v-row>-->
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
      chartHeight: null,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      chartSwitch: true,
      comparison: false,
      alignment: 0,
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
            backgroundColor: this.functions.setBackgroundColor(yesterdaysAverageMeasurement, sensor.details.paramTwo, true)[0],
            data: yesterdayValues
          },
          {
            label: this.functions.formatDate(new Date()),
            backgroundColor: this.functions.setBackgroundColor(averageMeasurement, sensor.details.paramTwo, true)[0],
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
  },
  mounted () {
    if (this.width < 415) {
      this.chartHeight = 280
    } else {
      this.chartHeight = this.height / 4.3
    }
  }
}
</script>

<style>
  .station_popup-enter,
  .station_popup-leave-to{
    transform: rotateY(50deg);
  }
  .station_popup-enter-to,
  .station_popup-leave {
    transform: rotateY(0deg);
  }
  .station_popup-enter-active,
  .station_popup-leave-active {
    transition: transform 400ms;
  }
</style>
