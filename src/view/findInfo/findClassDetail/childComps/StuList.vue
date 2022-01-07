<template>
  <div id="stu_list">
    <el-table :data="stuList.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">          
        <el-table-column prop="sno" label="学号" width="140">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="130">
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="80">
        </el-table-column>
        <el-table-column prop="spe_name" label="专业" width="180">
        </el-table-column>
        <el-table-column prop="class_name" label="班级名称" width="180">
        </el-table-column>
        <el-table-column prop="class_no" label="班级序号" width="120">
        </el-table-column>        
        <el-table-column prop="number" label="班中序号" width="120">
        </el-table-column>
        
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="goToCreateBook(scope.$index, scope.row)">预览录取通知书</el-button>            
          </template>
        </el-table-column>        

    </el-table>
    <!-- 分页器 -->
    <div class="block" style="margin-top:15px;">
        <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
        :current-page="currentPage" 
        :page-sizes="[5,8,10,20]" 
        :page-size="pageSize" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="stuList.length">
        </el-pagination>
    </div>    
  </div>
</template>

<script>
export default {
  name:'stu_list',
  data() {
    return {
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 8, // 每页的数据条数      
    }
  },
  props:['stuList'],
  methods: {
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
        this.currentPage = val;
    },
    goToCreateBook(index,item) {
      let t = (this.currentPage-1)*(this.pageSize)+index;
      this.$store.commit('save_pathQuery',{stuInfo:item,t})
      this.$router.push({path:'/createBook',query: {
        stuInfo:item,
        t
      }})
    }
  },
  computed: {

  }
}
</script>

<style>
  #stu_list {
    margin-top: -2%;
  }
</style>