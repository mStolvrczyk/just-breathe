<template>
  <div>
    <v-dialog
      v-model="visibility"
      max-width="1000"
      scrollable
      light
      v-click-outside="closeDialog"
    >
      <v-card
        color="teal lighten-4"
      >
      <v-card
        color="white"
        >
        <v-btn-toggle
          v-model="toggle_exclusive"
          rounded
          v-for=""
        >
          <v-btn>
            <v-icon>mdi-format-align-left</v-icon>
          </v-btn>
        </v-btn-toggle>
        </v-card>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import StationsService from '@/services/StationsService'
import Functions from '@/libs/helperFunctions'
import BarChart from '@/components/vue-chartjs/BarChart'

export default {
  name: 'ChartDialog',
  components: {
    BarChart
  },
  data () {
    return {
      stationsService: new StationsService(),
      functions: new Functions(),
      measurementDate: null,
      options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      stationDetails: [],
      datacollection: {},
      // datacollection: {
      //   datasets: [
      //     {
      //       backgroundColor: '#b0dd10',
      //       data: [
      //         6.21506,
      //         401
      //       ],
      //       label: 'Bardzo dobry'
      //     },
      //     {
      //       backgroundColor: '#b0dd10',
      //       data: [
      //         6.21506,
      //         401
      //       ],
      //       label: 'Bardzo dobry'
      //     },
      //     {
      //       backgroundColor: '#b0dd10',
      //       data: [
      //         6.21506,
      //         401
      //       ],
      //       label: 'Bardzo dobry'
      //     },
      //     {
      //       backgroundColor: '#b0dd10',
      //       data: [
      //         6.21506,
      //         401
      //       ],
      //       label: 'Bardzo dobry'
      //     }
      //   ],
      //   dates: [],
      //   labels: [
      //     'NO2',
      //     'NO2',
      //     'NO2'
      //   ]
      // },
      tab: null,
      date: null,
      airQualityMaxLevel: {
        CO: 21,
        NO2: 401,
        C6H6: 51,
        SO2: 501,
        PM10: 210,
        PM25: 121,
        O3: 241
      },
      airQuality: {
        bardzodobry: '#57b108',
        dobry: '#b0dd10',
        umiarkowany: '#ffd911',
        dostateczny: '#e58100',
        zły: '#e50000',
        bardzozły: '#990000',
        brakindeksu: '#bfbfbf'
      }
    }
  },
  props: {
    visibility: Boolean,
    choosenStationId: null
  },
  methods: {
    closeDialog (event) {
      this.$emit('updateVisibility', false)
      this.datacollection = {}
      console.log('dupa')
    },
    async getThisStation (id) {
      const response = await this.stationsService.getStation(id)
      this.stationDetails = response.map((sensor) => ({
        label: sensor.details.param,
        symbol: sensor.details.paramTwo,
        value: sensor.measurement,
        qualityLevel: sensor.qualityLevel
      }))
      this.datacollection = {
        labels: this.stationDetails.map(({ symbol }) => symbol),
        datasets: this.stationDetails.map(({ symbol, value, qualityLevel }) => ({
          label: qualityLevel,
          backgroundColor: this.airQuality[qualityLevel.toLowerCase().replace(' ', '')],
          data: [value, this.airQualityMaxLevel[symbol.replace('.', '')]]
        })),
        dates: this.stationDetails.map(({ date, symbol }) => ({
          date: date,
          symbol: symbol
        }))
      }
      let data = new Date()
      this.measurementDate = data.toLocaleDateString('en-US', this.options)
    }
  },
  watch: {
    'choosenStationId' (value) {
      this.getThisStation(value)
      console.log(this.stationDetails)
    }
  }
}
</script>

<style scoped>

</style>
