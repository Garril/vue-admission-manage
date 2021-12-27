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
      :data="stuInfo"
      style="width: 100%">

      <el-table-column
        prop="id"
        label="录取号"
        width="130">
      </el-table-column>

      <el-table-column
        prop="sno"
        label="学号"
        width="130">
      </el-table-column>

      <el-table-column
        prop="degree"
        label="年级"
        width="80">
      </el-table-column>

      <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column>      

      <el-table-column
        prop="number"
        label="班中序号"
        width="100">
      </el-table-column>

      <el-table-column
        prop="sex"
        label="性别"
        width="100">
      </el-table-column>

      <el-table-column
        prop="dep_name"
        label="学院"
        width="180">
      </el-table-column>

      <el-table-column
        prop="spe_name"
        label="专业"
        width="180">
      </el-table-column>

      <el-table-column
        prop="class_name"
        label="班级名称"
        width="200">
      </el-table-column>
      
      <el-table-column
        prop="year"
        label="入学年份"
        width="80">
      </el-table-column>
      
    </el-table>

  </div>
</template>

<script>
import { findStu } from 'network/find/findStu.js'

export default {
  name:'',
  data() {
    return {
      sign:true,
      sno:'',
      stuInfo:[]
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
    }
  },
  created() {
    
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
</style>