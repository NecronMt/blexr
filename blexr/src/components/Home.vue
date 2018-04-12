<template>
  <div class="main-content">
    <h1>Dashboard</h1>

    <div class="data-container">
      <h3>Male to Female ratio:</h3>
      <div class="panel-content">
        <h3>Country with the highest Male to Female ratio</h3>
        <p v-html="highestMaleToFemaleRatio"></p>
      </div>

      <h3>Female to Male ratio:</h3>
      <div class="panel-content">
        <h3>Country with the highest Female to Male ratio</h3>
        <p v-html="highestFemaleToMaleRatio"></p>
      </div>
    </div>

    <div class="data-container">
      <h3>Top 10 countries with the highest population:</h3>
      <span v-if="loading" class="loading">
        <img src="../assets/loading.gif">
      </span>
      <doughnut-chart v-if="loaded" :chart-label="populationDataLabel" :chart-labels="populationTop10CountriesLabels" :chart-data="populationTop10CountriesChartData"></doughnut-chart>
    </div>

    <div class="clear"></div>

     <h3>Country Population:</h3>
    <div class="chart-tools">
      <label for="sorting">Sort by:</label>
      <select id="sorting" v-model="sorting" @change="sortChart">
        <option value="pop_asc">Population Asc</option>
        <option value="pop_desc">Population Desc</option>
        <option value="name_asc">Name Asc</option>
        <option value="name_desc">Name Desc</option>
      </select>
      <label for="bartype">View as:</label>
      <select id="bartype" v-model="bartype">
        <option value="line">Line</option>
        <option value="bar">Bar</option>
      </select>
    </div>
    <div class="chart-content">
      <h4>Chart</h4>
      <span v-if="loading" class="loading">
        <img src="../assets/loading.gif">
      </span>
      <line-chart v-if="loaded && bartype === 'line'" :chart-label="populationDataLabel" :chart-labels="populationDataLabels" :chart-data="populationDataChartData"></line-chart>
      <bar-chart v-if="loaded && bartype === 'bar'" :chart-label="populationDataLabel" :chart-labels="populationDataLabels" :chart-data="populationDataChartData"></bar-chart>
    </div>
    <div class="data-container">
      <h3>Male to Female ratio:</h3>
      <div class="panel-content">
        <h3>Area with the highest Male to Female ratio</h3>
        <p v-html="otherHighestMaleToFemaleRatio"></p>
      </div>

      <h3>Female to Male ratio:</h3>
      <div class="panel-content">
        <h3>Area with the highest Female to Male ratio</h3>
        <p v-html="otherHighestFemaleToMaleRatio"></p>
      </div>
    </div>

     <div class="data-container">
      <h3>Top 10 areas with the highest population:</h3>
      <span v-if="loading" class="loading">
        <img src="../assets/loading.gif">
      </span>
      <pie-chart v-if="loaded" :chart-label="populationDataLabel" :chart-labels="populationOtherTop10CountriesLabels" :chart-data="populationOtherTop10CountriesChartData"></pie-chart>
    </div>

    <div class="clear"></div>
    <line-chart v-if="loaded && bartype === 'line'" :chart-label="populationDataLabel" :chart-labels="otherPopulationLabels" :chart-data="otherPopulationChartData"></line-chart>
    <bar-chart v-if="loaded && bartype === 'bar'" :chart-label="populationDataLabel" :chart-labels="otherPopulationLabels" :chart-data="otherPopulationChartData"></bar-chart>
  </div>
</template>
<script>
import PieChart from '@/components/Charts/PieChart'
import LineChart from '@/components/Charts/LineChart'
import BarChart from '@/components/Charts/BarChart'
import DoughnutChart from '@/components/Charts/DoughnutChart'
import methods from '@/mixins.js'

