<script>
import { Line } from 'vue-chartjs'
export default {
  extends: Line,
  props: {
    chartLabels: {
      type: Array,
      required: true
    },
    chartData: {
      type: Array | Object,
      required: false
    },
    chartLabel: {
      type: String,
      required: true
    },
    chartTooltip: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      options: {
        animation: {
          onProgress: function (animation) {
            // do animation
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [{
            gridLines: {
              display: true
            }
          }]
        },
        onClick (event) {
          var activePoints = this.getElementsAtEventForMode(event, 'point', this.options)
          if (activePoints.length > 0) {
            var firstPoint = activePoints[0]
            var label = this.data.labels[firstPoint._index]
            var value = this.data.datasets[firstPoint._datasetIndex].data[firstPoint._index]
            console.log(label + ': ' + value)
            return {label: value}
            // do something here with the clicked data
          }
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: true,
          mode: 'nearest',
          callbacks: {
            label: function (tooltipItems, data) {
              console.log(this.chartTooltip)
              console.log(data)
              return tooltipItems.xLabel + ': ' + tooltipItems.yLabel
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  methods: {
    renderLineChart: function () {
      this.renderChart({
        labels: this.chartLabels,
        datasets: [
          {
            label: this.chartLabel,
            borderColor: '#ff3300',
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#800000',
            backgroundColor: 'transparent',
            data: this.chartData
          }
        ]
      }, this.options)
    }
  },
  watch: {
    chartData: function () {
      this.$data._chart.destroy()
      this.renderLineChart()
    }
  },
  mounted () {
    this.renderLineChart()
  }
}
</script>
