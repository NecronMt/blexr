<template>
  <div class="main-content">
    <h1>Dashboard</h1>
    <div class="Chart__content">
      <line-chart v-if="loaded" :chart-data="population" :chart-labels="labels"></line-chart>
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
  import Datepicker from 'vuejs-datepicker'
  import LineChart from '@/components/LineChart'
  import PackageInfo from '@/components/PackageInfo'
 
  export default {
    components: {
      LineChart,
      CountryInfo      
    },
    data () {
      return {
        country: null,
        countryName: '',
        loaded: false,
        loading: false, 
        population: [],       
        labels: [],        
        showError: false,        
        errorMessage: 'Error',       
        rawData: ''        
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
        this.resetState()
        this.loading = true
        axios.get(`http://api.population.io:80/1.0/population/2018/${this.country}`)
          .then(response => {
            //do stuff
          })
          .catch(err => {
            this.errorMessage = err.response.data.error
            this.showError = true
          })
        }
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
