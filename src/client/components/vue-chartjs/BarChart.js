import {Bar, mixins, HorizontalBar} from 'vue-chartjs'
const { reactiveProp } = mixins


export default {
  extends: HorizontalBar,
  mixins: [reactiveProp],
  data: () => ({
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
  }
}
