<template>
  <div class="main-content">
    <h1>Reports</h1>
    <v-client-table v-if="tableLoaded" :columns="columns" :data="tableData" :options="options"></v-client-table>
    <div class="search-area">
      <input class="search" placeholder="Search by Country" type="search" name="search" @keyup.enter="requestData" v-model="country">
      <button class="search-btn" @click="requestData">Search</button>
    </div>

    <div class="error-message" v-if="showError">
      <h3>Oops!</h3>
      {{ errorMessage }}
    </div>

    <div class="chart-content">
      <bar-chart v-if="loaded" :chart-label="label" :chart-labels="labels" :chart-data="population"></bar-chart>
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
  import Vue from 'vue'
  import axios from 'axios'
  import LineChart from '@/components/Charts/LineChart'
  import BarChart from '@/components/Charts/BarChart'
  import countryData from '@/data/world.js'
  import {ClientTable} from 'vue-tables-2';
  Vue.use(ClientTable);
  let date = new Date(Date.now());
  const countryArray = countryData.countries;
  const othercountryArray = countryData.misccountrydata;
  export default {
    components: {
      LineChart,
      BarChart
    },
    data () {
      return {
        columns: ['country', 'population', 'females', 'males'],
        tableData: [],
        options: {
          headings: {
            country: 'Country Name',
            population: 'Population',
            females: 'No. of Females',
            males: 'No. of Males',
            maletofemaleratio: 'Male to Female Ratio',
            femaletomaleratio: 'Female to Male Ratio'
          },
          sortable: ['country'],
          filterable: ['country']
        },
        country: null,
        loaded: false,
        tableLoaded: false,
        loading: false,
        showError: false,
        errorMessage: 'Error',
        label: '',
        labels: [],
        population: [],
        populationData: []
      }
    },
    mounted () {
      if (this.$route.params.country) {
        this.country = this.$route.params.country
        this.requestData()
      }
      this.requestFullData()
    },
    computed: {

    },
    methods: {
      resetState () {
        this.loaded = false
        this.showError = false
      },
      requestFullData () {
        this.resetState()
        this.loading = true
        let year_today = date.getFullYear()
        let countryPopulationPromises = []
        countryArray.forEach(function (country) {
          countryPopulationPromises.push(axios.get(`http://api.population.io:80/1.0/population/${year_today}/${country}`))
        });

        axios.all(countryPopulationPromises).then((results) => {
          let countryDataList = []
          results.forEach(function(response, index) {
            // Populate data for each country
            let females = response.data.map(entry => entry.females)
            let males = response.data.map(entry => entry.males)
            let total = response.data.map(entry => entry.total)
            let femalePopulation = females.reduce((a, b) => a + b, 0);
            let malePopulation = males.reduce((a, b) => a + b, 0);
            let totalPopulation = total.reduce((a, b) => a + b, 0);

            let countryObject = {
              country: countryArray[index],
              population: totalPopulation,
              females: femalePopulation,
              males: malePopulation,
              maletofemaleratio: ((malePopulation / femalePopulation) * 100).toFixed(2),
              femaletomaleratio: ((femalePopulation / malePopulation) * 100).toFixed(2)
            }
            countryDataList.push(countryObject)
          })
          countryDataList.sort(function (data1, data2) { return data2.population - data1.population })
          this.tableData = countryDataList
          console.log(this.tableData)
          this.tableLoaded = true
          this.loading = false
        });
      },
      requestData () {
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

<style>
.VuePagination li {
  margin: 0;
}
.VuePagination li:first-child>a {
  margin-left: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.VuePagination li:last-child>a {
  margin-right: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.VuePagination li a{
  margin-left: -1px;
  padding: 6px 12px;
  line-height: 1.45;
  float: left;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #EEEEEE;
  border: 1px solid #DDDDDD;
}
.VuePagination li a:hover {
  background-color: #FEFEFE;
}
</style>
