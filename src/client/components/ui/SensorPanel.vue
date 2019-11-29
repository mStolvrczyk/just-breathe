<template>
  <div>
    <transition name="popup">
      <div id="sensor_panel" align="center" v-if="stationDetails != null">
        <v-container
          fluid class="pa-0"
          v-for="sensor in stationDetails.sensors"
          :key="sensor.id"
        >
          <v-row align="center" dense>
            <v-col cols="5">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-card v-on="on" rounded color="teal lighten-1" block class="white--text">
                    {{sensor.symbol}}
                  </v-card>
                </template>
                <span>{{sensor.name}}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="5">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-card v-on="on" class="white--text" :style="{ 'background-color': sensor.backgroundColor }">
                    <strong>{{sensor.pollutionLimit+'%'}}</strong>
                  </v-card>
                </template>
                <span>{{sensor.lastValue+' &#181/m'}}<sup>3</sup></span>
              </v-tooltip>
            </v-col>
            <v-col cols="2">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" @click="fillDatacollection(sensor.id, apiResponse)" fab x-small color="teal lighten-1">
                    <v-icon style="font-size:18px;color: white">mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <span>Pokaż szczegóły</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </transition>
    <ChartDialog
      :sensorDetails="sensorDetails"
      :apiResponse="apiResponse"
      :barDataCollection="barDataColllection"
      :lineDataCollection="lineDataCollection"
      :chartDialogVisibility.sync="chartDialogVisibility"
      :chartVisibility.sync="chartVisibility"
      v-on:closeChartDialog="closeChartDialog"
      v-on:barDataComparison="barDataComparison"
      v-on:lineDataComparison="lineDataComparison"
      v-on:withoutComparison="withoutComparison"
    />
  </div>
</template>

<script>
import ChartDialog from '@/components/ui/ChartDialog'
import pollutionLevels from '@/libs/pollutionLevels'
import pollutionLimits from '@/libs/pollutionLimits'

export default {
  name: 'SensorPanel',
  components: { ChartDialog },
  data () {
    return {
      date: this.formatDate(new Date()),
      sensorDetails: {
        sensorId: null,
        averageMeasurement: null,
        lastMeasurement: null
      },
      chartDialogVisibility: false,
      chartVisibility: false,
      barDataColllection: null,
      lineDataCollection: null
    }
  },
  props: {
    stationDetails: Object,
    apiResponse: Array
  },
  methods: {
    formatDate (date) {
      let d = date
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      let year = d.getFullYear()

      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }
      return [year, month, day].join('-')
    },
    async fillDatacollection (id, apiResponse) {
      let sensor = apiResponse.find(sensor => sensor.details.id === id)
      let filteredMeasurements = sensor.measurement.filter(({ date }) => date >= this.date + ' 00:00:00')
      let filteredValues = filteredMeasurements.map(({ value }) => value)
      let averageMeasurement = this.getAverage(filteredValues)
      let lastMeasurement = this.getLastMeasurement(filteredValues)
      this.barDataColllection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: sensor.details.param + ' (' + sensor.details.paramTwo + ')',
            backgroundColor: this.setBackgroundColor(filteredValues, sensor.details.paramTwo, true),
            data: filteredMeasurements.map(({ value }) => value.toFixed(2))
          }
        ]
      }
      this.lineDataCollection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: sensor.details.param + ' (' + sensor.details.paramTwo + ')',
            backgroundColor: this.setBackgroundColor(averageMeasurement, sensor.details.paramTwo, true)[0],
            data: filteredMeasurements.map(({ value }) => value.toFixed(2))
          }
        ]
      }
      this.sensorDetails.averageMeasurement = {
        value: averageMeasurement[0].toFixed(2),
        procentValue: this.getPollutionLimit(sensor.details.paramTwo, averageMeasurement[0]),
        pollutionLevel: pollutionLevels[this.setBackgroundColor(averageMeasurement, sensor.details.paramTwo, false)[0]]
      }
      this.sensorDetails.lastMeasurement = {
        value: lastMeasurement[0].toFixed(2),
        procentValue: this.getPollutionLimit(sensor.details.paramTwo, lastMeasurement[0]),
        pollutionLevel: pollutionLevels[this.setBackgroundColor(lastMeasurement, sensor.details.paramTwo, false)[0]]
      }
      this.chartDialogVisibility = true
      this.sensorDetails.sensorId = sensor.details.id
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
    getLastMeasurement (measurements) {
      return [
        measurements[measurements.length - 1]
      ]
    },
    getPollutionLimit (symbol, value) {
      let limit = pollutionLimits[symbol]
      return ((value * 100) / limit).toFixed(1)
    },
    setBackgroundColor (measurements, symbol, opacity) {
      let colorArray = []
      let compartments = [
        {
          symbol: 'PM10',
          limits: [20.00, 60.00, 100.00, 140.00, 200.00]
        },
        {
          symbol: 'PM2.5',
          limits: [12.00, 36.00, 60.00, 84.00, 120.00]
        },
        {
          symbol: 'O3',
          limits: [30.00, 70.00, 120.00, 160.00, 240.00]
        },
        {
          symbol: 'NO2',
          limits: [40.00, 100.00, 150.00, 200.00, 400.00]
        },
        {
          symbol: 'SO2',
          limits: [50.00, 100.00, 200.00, 350.00, 500.00]
        },
        {
          symbol: 'C6H6',
          limits: [5.00, 10.00, 15.00, 20.00, 50.00]
        },
        {
          symbol: 'CO',
          limits: [2499.00, 6499.00, 10499.00, 14499.00, 20499.00]
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
      let currSymbolLimits = compartments.find(test => test.symbol === symbol).limits
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
    },
    closeChartDialog (value) {
      this.chartDialogVisibility = value
      this.chartVisibility = value
    },
    withoutComparison (value) {
      this.fillDatacollection(value, this.apiResponse)
    },
    barDataComparison (value) {
      this.barDataColllection = value
    },
    lineDataComparison (value) {
      this.lineDataCollection = value
    }
  },
  watch: {
    'chartDialogVisibility' (value) {
      if (value === true) {
        setTimeout(function () { this.chartVisibility = true }
          .bind(this),
        50)
      }
    }
  }
}
</script>

<style>
  .popup-enter,
  .popup-leave-to{
    transform: rotateY(50deg);
  }
  .popup-enter-to,
  .popup-leave {
    transform: rotateY(0deg);
  }
  .popup-enter-active,
  .popup-leave-active {
    transition: transform 400ms;
  }
  @media only screen and (max-width: 767px) {
    #sensor_panel {
      position: absolute;
      height: 38%;
      top: 56%;
      left: 20%;
      width: 60%;
      overflow: scroll;
    }
  }
  @media only screen and (min-width: 768px) {
    #sensor_panel {
      position: absolute;
      top: 38%;
      left: 40px;
      width: 220px;
    }
  }
</style>
