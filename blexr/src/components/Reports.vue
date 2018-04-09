<template>
  <div class="reports">
    <ul>
      <li>
        <h3>Blexr</h3>
      </li>
      <li>
        <router-link to="/">Dashboard</router-link>
        </li>
      <li>
        <router-link to="/reports">Reports</router-link>
      </li>
    </ul>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  background-image: -webkit-linear-gradient(to top right, #f78e41 0%, #d2407e 100%);
  background-image: -moz-linear-gradient(to top right, #f78e41 0%, #d2407e 100%);
  background-image: -o-linear-gradient(to top right, #f78e41 0%, #d2407e 100%);
  background-image: linear-gradient(to top right, #f78e41 0%, #d2407e 100%);
  background-image: -moz-linear-gradient( 90deg, rgb(251,179,75) 0%, rgb(246,137,53) 25%, rgb(235,80,86) 50%, rgb(225,60,112) 75%, rgb(193,65,138) 100%);
  background-image: -webkit-linear-gradient( 90deg, rgb(251,179,75) 0%, rgb(246,137,53) 25%, rgb(235,80,86) 50%, rgb(225,60,112) 75%, rgb(193,65,138) 100%);
  background-image: -ms-linear-gradient( 90deg, rgb(251,179,75) 0%, rgb(246,137,53) 25%, rgb(235,80,86) 50%, rgb(225,60,112) 75%, rgb(193,65,138) 100%);
  border-bottom: 1px solid #F5F5F5;
  padding-left: 50px;
}
h1, h2, h3 {
  font-weight: bold;
  color: #F5F5F5;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #FFFFFF;
}
</style>
