<template>
  <v-row justify="center">
    <v-dialog
      persistent
      v-model="mobileDialogVisibility"
      max-width="900px"
    >
<!--        <div-->
          <v-card
            class="pa-3"
            color="teal lighten-4"
          >
            <div align="center">
                <v-card
                  id="charts"
                  color="white"
                >
                  <v-card-text
                    align="center"
                    v-if="barDataCollection === null"
                  >
                    <strong>
                      Brak pomiarów
                    </strong>
                  </v-card-text>
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
                </v-card>
              <div class="text-center pa-2" v-if="barDataCollection != null">
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
              <v-container fluid class="pa-0" v-if="barDataCollection != null">
                <v-row align="center">
                  <v-col cols="12" sm="12">
                    <div class="text-center">
                      <v-card
                        color="teal lighten-1"
                      >
                        <v-card-text class="white--text">
                          <strong>uśredniony pomiar z dziś:<br v-if="width < 768">{{sensorDetails.averageMeasurement.procentValue + '%'}}
                            ({{sensorDetails.averageMeasurement.value + ' &#181/m'}}<sup>3</sup>) -
                            {{sensorDetails.averageMeasurement.pollutionLevel}}</strong><br>
                          <strong>ostatni pomiar:<br v-if="width < 768"> {{sensorDetails.lastMeasurement.procentValue + '%'}}
                            ({{sensorDetails.lastMeasurement.value + ' &#181/m'}}<sup>3</sup>) -
                            {{sensorDetails.lastMeasurement.pollutionLevel}}</strong>

                        </v-card-text>
                      </v-card>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </div>
            <div class="text-center">
              <v-btn @click="closeDialog" class="teal--text font-weight-bold" rounded color="white" dark>Wróć</v-btn>
            </div>
          </v-card>
<!--        </div>-->
    </v-dialog>
  </v-row>
</template>

<script>
import BarChart from '@/components/vue-chartjs/BarChart'
import LineChart from '@/components/vue-chartjs/LineChart'
export default {
  name: 'MobileChartDialog',
  components: {
    BarChart, LineChart
  },
  data () {
    return {
      updatedBarDataCollection: null,
      updatedLineDataCollection: null,
      chartHeight: null,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      chartSwitch: true,
      comparison: false,
      alignment: 0,
      date: this.formatDate(new Date())

    }
  },
  props: {
    mobileDialogVisibility: Boolean,
    chartVisibility: Boolean,
    sensorDetails: Object,
    apiResponse: Array,
    barDataCollection: Object,
    lineDataCollection: Object
  },
  methods: {
    formatDate (date) {
      let d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [year, month, day].join('-');
    },
    closeDialog () {
      this.$emit('closeMobileDialog', false)
    },
    async compareWithYesterday (id, apiResponse) {
      let yesterdaysDate = this.getYesterdaysDate()
      let sensor = apiResponse.find(sensor => sensor.details.id === id)
      let filteredMeasurements = sensor.measurement.filter(({date}) => date >= this.date+' 00:00:00')
      let filteredValues = filteredMeasurements.map(({value}) => value)
      let averageMeasurement = this.getAverage(filteredValues)
      let lastMeasurementsTime = filteredMeasurements[filteredMeasurements.length-1].date.substring(11)
      let yesterdaysMeasurements = (sensor.measurement.filter(({date}) => date >= yesterdaysDate+' 00:00:00' && date <= yesterdaysDate+' '+lastMeasurementsTime )).reverse()
      let yesterdayValues = yesterdaysMeasurements.map(({value}) => value)
      let yesterdaysAverageMeasurement = this.getAverage(yesterdayValues)
      this.updatedBarDataCollection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: yesterdaysDate,
            backgroundColor: this.setBackgroundColor(yesterdayValues, sensor.details.paramTwo, true),
            data: yesterdayValues
          },
          {
            label: this.date,
            backgroundColor: this.setBackgroundColor(filteredValues, sensor.details.paramTwo, true),
            data: filteredMeasurements.map(({value}) => value)
          }
        ]
      }
      this.$emit('barDataComparison', this.updatedBarDataCollection)
      this.updatedLineDataCollection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: yesterdaysDate,
            backgroundColor: this.setBackgroundColor(yesterdaysAverageMeasurement, sensor.details.paramTwo, true)[0],
            data: yesterdayValues
          },
          {
            label: this.date,
            backgroundColor: this.setBackgroundColor(averageMeasurement, sensor.details.paramTwo, true)[0],
            data: filteredMeasurements.map(({value}) => value)
          }
        ]
      }
      this.$emit('lineDataComparison', this.updatedLineDataCollection)
    },
    getYesterdaysDate () {
      let yesterdayDate = new Date()
      yesterdayDate.setDate(yesterdayDate.getDate() - 1)
      return this.formatDate(yesterdayDate)
    },
    getAverage (values) {
      let sum = null
      values.forEach((value) => {
        sum = sum + value
      })
      return [
        sum / values.length
      ]
    },
    setBackgroundColor (measurements, symbol, opacity) {
      let colorArray = []
      let compartments = [
        {
          symbol: 'PM10',
          limits: [20.00, 60.00, 100.00, 140.00, 200.00],
        },
        {
          symbol: 'PM2.5',
          limits: [12.00, 36.00, 60.00, 84.00, 120.00],
        },
        {
          symbol: 'O3',
          limits: [30.00, 70.00, 120.00, 160.00, 240.00],
        },
        {
          symbol: 'NO2',
          limits: [40.00, 100.00, 150.00, 200.00, 400.00],
        },
        {
          symbol: 'SO2',
          limits: [50.00, 100.00, 200.00, 350.00, 500.00],
        },
        {
          symbol: 'C6H6',
          limits: [5.00, 10.00, 15.00, 20.00, 50.00],
        },
        {
          symbol: 'CO',
          limits: [2499.00, 6499.00, 10499.00, 14499.00, 20499.00],
        }
      ]
      let colors = [
        'rgba(87, 177, 8)',
        'rgba(176, 221, 16)',
        'rgba(255, 217, 17)',
        'rgba(229, 129, 0)',
        'rgba(229, 0, 0)',
        'rgba(153, 0, 0)'
      ]
      let opacityColors = [
        'rgba(87, 177, 8, 0.6)',
        'rgba(176, 221, 16, 0.6)',
        'rgba(255, 217, 17, 0.6)',
        'rgba(229, 129, 0, 0.6)',
        'rgba(229, 0, 0, 0.6)',
        'rgba(153, 0, 0, 0.6)'
      ]
      let currSymbolLimits = compartments.find(test => test.symbol === symbol).limits;
      measurements.forEach(measurement => {
        let currMeasurementWithLimits = currSymbolLimits.concat([measurement])
        currMeasurementWithLimits.sort((a, b) => { return a - b })
        if (opacity) {
          colorArray.push(opacityColors[currMeasurementWithLimits.indexOf(measurement)])
        } else {
          colorArray.push(colors[currMeasurementWithLimits.indexOf(measurement)])
        }
      })
      return colorArray
    }
  },
  watch: {
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
      this.chartHeight = this.height / 4.1
    }
    console.log(document.documentElement.clientHeight)
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
  @media only screen and (min-width: 768px) {
    #chart_card {
      width: 60%;
      left: 20%;
    }
  }
  @media only screen and (min-width: 411px) and (max-width: 767px) {
    #chart_card {
      top: 5%;
      left: 20%;
    }
  }
</style>
