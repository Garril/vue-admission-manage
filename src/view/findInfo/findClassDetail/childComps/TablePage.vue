<template>
  <div id="table_page">
    <!-- 表格 -->
    <el-table :data="classInfo.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">          
        <el-table-column prop="dep_name" label="学院" width="200">
        </el-table-column>
        <el-table-column prop="spe_name" label="专业" width="200">
        </el-table-column>
        <el-table-column prop="class_no" label="班级序号" width="120">
        </el-table-column>        
        <el-table-column prop="class_name" label="班级名称" width="200">
        </el-table-column>
        <el-table-column prop="boy" label="男生人数" width="120">
        </el-table-column>
        <el-table-column prop="girl" label="女生人数" width="120">
        </el-table-column>
        <el-table-column prop="year" label="建班年份" width="100">
        </el-table-column>
        <!-- 修改班级名称 -->
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>

    </el-table>
    <!-- 分页器 -->
    <div class="block" style="margin-top:15px;">
        <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
        :current-page="currentPage" 
        :page-sizes="[5,10,20]" 
        :page-size="pageSize" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="classInfo.length">
        </el-pagination>
    </div>

    <el-dialog title="修改班级名称" :visible.sync="showSign" center>

      <el-form label-width="120px" id="new_sno_form">
        <el-form-item label="班级名称" label-width="100px">
          <el-input v-model="new_name" autocomplete="off" :placeholder="reviseClass.class_name"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" id="newsno_form_btns">
        <el-button @click="showSign = false">取 消</el-button>
        <el-button type="primary" @click="reviseClassName()">确 定</el-button>
      </div>
    </el-dialog> 

  </div>  
</template>

<script>
import { reviseClassById } from 'network/revise/revise.js'

export default {
  name:'table_page',
  data() {
    return {
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 8, // 每页的数据条数
      showSign:false,
      new_name:"",
      reviseClass:{},
      index:0
    }
  },
  props: ['classInfo'],
  methods: {
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.currentPage = 1;
        this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
    },
    handleEdit(index,item) {
      this.showSign = true;
      this.index = index;
      this.reviseClass = item;
    },
    reviseClassName() {
      this.showSign = false;
      if(this.new_name =='') {
        alert("修改失败，不能为空");
      } else {
        reviseClassById(this.new_name,this.reviseClass.id).then(res => {
          if(res.status =='200') {
            this.classInfo[this.index].class_name = this.new_name;
            alert("修改成功!");
          } else {
            alert("修改失败!");
          }
        })        
      }
    }

  }
}
</script>

<style>
  #new_sno_form .el-form-item__label {
    color: rgb(19, 22, 18);
  }
  #table_page #new_sno_form {
    position: absolute;
    height: 20px;
    left:30%;
  }
  #table_page .el-dialog__header{
    margin-bottom: 40px;
  }
  #table_page .el-dialog__footer {
    margin-top: 20px;
    padding-bottom: 30px;
  }
  #table_page .el-dialog__footer button:first-of-type {
    margin-right: 15px;
  }  

</style>