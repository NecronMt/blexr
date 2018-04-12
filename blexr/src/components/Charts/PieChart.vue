<script>
import { Pie } from 'vue-chartjs'
export default {
  extends: Pie,
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
          console.log(event)
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
              var current = tooltipItems.index
              var label = data.labels[current]
              var value = data.datasets[0].data[current]
              var formattedNumber = new Intl.NumberFormat('en-IR').format(value)
              return label + ': ' + formattedNumber
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
    // search (country) {
    //   this.$router.go({name: 'Reports', params: { country }})
    // },
    renderBarChart: function () {
      this.renderChart({
        labels: this.chartLabels,
        datasets: [
          {
            label: this.datalabel,
            backgroundColor: ['#E5468A', '#FF4E99', '#D2407E', '#BF3A73', '#7F274C', '#7F3722', '#BF5332', '#F76B41', '#FF6E43', '#E5633C'],
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
