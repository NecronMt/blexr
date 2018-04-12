<template>
  <div class="main-content">
    <h1>Reports</h1>
    <div class="search-area">
      <label for="search">Search:</label>
      <input class="search" placeholder="Search by Country" type="search" name="search" @keyup.enter="requestInputData" v-model="country">
      <button class="search-btn" @click="requestInputData">Search</button>
    </div>
    <span v-if="loading" class="loading">
      <img src="../assets/loading.gif">
    </span>
    <div class="error-message" v-if="showError">
      <h3>Oops!</h3>
      {{ errorMessage }}
    </div>
    <div class="chart-content">
      <bar-chart v-if="loaded" :chart-label="label" :chart-labels="labels" :chart-data="population"></bar-chart>
    </div>
    <v-client-table v-if="tableLoaded" :columns="columns" :data="tableData" :options="options">
      <!-- <div slot="child_row" slot-scope="props">
        Male to Female Ratio: {{props.row.maletofemaleratio}} : {{props.row.femaletomaleratio}}
      </div> -->
    </v-client-table>
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
  import methods from '@/mixins.js'
  import {ClientTable, Event} from 'vue-tables-2';
  Vue.use(ClientTable);

  export default {
    mixins: [
      methods
    ],
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
            males: 'No. of Males'
          },
          sortable: ['country', 'population'],
          filterable: ['country'],
          customFilters: [
            {
              name:'alphabet',
              callback: function(row, query) {
                return row.population[0] == query;
              }
            }
          ]
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
        this.requestSingleData(country).then(data => {
          data.sort(function (data1, data2) { return data2.population - data1.population })
          this.tableData = data
          this.tableLoaded = true
          this.loading = false
        })
      }
      this.getData()
    },
    computed: {

    },
    methods: {
      resetState () {
        this.loaded = false
        this.showError = false
      },
      getData () {
        this.resetState()
        this.loading = true
        this.requestData().then(data => {
          data.sort(function (data1, data2) { return data2.population - data1.population })
          this.tableData = data
          this.tableLoaded = true
          this.loading = false
        })
      },
      requestInputData () {
        if (this.country === null || this.country === '' || this.country === 'undefined') {
          this.errorMessage = 'Please input a valid country'
          this.showError = true
          return
        }
        var date = new Date(Date.now())
        var date_today = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
        this.resetState()
        this.loading = true

        axios.get(`http://api.population.io:80/1.0/population/${this.country}/${date_today}/`)
        .then(response => {
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
.VueTables {
  width: 750px;
}
.VueTables__child-row-toggler--open::before {
    content: "-";
}
.VueTables__child-row-toggler--closed::before {
    content: "+";
}
.VueTables__sortable {
  cursor: pointer;
}
.glyphicon {
  height: 25px;
  width: 25px;
  float: right;
  background-size: 100%;
}
.glyphicon-sort {
  background-image: url("../assets/icons/sort.png");
}
.glyphicon-chevron-down {
  background-image: url("../assets/icons/down.svg");
}
.glyphicon-chevron-up {
  background-image: url("../assets/icons/up.svg");
}
.form-group {
  margin: 10px;
  display: inline-block;
}
.form-group label{
  vertical-align: middle;
  margin-right: 10px;
}
table {
  border-collapse: collapse;
  width: 750px;
}
table td, table th {
  border: 1px solid #DDDDDD;
  line-height: 1.45;
  padding:6px;
  margin:0;
  position: relative;
}
table tr {
  padding:0;
  margin:0;
}
table tbody tr:hover {
  background-color: #CECECE;
}
table tr:nth-of-type(odd){
  background-color: #F9F9F9;
}
.VuePagination nav {
  text-align: center;
}
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
  color: #D4447B
}
.VuePagination li.active a{
  background-color: #D4447B;
  color: #FFFFFF;
}
.VuePagination li.disabled a {
  cursor: not-allowed;
  background-color: #CECECE;
  color: #111;
}
.VuePagination li.disabled a:hover {
  background-color: #CECECE;
}
</style>
