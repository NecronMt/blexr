<template>
  <div class="Country">
    <h1 class="Country_title">{{ countryName }}</h1>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      countryName: {
        type: String
      }
    },
    computed: {
      countryInformation() {
        return `http://api.population.io:80/1.0/population/2018/${this.countryName}`
      }
    }
  }
</script>