<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  },
  methods: {
    
  }
}
</script>

<style>
  @import 'assets/css/base.css';
  #app {
    height: 100vh;
  }
  .el-main {
    display: flex !important;
    line-height: 30px !important;
  }  
</style>
