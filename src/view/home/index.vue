<template>
  <div id="index">
    <el-container>
      <!-- 左侧导航 -->
      <el-aside width="200px">
        <NavMenu></NavMenu>
      </el-aside>
      <!-- 右侧主体部分 -->
      <el-container>
        <!-- 右侧头部 -->
        <el-header id="left_header">
          <breadcrumb></breadcrumb>
          <el-button class="exit" type="danger" @click="goBack()">退出</el-button>
        </el-header>
        <!-- 主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import NavMenu from './childComps/NavMenu.vue'
  import breadcrumb from 'components/content/breadcrumb.vue'


  export default {
    name:'index',
    components:{
      NavMenu,
      breadcrumb
    },
    data() {
      return {

      }
    },
    created() {

    },
    mounted() {
      
    },
    methods: {
      goBack() {
        this.$router.push('/login');
      },

    },

  }
</script>

<style scoped>
  #index {
    height: 100vh;
  }
  #index .el-header,
  #index .el-footer {
    background-color: #B3C0D1;
    display: flex;
    color: #333;
    text-align: center;
    line-height: 60px;
    justify-content: space-between;
  }

  
  #index .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  #index .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  #index .el-container:nth-child(5) .el-aside,
  #index .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  #index .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  
  #index .el-container {
    height: 100%;
  }

  #index .el-button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60%;
    margin-top: 14px;
  }
  #index #left_header {
    border-bottom: 1px solid rgb(31, 45, 61);
  }
</style>