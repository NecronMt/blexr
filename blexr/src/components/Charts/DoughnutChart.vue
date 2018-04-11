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
            backgroundColor: ['#E5633C', '#FF6E43', '#F76B41', '#BF5332', '#7F3722', '#7F274C', '#BF3A73', '#D2407E', '#FF4E99', '#E5468A'],
            borderColor: 'transparent',
            hoverBorderColor: '#FEFEFE',
            hoverBackgroundColor: '#f78e41',
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
