<template>
  <div id="create_book">

  </div>
</template>

<script>
export default {
// html 取参  $route.query.stuInfo
// script 取参  this.$route.query.stuInfo
  name:"",
  data() {
    return {
      stuInfo:{},

    }
  },
  methods: {

  },
  created() {
    this.stuInfo = this.$route.query.stuInfo;
    console.log(this.stuInfo)
  }
}
</script>

<style>

</style>