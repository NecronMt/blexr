<template>
  <div class="header">
    <ul>
      <li>
        <img src="../assets/white-logo.svg" class="logo">
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
  name: 'SiteHeader',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  background-color: #111111;
  border-bottom: 1px solid #F5F5F5;
  background-image: -webkit-linear-gradient(to top right, #f78e41 0%, #d2407e 100%);
  background-image: -moz-linear-gradient(to top right, #f78e41 0%, #d2407e 100%);
  background-image: -o-linear-gradient(to top right, #f78e41 0%, #d2407e 100%);
  background-image: linear-gradient(to top right, #f78e41 0%, #d2407e 100%);
  background-image: -moz-linear-gradient( 90deg, rgb(251,179,75) 0%, rgb(246,137,53) 25%, rgb(235,80,86) 50%, rgb(225,60,112) 75%, rgb(193,65,138) 100%);
  background-image: -webkit-linear-gradient( 90deg, rgb(251,179,75) 0%, rgb(246,137,53) 25%, rgb(235,80,86) 50%, rgb(225,60,112) 75%, rgb(193,65,138) 100%);
  background-image: -ms-linear-gradient( 90deg, rgb(251,179,75) 0%, rgb(246,137,53) 25%, rgb(235,80,86) 50%, rgb(225,60,112) 75%, rgb(193,65,138) 100%);
  padding: 10px 50px 10px;
}
.logo {
  width: 150px;
  height: auto;
}
.router-link-exact-active {
  padding:10px;
  background-color: #111111;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
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
  vertical-align: middle;
}
a {
  color: #FFFFFF;
  text-decoration: none;
  font-weight: bold;
  padding: 10px;
}
a:hover {
  text-decoration: underline;
}
</style>
