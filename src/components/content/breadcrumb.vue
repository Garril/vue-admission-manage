<template>
  <el-breadcrumb separator="/">

    <el-breadcrumb-item v-for="v in lists" :key="v.path">
      <router-link :to="v.path">{{v.meta.title}}</router-link>
    </el-breadcrumb-item>

  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      lists:[]  
    }
  },
  methods: {
    getBreadcrumb(matched) {
      if( matched.length && matched[1].path == '/default') {
        matched = [ {path:'/index',name:'index',meta:{title:'首页'} } ];
      };
      this.lists = matched;
    }
  },
  mounted() {
    this.getBreadcrumb(this.$route.matched);
  },
  watch: {
    $route(to,from) {
      this.getBreadcrumb(to.matched);
    }
  }

}
</script>

<style>
  .el-breadcrumb {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>