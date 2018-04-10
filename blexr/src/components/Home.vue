<template>
  <div class="main-content">
    <h1>Dashboard</h1>
    <select v-model="sorting" @change="sortChart">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
    <div class="error-message" v-if="showError">
      <h3>Oops!</h3>
      {{ errorMessage }}
    </div>
    <div class="chart-content">
      <h3>World Population</h3>
      <line-chart v-if="loaded" :chart-label="label" :chart-labels="labels" :chart-tooltip="tooltip" :chart-data="population"></line-chart>
      <bar-chart v-if="loaded" :chart-label="label" :chart-labels="labels" :chart-tooltip="tooltip" :chart-data="population"></bar-chart>
      <p>{{ selectedData }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
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
  import BarChart from '@/components/BarChart'
  import countryData from '@/data/world.js'

  export default {
    components: {
      LineChart,
      BarChart
    },
    props: ['testprop'],
    data () {
      return {
        loaded: false,
        loading: false,
        showError: false,
        errorMessage: 'Error',
        sorting: 'asc',
        country: null,
        countryName: '',
        countryFullData: [],
        label: '',
        labels: [],
        tooltip: '',
        population: [],
        selectedData: {}
      }
    },
    mounted () {
      this.requestData()
    },
    computed: {

    },
    methods: {
      handleErrors(e) {
        if (!e.response.ok) {
          this.errorMessage = e.response.statusText
          this.showError = true
        }
        return e.response
      },
      resetState () {
        this.loaded = false
        this.showError = false
      },
      chartClicked (event) {
        console.log(event)
      },
      sortChart () {
        this.resetState()
        this.loading = true
        if (this.sorting === 'asc') {
          this.countryFullData.sort(function (pop1, pop2) { return pop1.population - pop2.population })
        }
        else {
          this.countryFullData.sort(function (pop1, pop2) { return pop2.population - pop1.population })
        }
        this.populateChart()
      },
      populateChart () {
        let countryLabels = []
        let populationLabels = []
        for (let i = 0; i < this.countryFullData.length; i++) {
            countryLabels.push(this.countryFullData[i].country);
            populationLabels.push(this.countryFullData[i].population);
        }
        console.log(countryLabels)
        console.log(populationLabels)
        this.population = populationLabels
        this.labels = countryLabels
        this.tooltip = 'Hi'
        this.label = 'Population exploration'
        this.loaded = true
        this.loading = false
      },
      requestData () {
        // http://api.population.io:80/1.0/population/2018/Brazil/
        // axios.get(`https://api.npmjs.org/downloads/range/${this.period}/${this.package}`)
        // http://api.population.io:80/1.0/population/Brazil/2018-04-22/

        // const countriesPromise = axios(`http://api.population.io:80/1.0/countries`)
        // const populationbyagePromise = axios(`http://api.population.io:80/1.0/population/2018/aged/18/`)

        // // await all three promises to come back and destructure the result into their own variables
        // const [countries, populationbyage] = await Promise.all([
        //   countriesPromise,
        //   populationbyagePromise
        // ])
        // `http://api.population.io:80/1.0/population/`, {params:  {country: country, date: date_today}}
        // countryObject[country] = axios.get(`http://api.population.io:80/1.0/population/${country}/${date_today}`)

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
        // const go = async () => {
        //   console.log('async')
        // }
        // go();
        // FUNCTIONAL CHART
        // axios.get(`http://api.population.io:80/1.0/population/2018/aged/18/`)
        // .then(response => {
        //   // console.log(response.data)
        //   // console.log(this.labels)
        //   // console.log(this.population)
        //   this.population = response.data.map(entry => entry.total)
        //   this.labels = response.data.map(entry => entry.country)
        //   this.loaded = true
        //   this.loading = false
        // })
        // .catch(err => {
        //   this.errorMessage = err.response.data.error
        //   this.showError = true
        // })

        const countryArray = countryData.countries
        const othercountryArray = countryData.misccountrydata
        let promises = []
        let date = new Date(Date.now())
        let date_today = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
        console.log(date_today)

        this.resetState()
        this.loading = true

        countryArray.forEach(function (country) {
          promises.push(axios.get(`http://api.population.io:80/1.0/population/${country}/${date_today}`))
        });

        axios.all(promises).then((results) => {
          let countryDataList = []
          results.forEach(function(response, index) {
            let countryObject = {
              country: countryArray[index],
              population: response.data.total_population.population
            }
            countryDataList.push(countryObject)
          })
          countryDataList.sort(function (pop1, pop2) { return pop1.population - pop2.population })

          this.countryFullData = countryDataList
          // POPULATE CHART HERE
          this.populateChart()
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
