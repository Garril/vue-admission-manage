<template>
  <div id="table_page">
    <div v-if="showStuList">
    <!-- 表格 -->
      <el-table :data="classInfo.slice((curPage-1)*pageSize,curPage*pageSize)" style="width: 100%">          
          <el-table-column prop="dep_name" label="学院" width="150">
          </el-table-column>
          <el-table-column prop="spe_name" label="专业" width="150">
          </el-table-column>
          <el-table-column prop="degree" label="学历" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.degree == 3">本科</span>
              <span v-else-if="scope.row.degree ==2">硕士</span>
              <span v-else>博士</span>
            </template>
          </el-table-column>          
          <el-table-column prop="class_no" label="班级序号" width="100">
          </el-table-column>
          <el-table-column prop="class_name" label="班级名称" width="200">
          </el-table-column>
          <el-table-column prop="boy" label="男生人数" width="120">
          </el-table-column>
          <el-table-column prop="girl" label="女生人数" width="120">
          </el-table-column>

          <el-table-column
            label="总人数"
            width="80">
            <template slot-scope="scope">
              <span>{{parseInt(scope.row.boy)+parseInt(scope.row.girl)}}</span>
            </template>
          </el-table-column>          
          <el-table-column prop="year" label="建班年份" width="100">
          </el-table-column>
          
          <!-- 修改班级名称 -->
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">改名</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="getAllClassStu(scope.$index, scope.row)">查看学生</el-button>            
            </template>
          </el-table-column>

      </el-table>
      <!-- 分页器 -->
      <div class="block" style="margin-top:15px;">
          <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" 
          :current-page="curPage" 
          :page-sizes="[5,8,10,20]" 
          :page-size="pageSize" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="classInfo.length">
          </el-pagination>
      </div>

      <el-dialog title="修改班级名称" :visible.sync="showSign" center>

        <el-form label-width="120px" id="new_sno_form" @submit.native.prevent>
          <el-form-item label="班级名称" label-width="100px">
            <el-input v-model="new_name" autocomplete="off" :placeholder="reviseClass.class_name" @keyup.enter.native.prevent="reviseClassName"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" id="newsno_form_btns">
          <el-button @click="showSign = false">取 消</el-button>
          <el-button type="primary" @click="reviseClassName()">确 定</el-button>
        </div>
      </el-dialog>      
    </div>


    <div v-else>
      <el-button @click="backToFind()" id="back_btn" type="danger">返回</el-button>
      <StuList :stuList="classStuInfo" @stuListNeedUpdate="childWantUpdateStuList"></StuList>
    </div>

  </div>  
</template>

<script>
import { reviseClassById } from 'network/revise/revise.js'
import { findClassAllStu } from 'network/find/findStu.js'

import StuList from './StuList.vue'

export default {
  name:'table_page',
  data() {
    return {
      curPage: 1, // 当前页码，也应该是父组件先传,子组件保存值
      total: 20, // 总条数
      pageSize: 8, // 每页的数据条数
      showSign:false,
      new_name:"",
      reviseClass:{},
      index:0,
      classStuInfo:[],
      showStuList:true,
      tempChangeSex:[],
      tempItem:{}
    }
  },
  components: {
    StuList
  },
  props: ['classInfo'],
  methods: {
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
        this.curPage = 1;
        this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
        this.curPage = val;
    },
    // 点击改名按钮触发
    handleEdit(index,item) {
      this.showSign = true;
      this.index = index;
      this.reviseClass = item;
    },
    // 修改班级代号
    reviseClassName() {
      this.showSign = false;
      if(this.new_name =='') {
        alert("修改失败，不能为空");
      } else {
        reviseClassById(this.new_name,this.reviseClass.id).then(res => {
          if(res.status =='200') {
            const cur_index = this.pageSize*(this.curPage-1)+this.index;
            this.classInfo[cur_index].class_name = this.new_name;
            alert("修改成功!");
            this.new_name = '';
          } else {
            alert("修改失败!");
          }
        })        
      }
    },
    // 查找
    getAllClassStu(index,item) {
      this.$emit('changeBtnDisable',true);
      this.tempItem = item;
      findClassAllStu(item.degree,item.dep_id,item.spe_id,item.class_no).then(res => {
        if(res.status == '200') {
          // 转换性别的格式
          this.tempChangeSex = res.data;
          this.tempChangeSex.map(item => {
            if(item.sex =='1') {
              item.sex ='男'
            } else {
              item.sex ='女'
            }
          })
          this.classStuInfo = this.tempChangeSex;
          this.showStuList = false;
        } else {
          alert("查看失败!");
        }
      })
    },
    // 从班级学生列表点击 返回 出来了触发
    backToFind() {
      this.$emit('changeBtnDisable',false);
      this.showStuList = true;
      // 发送给父组件findClassDetail/index.vue，请求重新获取班级列表信息，人数可能发生变化了
      this.$emit("updateClassInfoRightNow",true);
    },
    childWantUpdateStuList(value) {
      if(value) {
        // 子组件StuList请求 父组件TabelPage 重新获取stulist信息
        this.getAllClassStu(0,this.tempItem);
      }
    }
  },
  watch: {
    // classInfo发生变化，分页器到第一页
    // 为什么这样做？ 因为如果你一开始查找的是学院，比如有3页，你跳到3页去了
    // 但是你又选了一次，这次加上了专业，专业只有一页，可curPage=3，
    // 那你查询完后，显示的就是空白，因为不是第一页。
    // 所以这里监听，为了每次查询后，就是第一页
    classInfo(newValue, oldValue) {
      this.curPage = 1;
      this.total = 20;
      this.pageSize= 8;
    },
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
    margin-bottom: 20px;
  }
  #table_page .el-dialog__footer {
    padding: 50px 0 30px 0;
  }
  #table_page .el-dialog__footer button:first-of-type {
    margin-right: 15px;
  }
  #table_page #back_btn {
    transform: translate(873%,-155%);
  }
</style>