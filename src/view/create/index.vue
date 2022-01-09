<template>
    <!--  -->
    <keep-alive :max="1">
      <router-view :key="$route.path + $route.query.t"></router-view>
    </keep-alive>
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