<template>
  <div id="app">
    <app-header></app-header>
    <div class="main-content">
      <router-view/>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
export default {
  name: 'App',
  components: {
    'app-header': Header,
    'app-footer': Footer
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 0px;
}

.main-content {
  padding: 0 50px 20px;
}
.search-area{
  padding: 10px 0 20px;
}
.error-message {
  padding: 10px 0 20px;
  color: red;
}
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
  color: #d4447b;
}
a:disabled {
  color: #333333;
}
input, select, button {
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.45;
  color: #555;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}
input:focus, textarea:focus, select:focus {
  border: 1px solid #d4447b;
  box-shadow: 0 0 0 1px #d4447b;
  -webkit-box-shadow: 0 0 0 1px #d4447b;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}
button {
  cursor: pointer;
}
button:hover {
  background-color: #DDDDDD;
}
</style>
