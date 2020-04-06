import {Line, mixins} from 'vue-chartjs'
const { reactiveProp } = mixins


export default {
  extends: Line,
  mixins: [reactiveProp],
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        xAxes: [{
          ticks: {
            fontColor: '#fff',
            beginAtZero: true
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: '#fff',
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
