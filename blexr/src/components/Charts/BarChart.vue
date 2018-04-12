<script>
import { Bar } from 'vue-chartjs'
export default {
  extends: Bar,
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
    }
  },
  data () {
    return {
      options: {
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
            return { label: value }
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
              var formattedNumber = new Intl.NumberFormat('en-IR').format(tooltipItems.yLabel)
              return tooltipItems.xLabel + ': ' + formattedNumber
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  computed: {

  },
  methods: {
    renderBarChart: function () {
      this.renderChart({
        labels: this.chartLabels,
        datasets: [
          {
            label: this.chartLabel,
            borderColor: '#f78e41',
            borderWidth: 1,
            backgroundColor: '#d2407e',
            data: this.chartData
          }
        ]
      }, this.options)
    }
  },
  watch: {
    chartData: function () {
      this.$data._chart.destroy()
      this.renderBarChart()
    }
  },
  mounted () {
    this.renderBarChart()
  }
}
</script>
