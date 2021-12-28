<template>
  <div id="find_stu">
    <div class="find_btns">
      <el-button size="small" @click="chooseImport(true)">学号查询</el-button>
      <el-button size="small" @click="chooseImport(false)">录取号查询</el-button>
    </div>

    <el-form ref="form" label-width="80px" size="small">

      <el-form-item label="学号" v-if="sign">
        <el-input v-model="sno" placeholder="请输入学号"></el-input>
      </el-form-item>

      <el-form-item label="录取号" v-else>
        <el-input v-model="sno" placeholder="请输入录取号"></el-input>
      </el-form-item>      

      <el-form-item class="el_import_btns">
        <el-button type="primary" size="small" @click="onSubmit">查询信息</el-button>
      </el-form-item>
      
    </el-form>

    <el-table
      :data="stuInfo.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%">

      <el-table-column
        prop="id"
        label="录取号"
        width="110">
      </el-table-column>

      <el-table-column
        prop="sno"
        label="学号"
        width="110">
      </el-table-column>

      <el-table-column
        prop="degree"
        label="年级"
        width="60">
      </el-table-column>

      <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column>      

      <el-table-column
        prop="number"
        label="班中序号"
        width="80">
      </el-table-column>

      <el-table-column
        prop="sex"
        label="性别"
        width="80">
      </el-table-column>

      <el-table-column
        prop="dep_name"
        label="学院"
        width="160">
      </el-table-column>

      <el-table-column
        prop="spe_name"
        label="专业"
        width="160">
      </el-table-column>

      <el-table-column
        prop="class_name"
        label="班级名称"
        width="180">
      </el-table-column>
      
      <el-table-column
        prop="year"
        label="入学年份"
        width="80">
      </el-table-column>
      
      <el-table-column label="操作" width="150" v-if="sign">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        :total="stuInfo.length">
        </el-pagination>
    </div>  

    <el-dialog title="修改学号" :visible.sync="dialogFormVisible" center>

      <el-form :model="form" label-width="80px" id="new_sno_form">
        <el-form-item label="新学号" label-width="120px">
          <el-input v-model="form.sno" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" id="newsno_form_btns">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateByNewSno()">确 定</el-button>
      </div>
    </el-dialog>    

  </div>
</template>

<script>
import { findStu,finAllStu } from 'network/find/findStu.js'
import { reviseStuBySno } from 'network/revise/revise.js'
import { deleteStuBySno } from 'network/delete/delete.js'



export default {
  name:'',
  data() {
    return {
      sign:true,
      sno:'',
      stuInfo:[],
      dialogFormVisible:false,
      form: {
        sno:""
      },
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 5, // 每页的数据条数  
    }
  },
  methods: {
    chooseImport(t) {
      this.sign = t;
    },
    onSubmit() {
      findStu(this.sno,this.sign).then(res => {
        if(res.status == '200') {
          if(res.data!='') {
            const obj = res.data;
            if(obj.sex==1) {
              obj.sex = "男"
            } else {
              obj.sex = "女"
            }
            obj.year = obj.year.slice(0,4);
            if(this.stuInfo.length!=0) {
              this.stuInfo.pop();
            }
            this.stuInfo.push(obj);            
          } else {
            alert("请检查输入的信息")
          }
        } else {
          alert("查找失败！请检查信息")
        }
      })
    },
    handleDelete(index,item) {
      this.$confirm(`确定删除 学号为:${ this.stuInfo[0].sno } 的学生?`).then(res=>{
        // res: confirm
        deleteStuBySno(this.stuInfo[0].sno).then(res => {
          if(res.status == '200') {
            alert("删除成功!");
            // 清空数据
            this.sno = "";
            this.stuInfo= [];
          } else {
            alert("删除失败!");
          }
        })
      }).catch(err=>{ //err: cancel

      });
    },
    handleEdit(index,item) {
      this.dialogFormVisible = true;
    },
    updateByNewSno() {
      this.dialogFormVisible = false;
      reviseStuBySno(this.stuInfo[0].sno,this.form.sno).then(res => {
        if(res.status == '200') {
          alert("修改成功");
        } else {
          alert("修改失败");
        }
      })
      this.stuInfo[0].sno = this.form.sno;
    },
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

  },
  created() {
    finAllStu().then(res=>{
      this.stuInfo = res.data;
    })
  }
}
</script>

<style>
  #find_stu .find_btns{
    text-align: left;
    margin-bottom: 30px;
    margin-left: 10px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgb(154, 166, 182);
  }
  #find_stu .el-form-item__label {
    color: rgb(19, 22, 18);
  }
  
  #find_stu #new_sno_form {
    position: absolute;
    height: 20px;
    left:26%;
  }
  #find_stu .el-dialog__header{
    margin-bottom: 40px;
  }
  #find_stu .el-dialog__footer {
    margin-top: 20px;
    padding-bottom: 30px;
  }
  #find_stu .el-dialog__footer button:first-of-type {
    margin-right: 15px;
  }

</style>