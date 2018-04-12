<template>
  <div class="footer">
    <p>{{ msg }}</p>
  </div>
</template>

<script>
export default {
  name: 'SiteFooter',
  data () {
    return {
      msg: 'Francesco Dimech'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer {
  background-color: #111111;
  border-bottom: 1px solid #F5F5F5;
  background-image: -webkit-linear-gradient(to top right, #d2407e 0%, #f78e41 100%);
  background-image: -moz-linear-gradient(to top right, #d2407e 0%, #f78e41 100%);
  background-image: -o-linear-gradient(to top right, #d2407e 0%, #f78e41 100%);
  background-image: linear-gradient(to top right, #d2407e 0%, #f78e41 100%);
  background-image: -moz-linear-gradient( 90deg, rgb(251,179,75) 0%, rgb(246,137,53) 25%, rgb(235,80,86) 50%, rgb(225,60,112) 75%, rgb(193,65,138) 100%);
  background-image: -webkit-linear-gradient( 90deg, rgb(251,179,75) 0%, rgb(246,137,53) 25%, rgb(235,80,86) 50%, rgb(225,60,112) 75%, rgb(193,65,138) 100%);
  background-image: -ms-linear-gradient( 90deg, rgb(251,179,75) 0%, rgb(246,137,53) 25%, rgb(235,80,86) 50%, rgb(225,60,112) 75%, rgb(193,65,138) 100%);
  padding: 10px 0;
}

.footer p {
  text-align:center;
  color: #FFFFFF;
}
</style>
