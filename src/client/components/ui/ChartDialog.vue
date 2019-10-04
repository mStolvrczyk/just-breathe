<template>
  <div>
    <v-dialog
      v-model="visibility"
      max-width="1000"
      persistent
      light
    >
      <v-card
        color="teal lighten-4"
      >
        <div align="right">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="closeDialog" icon fab small color="white" v-on="on">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Show closest location</span>
          </v-tooltip>
        </div>
        <v-spacer/>
        <div
          class="pa-4"
        >
          <v-card
            color="white"
              >
            <line-chart
              :chart-data="functions.datacollection"
              :height="150"
            >
            </line-chart>
          </v-card>
        </div>
        <v-card-text
        align="center"
        v-if="functions.stationDetails.length > 1"
        >
          <v-btn-toggle round
            mandatory
          >
            <v-tooltip
              v-for="sensor in functions.stationDetails"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  input-value="true"
                  @click="functions.fillDatacollection(sensor)"
                  v-on="on"
                  class="active"
                >
                  {{sensor.symbol}}
                </v-btn>
              </template>
              <span>{{sensor.name}}</span>
            </v-tooltip>
          </v-btn-toggle>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import StationsService from '@/services/StationsService'
import Functions from '@/libs/helperFunctions'
import LineChart from '@/components/vue-chartjs/BarChart'

export default {
  name: 'ChartDialog',
  components: {
    LineChart
  },
  data () {
    return {
      functions: new Functions(),
    }
  },
  props: {
    visibility: Boolean,
    choosenStationId: null
  },
  methods: {
    // formatDate (date) {
    //   let d = date,
    //     month = '' + (d.getMonth() + 1),
    //     day = '' + d.getDate(),
    //     year = d.getFullYear();
    //
    //   if (month.length < 2)
    //     month = '0' + month;
    //   if (day.length < 2)
    //     day = '0' + day;
    //
    //   return [year, month, day].join('-');
    // },
    // setBackgroundColor (sensor) {
    //   let colorArray = []
    //   let sensorValue = null
    //   let compartment = {}
    //   let infinity = Infinity
    //   let compartments = [
    //     {
    //       symbol: 'PM10',
    //       limits: [
    //         [0,20], [20, 60], [60,100], [100, 140], [140, 200], [200, infinity]
    //       ],
    //     },
    //     {
    //       symbol: 'PM2.5',
    //       limits: [
    //         [0,12], [12, 36], [36,60], [60, 84], [84, 120], [120, infinity]
    //       ],
    //     },
    //     {
    //       symbol: 'O3',
    //       limits: [
    //         [0,30], [30, 70], [70,120], [120, 160], [160, 240], [240, infinity]
    //       ],
    //     },
    //     {
    //       symbol: 'NO2',
    //       limits: [
    //         [0,40], [40, 100], [100,150], [150, 200], [200, 400], [400, infinity]
    //       ],
    //     },
    //     {
    //       symbol: 'SO2',
    //       limits: [
    //         [0,50], [50, 100], [100,200], [200, 350], [350, 500], [500, infinity]
    //       ],
    //     },
    //     {
    //       symbol: 'C6H6',
    //       limits: [
    //         [0,5], [5,10], [10,15], [15, 20], [20, 50], [50, infinity]
    //       ],
    //     },
    //     {
    //       symbol: 'CO',
    //       limits: [
    //         [0,2499], [2499, 6499], [6499,10499], [10499, 14499], [14499, 20499], [20499, infinity]
    //       ],
    //     }
    //   ]
    //   let colors = [
    //     '#57b108',
    //     '#b0dd10',
    //     '#ffd911',
    //     '#e58100',
    //     '#e50000',
    //     '#990000'
    //   ]
    //   for (let i=0; i<compartments.length; i+=1) {
    //     if (sensor.symbol === compartments[i].symbol) {
    //       compartment = compartments[i]
    //       for (let i=0; i<sensor.measurements.length; i+=1) {
    //         sensorValue = sensor.measurements[i].value
    //         for (let i=0; i<compartment.limits.length; i+=1) {
    //           if (compartment.limits[i][0] <= sensorValue && sensorValue <= compartment.limits[i][1]) {
    //             colorArray.push(colors[i])
    //           }
    //         }
    //       }
    //     }
    //   }
    //   return colorArray
    // },
    // fillDatacollection (sensor) {
    //   this.datacollection = {
    //     labels: sensor.measurements.map(({ date }) => date.substring(11, 16)),
    //     datasets: [
    //       {
    //         label: sensor.name+' ('+sensor.symbol+')',
    //         backgroundColor: this.functions.setBackgroundColor(sensor),
    //         data: sensor.measurements.map(({value}) => value)
    //       },
    //     ],
    //   }
    // },
    closeDialog () {
      this.$emit('updateVisibility', false)
      this.functions.stationDetails = []
    },
    // async getThisStation (id) {
    //   const response = await this.stationsService.getStation(id)
    //   this.stationDetails = response.map((sensor) => ({
    //     measurements: (sensor.measurement.filter(({date}) => date >= this.date+' 00:00:00')).reverse(),
    //     name: sensor.details.param,
    //     symbol: sensor.details.paramTwo,
    //   }))
    //   this.fillDatacollection(this.stationDetails[0])
    // }
  },
  watch: {
    'choosenStationId' (value) {
      this.functions.getThisStation(value)
    },
    'functions.datacollection' (value) {
      console.log(value)
      console.log(this.functions.stationDetails)
    }
  }
}
</script>

<style scoped>

</style>
