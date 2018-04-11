<template>
  <div class="main-content">
    <h1>Dashboard</h1>

    <select v-model="sorting" @change="sortChart">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>

    <h3>Country with the highest Male to Female ratio</h3>
    <p v-html="highestMaleToFemaleRatio"></p>
    <h3>Country with the highest Female to Male ratio</h3>
    <p v-html="highestFemaleToMaleRatio"></p>
    <div class="error-message" v-if="showError">
      <h3>Oops!</h3>
      {{ errorMessage }}
    </div>

    <div class="chart-content">
      <h3>Country Population</h3>
      <line-chart v-if="loaded" :chart-label="populationDataLabel" :chart-labels="populationDataLabels" :chart-tooltip="populationDataTooltip" :chart-data="populationDataChartData"></line-chart>
      <bar-chart v-if="loaded" :chart-label="populationDataLabel" :chart-labels="populationDataLabels" :chart-tooltip="populationDataTooltip" :chart-data="populationDataChartData"></bar-chart>
      <h3>Top 10 countries with the highest population:</h3>
      <doughnut-chart v-if="loaded" :chart-label="populationDataLabel" :chart-labels="populationTop10CountriesLabels" :chart-tooltip="populationDataTooltip" :chart-data="populationTop10CountriesChartData"></doughnut-chart>
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
  import LineChart from '@/components/Charts/LineChart'
  import BarChart from '@/components/Charts/BarChart'
  import DoughnutChart from '@/components/Charts/DoughnutChart'

  import countryData from '@/data/world.js'

  let date = new Date(Date.now());
  let progress = document.getElementById('animationProgress');
  const countryArray = countryData.countries;
  const othercountryArray = countryData.misccountrydata;

  export default {
    components: {
      LineChart,
      BarChart,
      DoughnutChart
    },
    props: ['testprop'],
    data () {
      return {
        loaded: false,
        loading: false,
        showError: false,
        errorMessage: 'Error',
        sorting: 'asc',
        populationData: [],
        top10CountriesData: [],
        populationDataLabel: '',
        populationDataLabels: [],
        populationDataTooltip: '',
        populationDataChartData: [],
        highestMaleToFemaleRatio: '',
        highestFemaleToMaleRatio: '',
        populationTop10CountriesLabels: [],
        populationTop10CountriesChartData: [],
        selectedData: ''
      }
    },
    mounted () {
      // this.requestPopulationData()
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
          this.populationData.sort(function (pop1, pop2) { return pop1.population - pop2.population })
        }
        else {
          this.populationData.sort(function (pop1, pop2) { return pop2.population - pop1.population })
        }
        this.setPopulationChart()
      },
      setPopulationChart () {
        let countryLabels = []
        let populationLabels = []
        for (let i = 0; i < this.populationData.length; i++) {
            countryLabels.push(this.populationData[i].country);
            populationLabels.push(this.populationData[i].population);
        }
        // console.log(countryLabels)
        // console.log(populationLabels)
        this.populationDataChartData = populationLabels
        this.populationDataLabels = countryLabels
        this.populationDataLabel = 'Population exploration'
        this.populationDataTooltip = 'Hi'
        this.loaded = true
        this.loading = false
      },
      settop10Chart () {
        let countryLabels = []
        let populationLabels = []
        for (let i = 0; i < this.top10CountriesData.length; i++) {
            countryLabels.push(this.top10CountriesData[i].country);
            populationLabels.push(this.top10CountriesData[i].population);
        }
        // console.log(countryLabels)
        // console.log(populationLabels)
        this.populationTop10CountriesChartData = populationLabels
        this.populationTop10CountriesLabels = countryLabels
        this.loaded = true
        this.loading = false
      },
      requestData () {
        let year_today = date.getFullYear()
        let countryPopulationPromises = []
        countryArray.forEach(function (country) {
          countryPopulationPromises.push(axios.get(`http://api.population.io:80/1.0/population/${year_today}/${country}`))
        });

        axios.all(countryPopulationPromises).then((results) => {
          let countryDataList = []
          results.forEach(function(response, index) {
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
          //sorting by highest male to female ratio
          countryDataList.sort(function (rat1, rat2) { return rat2.maletofemaleratio - rat1.maletofemaleratio })
          let highestMaleToFemaleText = '<b>'
          + countryDataList[0].country
          + '</b> with a ratio of <b>'
          + countryDataList[0].maletofemaleratio
          + '%</b> of males vs females'
          this.highestMaleToFemaleRatio = highestMaleToFemaleText

          countryDataList.sort(function (rat1, rat2) { return rat2.femaletomaleratio - rat1.femaletomaleratio })
          let highestFemaleToMaleText = '<b>'
          + countryDataList[0].country
          + '</b> with a ratio of <b>'
          + countryDataList[0].femaletomaleratio
          + '%</b> of females vs males'
          this.highestFemaleToMaleRatio = highestFemaleToMaleText

          // Sorting by highest population
          countryDataList.sort(function (rat1, rat2) { return rat2.population - rat1.population })
          this.populationData = countryDataList
          console.log(this.populationData)
          let top10Countries = countryDataList
          this.top10CountriesData = top10Countries.splice(10, 10);
          console.log(this.top10CountriesData)
          this.settop10Chart()
          this.setPopulationChart()
          console.log('end')
          // POPULATE CHART HERE
          //this.setPopulationChart()
        });

      },
      requestPopulationData () {
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
        let countryPopulationPromises = []
        let date_today = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()

        console.log(date_today)

        this.resetState()
        this.loading = true

        countryArray.forEach(function (country) {
          countryPopulationPromises.push(axios.get(`http://api.population.io:80/1.0/population/${country}/${date_today}`))
        });

        // othercountryArray.forEach(function (country) {
        //   othercountryPopulationPromises.push(axios.get(`http://api.population.io:80/1.0/population/${country}/${date_today}`))
        // });

        axios.all(countryPopulationPromises).then((results) => {
          let countryDataList = []
          results.forEach(function(response, index) {
            let countryObject = {
              country: countryArray[index],
              population: response.data.total_population.population
            }
            countryDataList.push(countryObject)
          })
          countryDataList.sort(function (pop1, pop2) { return pop1.population - pop2.population })

          this.populationData = countryDataList
          console.log(countryDataList)
          // POPULATE CHART HERE
          this.setPopulationChart()
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
