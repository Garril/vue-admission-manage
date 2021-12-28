<template>
  <div id="create_book">
    
    <div id="pdfCentent">
      <img src="../../../assets/img/login_bg.png" alt="">
    </div>

    <el-button type="danger" @click="ExportSavePdf(htmlTitle,nowTime)">导出PDF</el-button>

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
      htmlTitle: "录取通知书",
      nowTime: "",
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