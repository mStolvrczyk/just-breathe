import {Bar, mixins} from 'vue-chartjs'
const { reactiveProp } = mixins
import Functions from '@/libs/helperFunctions'

export default {
  extends: Bar,
  mixins: [reactiveProp],
  data: () => ({
    functions: new Functions(),
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  }),
  mounted () {
    this.renderChart(this.chartData, this.options)
  },
  // watch: {
  //   'functions.barDataColllection' () {
  //     this._chart.update()
  //     console.log('dupa')
  //   }
  // }
}
