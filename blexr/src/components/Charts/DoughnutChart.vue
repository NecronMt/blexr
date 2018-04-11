<script>
import { Doughnut } from 'vue-chartjs'
export default {
  extends: Doughnut,
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
          enabled: true
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
            label: this.datalabel,
            backgroundColor: 'transparent',
            borderColor: '#ff3300',
            hoverBackgroundColor: '#333333',
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
