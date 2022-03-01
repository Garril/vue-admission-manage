<template>
  <div id="stu_list">
    <el-table :data="stuList.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">          
        <el-table-column prop="sno" label="学号" width="140">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="130">
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="80">
        </el-table-column>
        <el-table-column prop="spe_name" label="专业" width="150">
        </el-table-column>
        <el-table-column prop="class_name" label="班级名称" width="150">
        </el-table-column>
        <el-table-column prop="class_no" label="班级序号" width="90">
        </el-table-column>        
        <el-table-column prop="number" label="班中序号" width="90">
        </el-table-column>

        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            
            <el-button
              size="mini"
              @click="editSno(scope.$index, scope.row)">编辑</el-button>            

            <el-button
              size="mini"
              type="primary"
              @click="goToCreateBook(scope.$index, scope.row)">预览录取通知书</el-button>            

            <el-button
              size="mini"
              type="danger"
              @click="deleteStu(scope.$index, scope.row)">删除</el-button>

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
    <!-- 修改学号栏 -->
    <el-dialog title="修改学号" :visible.sync="dialogFormVisible" center>

      <el-form :model="form" label-width="80px" id="new_sno_form" @submit.native.prevent>
        <el-form-item label="新学号" label-width="120px">
          <el-input v-model="form.sno" autocomplete="off" @keyup.enter.native.prevent="updateByNewSno"></el-input>
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
import { reviseStuBySno } from 'network/revise/revise.js'
import { deleteStuBySno } from 'network/delete/delete.js'

export default {
  name:'stu_list',
  data() {
    return {
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 8, // 每页的数据条数
      dialogFormVisible:false,
      form: {
        sno:""
      },
      editItem:{},
      editIndex:0
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
    // 录取通知书查看
    goToCreateBook(index,item) {
      let t = (this.currentPage-1)*(this.pageSize)+index;
      this.$store.commit('save_pathQuery',{stuInfo:item,t})
      this.$router.push({path:'/createBook',query: {
        stuInfo:item,
        t
      }})
    },
    // 点击编辑，触发
    editSno(index,item) {
      this.dialogFormVisible = true;
      this.editItem = item;
      this.editIndex = index;
    },
    // 删除学生
    deleteStu(index,item) {
      this.$confirm(`确定删除 学号为:${ item.sno } 的学生?`).then(res=>{
        // res: confirm
        deleteStuBySno(item.sno).then(res => {
          if(res.status == '200') {
            alert("删除成功!");
            this.$emit("stuListNeedUpdate",true);
            this.$store.commit('update_stulist',true);

            this.total = 20;
            this.currentPage = 1;
            this.pageSize = 6;
          } else {
            alert("删除失败!");
          }
        })
      }).catch(err=>{ //err: cancel

      });      
    },
    // 修改学号
    updateByNewSno() {
      if(this.editItem.sno == this.form.sno) {
        alert("sno未做任何修改,修改失败");
      } else if(this.form.sno=='') {
        alert("sno不能为空")
      } else if(this.form.sno.length!=10) {
        alert("请输入十位的学号")
      } else {
        this.dialogFormVisible = false;
        reviseStuBySno(this.editItem.sno,this.form.sno).then(res => {
          if(res.data.code == '200') {
            alert("修改成功");
            const cur_index = (this.currentPage-1)*this.pageSize+this.editIndex;
            this.stuList[cur_index].sno = this.form.sno;
            this.form.sno = '';
          } else if(res.data.code=='400'){
            alert(res.data.message);
          } else {
            alert("请求发送失败")
          }
        })
      }
    },    
  },
  computed: {

  }
}
</script>

<style>
  #stu_list {
    margin-top: -2%;
  }
  #stu_list #new_sno_form .el-form-item .el-form-item__label{
    width: 80px !important;
  }
  #stu_list #new_sno_form .el-form-item .el-form-item__content {
    margin-left: 80px !important;
  }
  #stu_list .el-dialog__footer {
    padding-bottom: 30px;
  }
  #stu_list .el-dialog__body {
    display: flex;
    padding-left: 26%;
  }
</style>