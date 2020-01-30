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
import ChartDialog from '../../components/ui/ChartDialog'
import pollutionLevels from '../../libs/pollutionLevels'
import Functions from '../../libs/helperFunctions'

export default {
  name: 'SensorPanel',
  components: { ChartDialog },
  data () {
    return {
      functions: new Functions(),
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
    async fillDatacollection (id, apiResponse) {
      let sensor = apiResponse.find(sensor => sensor.details.id === id)
      let filteredMeasurements = sensor.measurement.filter(({ date }) => date >= this.functions.formatDate(new Date()) + ' 00:00:00')
      let filteredValues = filteredMeasurements.map(({ value }) => value)
      let averageMeasurement = this.functions.getAverage(filteredValues)
      let lastMeasurement = this.getLastMeasurement(filteredValues)
      this.barDataColllection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: sensor.details.param + ' (' + sensor.details.paramTwo + ')',
            backgroundColor: this.functions.setBackgroundColor(filteredValues, sensor.details.paramTwo, true),
            data: filteredMeasurements.map(({ value }) => value.toFixed(2))
          }
        ]
      }
      this.lineDataCollection = {
        labels: filteredMeasurements.map(({ date }) => date.substring(11, 16)),
        datasets: [
          {
            label: sensor.details.param + ' (' + sensor.details.paramTwo + ')',
            backgroundColor: this.functions.setBackgroundColor(averageMeasurement, sensor.details.paramTwo, true)[0],
            data: filteredMeasurements.map(({ value }) => value.toFixed(2))
          }
        ]
      }
      this.sensorDetails.averageMeasurement = {
        value: averageMeasurement[0].toFixed(2),
        procentValue: this.functions.getPollutionLimit(sensor.details.paramTwo, averageMeasurement[0]),
        pollutionLevel: pollutionLevels[this.functions.setBackgroundColor(averageMeasurement, sensor.details.paramTwo, false)[0]]
      }
      this.sensorDetails.lastMeasurement = {
        value: lastMeasurement[0].toFixed(2),
        procentValue: this.functions.getPollutionLimit(sensor.details.paramTwo, lastMeasurement[0]),
        pollutionLevel: pollutionLevels[this.functions.setBackgroundColor(lastMeasurement, sensor.details.paramTwo, false)[0]]
      }
      this.chartDialogVisibility = true
      this.sensorDetails.sensorId = sensor.details.id
    },
    getLastMeasurement (measurements) {
      return [
        measurements[measurements.length - 1]
      ]
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
