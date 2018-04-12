import axios from 'axios'
import countryData from '@/data/world.js'
var date = new Date(Date.now())
const countryArray = countryData.countries
const otherCountryArray = countryData.miscCountryData

var methods = {
  methods: {
    requestData () {
      let yearToday = date.getFullYear()
      let countryPopulationPromises = []
      countryArray.forEach(function (country) {
        countryPopulationPromises.push(axios.get(`http://api.population.io:80/1.0/population/${yearToday}/${country}`))
      })
      return axios.all(countryPopulationPromises).then((results) => {
        let countryDataList = []
        results.forEach(function (response, index) {
          let total = response.data.map(entry => entry.total)
          let females = response.data.map(entry => entry.females)
          let males = response.data.map(entry => entry.males)

          let totalPopulation = total.reduce((a, b) => a + b, 0)
          let femalePopulation = females.reduce((a, b) => a + b, 0)
          let malePopulation = males.reduce((a, b) => a + b, 0)

          let formattedPopulation = new Intl.NumberFormat('en-IR').format(totalPopulation)
          let formattedFemales = new Intl.NumberFormat('en-IR').format(femalePopulation)
          let formattedMales = new Intl.NumberFormat('en-IR').format(malePopulation)

          let countryObject = {
            country: countryArray[index],
            population: totalPopulation,
            females: femalePopulation,
            males: malePopulation,
            formtPopulation: formattedPopulation,
            formtFemales: formattedFemales,
            formtMales: formattedMales,
            maleToFemaleRatio: ((malePopulation / femalePopulation) * 100).toFixed(2),
            femaleToMaleRatio: ((femalePopulation / malePopulation) * 100).toFixed(2)
          }
          countryDataList.push(countryObject)
        })
        return countryDataList
      })
    },
    requestOtherData () {
      let yearToday = date.getFullYear()
      let countryPopulationPromises = []
      otherCountryArray.forEach(function (country) {
        countryPopulationPromises.push(axios.get(`http://api.population.io:80/1.0/population/${yearToday}/${country}`))
      })
      return axios.all(countryPopulationPromises).then((results) => {
        let otherCountryDataList = []
        results.forEach(function (response, index) {
          let total = response.data.map(entry => entry.total)
          let females = response.data.map(entry => entry.females)
          let males = response.data.map(entry => entry.males)

          let totalPopulation = total.reduce((a, b) => a + b, 0)
          let femalePopulation = females.reduce((a, b) => a + b, 0)
          let malePopulation = males.reduce((a, b) => a + b, 0)

          let formattedPopulation = new Intl.NumberFormat('en-IR').format(totalPopulation)
          let formattedFemales = new Intl.NumberFormat('en-IR').format(femalePopulation)
          let formattedMales = new Intl.NumberFormat('en-IR').format(malePopulation)

          let countryObject = {
            country: otherCountryArray[index],
            population: totalPopulation,
            females: femalePopulation,
            males: malePopulation,
            formtPopulation: formattedPopulation,
            formtFemales: formattedFemales,
            formtMales: formattedMales,
            maleToFemaleRatio: ((malePopulation / femalePopulation) * 100).toFixed(2),
            femaleToMaleRatio: ((femalePopulation / malePopulation) * 100).toFixed(2)
          }
          otherCountryDataList.push(countryObject)
        })
        return otherCountryDataList
      })
    }
  }
}

export default methods
