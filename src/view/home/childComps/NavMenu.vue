<template>
  <div id="nav-menu">
      <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      router>
      <!-- 左侧导航 -->
        <el-menu-item index="/default" id="first-menu-item">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
          <!-- 导入模块 -->
          <el-submenu index="/import">
            <template slot="title">
                <i class="el-icon-s-custom"></i>
                <span>导入</span>
            </template>

            <el-menu-item-group>
                <el-menu-item index="/importStu">导入录取信息</el-menu-item>
                <el-menu-item index="/importClass">导入班级设置</el-menu-item>
            </el-menu-item-group> 
          </el-submenu>

          <!-- 查询模块 -->
          <el-submenu index="/find">
            <template slot="title">
                <i class="el-icon-s-custom"></i>
                <span>查询和修改</span>
            </template>

            <el-menu-item-group>
                <el-menu-item index="/findStu">学生信息查询</el-menu-item>
                <el-menu-item index="/findClassDetail">查询分班信息</el-menu-item>
                <el-menu-item index="/findAllClassSitu">统计信息</el-menu-item>
                <el-menu-item index="/findRate">人数占比统计</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <!-- 生成录取通知书模块 -->
          <el-submenu index="/create">
            <template slot="title">
                <i class="el-icon-s-custom"></i>
                <span>生成</span>
            </template>

            <el-menu-item-group>
                <el-menu-item @click="jumpToCreate()" index="/createBook">生成录取通知书</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

      </el-menu>

  </div>
</template>

<script>
export default {
  name:'NavMenu',
  data() {
    return {

    }
  },
  methods: {
    //如果在其他组件有预览过录取通知书，就会有query值，那么就跳到之前预览的通知书，而不是空白页面
    jumpToCreate() {
      let query = this.$store.state.pathQuery;
      if(query!=null) {
        this.$router.push({
          path:'/createBook',
          query
        })
      }
    }
  },
}
</script>

<style>
  #nav-menu {
    height: 100%;
    background-color: rgb(51, 63, 81);
  }
  .el-submenu__title {
    text-align: left;
    background-color: rgb(51, 63, 81);
    color: rgb(244, 244, 245);
  }
  .el-menu-item {
    text-align: left;
    background-color: rgb(31, 45, 61);
    color: rgb(191, 203, 217);
  }
  .el-menu-item-group__title {
    padding: 0px;
  }
  #first-menu-item {
    background-color: rgb(51, 63, 81);
    color: rgb(244, 244, 245);
    width: 200px;
  }

  .el-menu-item.is-active {
    background-color: rgb(0, 21, 40);
    color: rgb(64, 158, 255);
  }
  .el-menu-item:hover {
    color: rgb(64, 158, 255);
    background-color: rgb(0, 21, 40);
  }
  .el-submenu__title:hover {
    color: rgb(64, 158, 255);
    background: rgb(0, 21, 40);
  }
  li.el-menu-item,.el-submenu__title {
    width: 200px;
  }
</style>