<template>
  <div class="main-content">
    <h1>Dashboard</h1>

    <div class="data">
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
          <doughnut-chart v-if="loaded" :chart-label="populationDataLabel" :chart-labels="populationTop10CountriesLabels" :chart-data="populationTop10CountriesChartData"></doughnut-chart>
        </div>
      <div class="error-message" v-if="showError">
        <h3>Oops!</h3>
        {{ errorMessage }}
      </div>

      <div class="chart-content">
        <h3>Country Population:</h3>
        <label for="sorting">Sort by:</label>
        <select id="sorting" v-model="sorting" @change="sortChart">
          <option value="pop_asc">Population Asc</option>
          <option value="pop_desc">Population Desc</option>
          <option value="name_asc">Name Asc</option>
          <option value="name_desc">Name Desc</option>
        </select>
        <label for="bartype">View as:</label>
        <select id="bartype" v-model="bartype" @change="setBarType">
          <option value="line">Line</option>
          <option value="bar">Bar</option>
        </select>
        <h4>Chart</h4>
        <line-chart v-if="loaded && bartype === 'line'" :chart-label="populationDataLabel" :chart-labels="populationDataLabels" :chart-data="populationDataChartData"></line-chart>
        <bar-chart v-if="loaded && bartype === 'bar'" :chart-label="populationDataLabel" :chart-labels="populationDataLabels" :chart-data="populationDataChartData"></bar-chart>
      </div>
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
        sorting: 'pop_asc',
        bartype: 'line',
        populationData: [],
        top10CountriesData: [],
        populationDataLabel: '',
        populationDataLabels: [],
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
      setBarType () {
        console.log(this.bartype)
      },
      sortChart () {
        this.resetState()
        this.loading = true
        if (this.sorting === 'pop_asc') {
          this.populationData.sort(function (pop1, pop2) { return pop2.population - pop1.population })
        }
        else if (this.sorting === 'pop_desc') {
          this.populationData.sort(function (pop1, pop2) { return pop1.population - pop2.population })
        }
        else if (this.sorting === 'name_asc') {
          this.populationData.sort(function (pop1, pop2) {
            if(pop1.country < pop2.country) return -1;
            if(pop1.country > pop2.country) return 1;
            return 0;
          })
        }
        else if (this.sorting === 'name_desc') {
          this.populationData.sort(function (pop1, pop2) {
            if(pop1.country > pop2.country) return -1;
            if(pop1.country < pop2.country) return 1;
            return 0;
          })
        }
        console.log(this.populationData)
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
          let top10Countries = countryDataList.slice(0)
          this.top10CountriesData = top10Countries.splice(0, 10)

          this.settop10Chart()
          this.setPopulationChart()
          console.log(this.populationData)
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
.data {
  text-align:left;
}
.data-container {
  width:48%;
  float:left;
}

.data-container h3 {
  padding: 0 10px;
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
</style>
