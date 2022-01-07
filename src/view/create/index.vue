<template>
    <!--  -->
    <router-view :key="$route.path + $route.query.t"></router-view>
</template>

<script>
export default {
  name:"",
  data() {
    return {
      
    }
  },
  methods: {
    
  },
}
</script>

<style>

</style>