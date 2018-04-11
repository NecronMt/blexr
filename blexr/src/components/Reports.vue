<template>
  <div class="main-content">
    <h1>Reports</h1>

    <div class="search-area">
      <input class="search" placeholder="Search by Country" type="search" name="search" @keyup.enter="requestData" v-model="country">
      <button class="search-btn" @click="requestData">Search</button>
    </div>

    <div class="error-message" v-if="showError">
      <h3>Oops!</h3>
      {{ errorMessage }}
    </div>

    <div class="chart-content">
      <bar-chart v-if="loaded" :chart-label="label" :chart-labels="labels" :chart-tooltip="tooltip" :chart-data="population"></bar-chart>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reports',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<script>
  import axios from 'axios'
  import LineChart from '@/components/Charts/LineChart'
  import BarChart from '@/components/Charts/BarChart'

  export default {
    components: {
      LineChart,
      BarChart
    },
    data () {
      return {
        country: null,
        loaded: false,
        loading: false,
        showError: false,
        errorMessage: 'Error',
        rawData: '',
        label: 'Hi',
        labels: [],
        tooltip: 'Peo',
        population: []
      }
    },
    mounted () {
      if (this.$route.params.country) {
        this.country = this.$route.params.country
        this.requestData()
      }
    },
    computed: {

    },
    methods: {
      resetState () {
        this.loaded = false
        this.showError = false
      },
      requestData () {
        // promises.push(
        //   axios.get(`http://api.population.io:80/1.0/countries`)
        // )
        // promises.push(
        //   axios.get(`http://api.population.io:80/1.0/population/2018/aged/18/`)
        // )

        // axios.all(promises).then(function(results) {
        //   console.log(results)
        //   results.forEach(function(response) {
        //     console.log(response)
        //     mainObject[response.data] = response.data;
        //   })
        //   console.log(mainObject)
        // });
        // http://api.population.io:80/1.0/population/${this.period}/${date_today}/
        if (this.country === null || this.country === '' || this.country === 'undefined') {
          this.errorMessage = 'Please input a valid country'
          this.showError = true
          return
        }
        let promises = [], mainObject = {}
        var date = new Date(Date.now())
        var date_today = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
        console.log(date_today)

        this.resetState()
        this.loading = true

        axios.get(`http://api.population.io:80/1.0/population/${this.country}/${date_today}/`)
        .then(response => {
          console.log(response.data)
          this.rawData = response.data
          this.labels = [this.country]
          this.population = [response.data.total_population.population]
          this.loaded = true
          this.loading = false
        })
        .catch(err => {
          this.errorMessage = err.response.data.error
          this.showError = true
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