export default {
  name: 'Home',
  mixins: [
    methods
  ],
  components: {
    LineChart,
    BarChart,
    DoughnutChart,
    PieChart
  },
  props: ['testprop'],
  data () {
    return {
      loaded: false,
      loading: false,
      showError: false,
      errorMessage: 'Error',
      sorting: 'pop_asc',
      bartype: 'line',
      // male to female and female to male ratio data
      highestMaleToFemaleRatio: '',
      highestFemaleToMaleRatio: '',
      otherHighestMaleToFemaleRatio: '',
      otherHighestFemaleToMaleRatio: '',
      // raw data to then send to charts
      populationData: [],
      otherPopulationData: [],
      top10CountriesData: [],
      topOther10CountriesData: [],
      // chart data
      populationDataLabel: 'Population exploration',
      populationDataLabels: [],
      populationDataChartData: [],
      populationTop10CountriesLabels: [],
      populationTop10CountriesChartData: [],
      populationOtherTop10CountriesLabels: [],
      populationOtherTop10CountriesChartData: [],
      otherPopulationLabels: [],
      otherPopulationChartData: []
    }
  },
  mounted () {
    this.getPopData()
    this.getOtherPopData()
  },
  computed: {
  },
  methods: {
    getPopData () {
      this.resetState()
      this.loading = true
      this.requestData().then(data => {
        this.populationData = data

        // Sorting by highest male to female ratio
        data.sort(function (dat1, dat2) { return dat2.maleToFemaleRatio - dat1.maleToFemaleRatio })
        let highestMaleToFemaleText = '<b>' +
        data[0].country +
        '</b> with a ratio of <b>' +
        data[0].maleToFemaleRatio +
        '%</b> of males vs females'
        this.highestMaleToFemaleRatio = highestMaleToFemaleText

        // Sort by highest female to male ratio
        data.sort(function (dat1, dat2) { return dat2.femaleToMaleRatio - dat1.femaleToMaleRatio })
        let highestFemaleToMaleText = '<b>' +
        data[0].country + '</b> with a ratio of <b>' +
        data[0].femaleToMaleRatio +
        '%</b> of females vs males'
        this.highestFemaleToMaleRatio = highestFemaleToMaleText

        // Sorting by highest population and just getting top 10 countries
        data.sort(function (dat1, dat2) { return dat2.population - dat1.population })
        let top10Countries = data.slice(0)
        this.top10CountriesData = top10Countries.splice(0, 10)

        // Set data for charts
        this.setTop10Chart()
        this.setPopulationChart()
      })
    },
    getOtherPopData () {
      this.resetState()
      this.loading = true
      this.requestOtherData().then(data => {
        this.otherPopulationData = data
        // Sorting by highest male to female ratio
        data.sort(function (dat1, dat2) { return dat2.maleToFemaleRatio - dat1.maleToFemaleRatio })
        let otherHighestMaleToFemaleText = '<b>' +
        data[0].country +
        '</b> with a ratio of <b>' +
        data[0].maleToFemaleRatio +
        '%</b> of males vs females'
        this.otherHighestMaleToFemaleRatio = otherHighestMaleToFemaleText

        // Sort by highest female to male ratio
        data.sort(function (dat1, dat2) { return dat2.femaleToMaleRatio - dat1.femaleToMaleRatio })
        let otherHighestFemaleToMaleText = '<b>' +
        data[0].country + '</b> with a ratio of <b>' +
        data[0].femaleToMaleRatio +
        '%</b> of females vs males'
        this.otherHighestFemaleToMaleRatio = otherHighestFemaleToMaleText

        // Sorting by highest population and just getting top 10 countries
        data.sort(function (dat1, dat2) { return dat2.population - dat1.population })
        let top10OtherCountries = data.slice(0)
        this.topOther10CountriesData = top10OtherCountries.splice(0, 10)

        // Set data for charts
        this.setOtherPopulationChart()
        this.setOtherTop10Chart()
      })
    },
    handleErrors (e) {
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
    stateDone () {
      this.loaded = true
      this.loading = false
    },
    sortChart () {
      this.resetState()
      this.loading = true
      if (this.sorting === 'pop_asc') {
        this.populationData.sort(function (pop1, pop2) { return pop2.population - pop1.population })
        this.otherPopulationData.sort(function (pop1, pop2) { return pop2.population - pop1.population })
      } else if (this.sorting === 'pop_desc') {
        this.populationData.sort(function (pop1, pop2) { return pop1.population - pop2.population })
        this.otherPopulationData.sort(function (pop1, pop2) { return pop1.population - pop2.population })
      } else if (this.sorting === 'name_asc') {
        this.populationData.sort(function (pop1, pop2) {
          if (pop1.country < pop2.country) return -1
          if (pop1.country > pop2.country) return 1
          return 0
        })
        this.otherPopulationData.sort(function (pop1, pop2) {
          if (pop1.country < pop2.country) return -1
          if (pop1.country > pop2.country) return 1
          return 0
        })
      } else if (this.sorting === 'name_desc') {
        this.populationData.sort(function (pop1, pop2) {
          if (pop1.country > pop2.country) return -1
          if (pop1.country < pop2.country) return 1
          return 0
        })
        this.otherPopulationData.sort(function (pop1, pop2) {
          if (pop1.country > pop2.country) return -1
          if (pop1.country < pop2.country) return 1
          return 0
        })
      }
      this.setPopulationChart()
      this.setOtherPopulationChart()
    },
    setPopulationChart () {
      let countryLabels = []
      let populationLabels = []
      for (let i = 0; i < this.populationData.length; i++) {
        countryLabels.push(this.populationData[i].country)
        populationLabels.push(this.populationData[i].population)
      }
      this.populationDataChartData = populationLabels
      this.populationDataLabels = countryLabels
      this.stateDone()
    },
    setOtherPopulationChart () {
      let countryLabels = []
      let populationLabels = []
      for (let i = 0; i < this.otherPopulationData.length; i++) {
        countryLabels.push(this.otherPopulationData[i].country)
        populationLabels.push(this.otherPopulationData[i].population)
      }
      this.otherPopulationChartData = populationLabels
      this.otherPopulationLabels = countryLabels
      this.stateDone()
    },
    setTop10Chart () {
      let countryLabels = []
      let populationLabels = []
      for (let i = 0; i < this.top10CountriesData.length; i++) {
        countryLabels.push(this.top10CountriesData[i].country)
        populationLabels.push(this.top10CountriesData[i].population)
      }
      this.populationTop10CountriesChartData = populationLabels
      this.populationTop10CountriesLabels = countryLabels
      this.stateDone()
    },
    setOtherTop10Chart () {
      let countryLabels = []
      let populationLabels = []
      for (let i = 0; i < this.topOther10CountriesData.length; i++) {
        countryLabels.push(this.topOther10CountriesData[i].country)
        populationLabels.push(this.topOther10CountriesData[i].population)
      }
      this.populationOtherTop10CountriesChartData = populationLabels
      this.populationOtherTop10CountriesLabels = countryLabels
      this.stateDone()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading {
  display: block;
  text-align: center;
}
.data-container {
  width:48%;
  float:left;
  text-align: left;
}
.clear {
  clear:both;
}
.data-container h3 {
  padding: 0 10px;
  text-align: center;
}
.panel-content {
  margin: 10px 0;
  padding: 1.25rem;
  background-color: #4f5566;
  border-radius: .25rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,.3);
  text-align: center;
  display: block;
}
.panel-content p {
  color: #FFFFFF;
}
.panel-content h3 {
  font-weight:bold;
  color: #f78e41;
}
.chart-tools {
  position: fixed;
  opacity: 0.9;
  right: 50px;
  top: 80px;
  background: #e6e6e6;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  padding: 10px;
}
</style>
