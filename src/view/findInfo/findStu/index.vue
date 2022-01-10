<template>
  <div id="find_stu">
    <div class="find_btns">
      <el-button size="small" @click="chooseImport(true)">学号查询</el-button>
      <el-button size="small" @click="chooseImport(false)">录取号查询</el-button>
    </div>

    <el-form ref="form" label-width="80px" size="small" :inline="true">

      <el-form-item label="学号" v-show="sign">
        <el-input v-model="sno" placeholder="请输入学号" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>

      <el-form-item label="录取号" v-show="!sign">
        <el-input v-model="sno" placeholder="请输入录取号" @keyup.enter.native="onSubmit"></el-input>
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
        label="学历"
        width="60">
          <template slot-scope="scope">
            <span v-if="scope.row.degree == 3">本科</span>
            <span v-else-if="scope.row.degree ==2">硕士</span>
            <span v-else>博士</span>
          </template>
      </el-table-column>

      <el-table-column
        prop="name"
        label="姓名"
        width="110">
      </el-table-column>      

      <el-table-column
        prop="number"
        label="班中序号"
        width="80">
      </el-table-column>

      <el-table-column
        prop="sex"
        label="性别"
        width="60">
      </el-table-column>

      <el-table-column
        prop="dep_name"
        label="学院"
        width="150">
      </el-table-column>

      <el-table-column
        prop="spe_name"
        label="专业"
        width="160">
      </el-table-column>

      <el-table-column
        prop="class_name"
        label="班级名称"
        width="170">
      </el-table-column>
      
      
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="goToCreateBook(scope.$index, scope.row)">预览录取通知书</el-button>            
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
        :page-sizes="[6,10,20]" 
        :page-size="pageSize" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="stuInfo.length">
        </el-pagination>
    </div>  

    <el-dialog title="修改学号" :visible.sync="dialogFormVisible" center>

      <el-form :model="form" label-width="80px" id="new_sno_form" @submit.native.prevent>
        <el-form-item label="新学号" label-width="120px">
          <el-input v-model="form.sno" autocomplete="off"  @keyup.enter.native.prevent="updateByNewSno"></el-input>
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
      allInfo:[],
      dialogFormVisible:false,
      form: {
        sno:""
      },
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 6, // 每页的数据条数
      editItem:{},
      editIndex:0
    }
  },
  methods: {
    // 选择录取号查询还是学号查询
    chooseImport(t) {
      this.sign = t;
    },
    // 查询按钮触发
    onSubmit() {
      // 没填学号，显示全部
      if(this.sno=='') {
        // allInfo在activated的时候已经保存了之前的请求到的所有信息
        // 这里就没有重新发送请求了！
        this.stuInfo = this.allInfo;
        // 分页器跳到第一页
        this.total = 20;
        this.currentPage = 1;
        this.pageSize = 6;
      } else {
        // 学号非空，调用查询学生信息的接口
          findStu(this.sno,this.sign).then(res => {
            if(res.status == '200') {
              if(res.data!='') {
                const obj = res.data;
                // 性别格式的转换，便于显示，也可以在 template中改
                if(obj.sex==1) {
                  obj.sex = "男"
                } else {
                  obj.sex = "女"
                }
                // 年份格式化，要前四位：2021
                obj.year = obj.year.slice(0,4);
                if(this.stuInfo.length!=0) {
                  // 因为查询后，要显示的就只有一个，那就要改变stuInfo（双向绑定显示的数据）
                  this.stuInfo = [];
                }
                this.stuInfo.push(obj);

                this.currentPage = 1;
                this.total = 1;
                this.pageSize = 1;
              } else {
                alert("请检查输入的信息")
              }
            } else {
              alert("查找失败！请检查信息")
            }
          })
      }
      
    },
    handleDelete(index,item) {
      this.$confirm(`确定删除 学号为:${ item.sno } 的学生?`).then(res=>{
        // res: confirm
        deleteStuBySno(item.sno).then(res => {
          if(res.status == '200') {
            alert("删除成功!");
            // 清空数据
            this.sno = "";
            // 重新请求，获取学生信息
            this.getAllStuInfo();
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
    handleEdit(index,item) {
      this.dialogFormVisible = true;
      this.editItem = item;
      this.editIndex = index;
    },
    // 确认修改学号
    updateByNewSno() {
      if(this.editItem.sno == this.form.sno) {
        alert("sno未做任何修改,修改失败");
      } else if(this.form.sno=='') {
        alert("sno不能为空")
      } else {
        // sno为一个新的值，取消显示
        this.dialogFormVisible = false;
        // 发送修改学号的请求
        reviseStuBySno(this.editItem.sno,this.form.sno).then(res => {
          if(res.data.code == '200') {
            alert("修改成功");
            // 本地信息修改，这里也可以换成重新请求数据！也应该是要重新请求的
            const cur_index = (this.currentPage-1)*this.pageSize+this.editIndex;
            this.stuInfo[cur_index].sno = this.form.sno;
            this.form.sno = '';
          } else if(res.data.code=='400'){
            alert(res.data.message);
          } else {
            alert("请求发送失败")
          }
        })
      }
    },
      //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
        this.currentPage = val;
    },
    // 去查看录取通知书
    goToCreateBook(index,item) {
      let t = (this.currentPage-1)*this.pageSize+index;
      this.$store.commit('save_pathQuery',{stuInfo:item,t})
      this.$router.push({path:'/createBook',query: {
        stuInfo:item,
        t
      }})
    },
    // 获取学生列表信息
    getAllStuInfo() {
      finAllStu().then(res=>{
        this.stuInfo = res.data;
        this.allInfo = res.data;
      })
    }

  },
  // 这里不用created了，因为在其他地方加了功能，也会删除学生，
  // 如果删除了学生，也需要更新列表，那么直接看下面的activated就好了
  // created() {
  //   this.getAllStuInfo();
  // },

  // 为了解决，初始时无数据，导入后，created不重新执行,一直无数据
  // activated() {
  //   if(this.allInfo.length == 0) {
  //     finAllStu().then(res=>{
  //       this.stuInfo = res.data;
  //       this.allInfo = res.data;
  //     })
  //   }
  // },
  // 修改后，可以解决批量导入后，无数据数据获取的情况，但
  // 如果单个导入，他是不会重新刷新的，所以，可能需要一个新的store变量
  activated() {
    if(this.allInfo.length == 0 || this.$store.state.stuUpdate) {
        this.getAllStuInfo();
        // 改变store中的状态，其他人要刷新学生列表
        this.$store.commit('update_stulist',false);
    }
  },
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
    flex: 1;
  }
  #find_stu .el-dialog__footer {
    padding-bottom: 30px;
  }
  #find_stu .el-dialog__footer button:first-of-type {
    margin-right: 25px;
  }
  #find_stu .el-form {
    display: flex;
    width: 42%;
    flex-direction: row;
    margin: 28px 0 5px -15px;
  }
  #find_stu .el-form .el_import_btns .el-form-item__content {
    margin-left: 35px !important;
    text-align: left;
  }
  #find_stu .el-dialog__body {
    display: flex;
    padding-left: 26%;
  }

</style>