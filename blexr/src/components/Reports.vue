<template>
  <div class="main-content">
    <h1>Reports</h1>
    <div class="error-message" v-if="showError">
      {{ errorMessage }}
    </div>
    <input class="search" placeholder="Search by Country" type="search" name="search" @keyup.enter="requestData" v-model="country">
    <button class="search-btn" @click="requestData">Search</button>
    <div class="chart-content">
      <line-chart v-if="loaded" :chart-data="population" :chart-labels="labels"></line-chart>
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
  import LineChart from '@/components/LineChart'
  import CountryInfo from '@/components/CountryInfo'

  export default {
    components: {
      LineChart,
      CountryInfo
    },
    data () {
      return {
        country: null,
        loaded: false,
        loading: false,
        showError: false,
        errorMessage: 'Error',
        rawData: '',
        labels: [],
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
        if (this.country === null || this.country === '' || this.country === 'undefined') {
          this.showError = true
          return
        }
        let promises = [], mainObject = {}
        var date = new Date(Date.now())
        var date_today = ''
        date_today += date.getFullYear() + "-"
        date_today += (date.getMonth()) + "-"
        date_today += date.getDate()
        console.log(date_today)

        this.resetState()
        this.loading = true
        // axios.get(`https://api.npmjs.org/downloads/range/${this.period}/${this.package}`)
        // http://api.population.io:80/1.0/population/${this.period}/${date_today}/

        axios.get(`http://api.population.io:80/1.0/population/${this.period}/${date_today}/`)
        .then(response => {
          console.log(response.data)
          this.rawData = response.data
          this.population = response.data.map(entry => entry.total)
          console.log(this.population)
          this.labels = response.data.map(entry => entry.country)
          console.log(this.labels)

          this.loaded = true
          this.loading = false
        })
        .catch(err => {
          this.errorMessage = err.response.data.error
          this.showError = true
        })

        promises.push(
          axios.get(`http://api.population.io:80/1.0/countries`)
        )
        promises.push(
          axios.get(`http://api.population.io:80/1.0/population/2018/aged/18/`)
        )

        axios.all(promises).then(function(results) {
          console.log(results)
          results.forEach(function(response) {
            console.log(response)
            mainObject[response.data] = response.data;
          })
          console.log(mainObject)
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
