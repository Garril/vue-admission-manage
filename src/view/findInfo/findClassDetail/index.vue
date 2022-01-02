<template>
  <div id="find_class_detail">
    <!-- 查找选项 -->
    <div id="find_choice_form">
      <el-form :inline="true" :model="form" class="findclass_detail_form">
        
        <el-form-item label="学号查询">
          <el-input v-model="form.sno" placeholder="可选-优先级最高" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="学历">
          <el-select v-model="form.degree" placeholder="请选择学历-不能为空">
            <el-option label="本科" value="3"></el-option>
            <el-option label="硕士" value="2"></el-option>
            <el-option label="博士" value="1"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="学院">
          <el-select v-model="form.dep_id" placeholder="请选择学院-不能为空" @change="dep_change">
            <span v-for="(item,index) in data">
              <el-option :label="item.dep_name" :value="item.dep_id"></el-option>
            </span>
          </el-select>
        </el-form-item>

        <el-form-item label="专业">
          <el-select v-model="form.spe_id" placeholder="请选择专业-可以为空">
            <el-option label="" value=""></el-option>
            <span v-for="(item,index) in right_spe">
              <el-option :label="item" :value="index+1"></el-option>
            </span>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表单信息 -->
    <TablePage :classInfo="classInfo" :currentPage="currentPage"></TablePage>

  </div>  
</template>

<script>
import { findDepSpe } from 'network/find/findDepSpe.js'
import { findClassByDep,findClassBySpe,findClassBySno } from 'network/find/findClass.js'
import TablePage from './childComps/TablePage.vue'

export default {
  name:'',
  data() {
    return {
      form: {
        degree:'',
        dep_id: '',
        spe_id: '',
        sno:''
      },
      currentPage: 1,
      data:[],
      right_spe:[],
      classInfo:[],
      tempArr:[],
      saveAll:[]
    }
  },
  components: {
    TablePage,
  },
  methods: {
    onSubmit() {
      if(this.form.sno!='') {
        findClassBySno(this.form.sno).then(res => {
          this.tempArr = res.data;
          this.tempArr.map(item => {
            item.year = item.year.slice(0,4);
          })
          this.classInfo = this.tempArr;
          this.tempArr = null;
          this.currentPage = 1;
        })
      } else { // 学号没填，考虑专业和学院
        if(this.form.dep_id == ''|| this.form.degree == '') { // 没填学院或者年级
            this.classInfo = this.saveAll;
        } else if(this.form.spe_id =='') { // 表示填了学院，但是没有填专业
          findClassByDep(this.form.dep_id,this.form.degree).then( res => {
            if(res.status=='200') {
              if(res.data.length !=0 ) {
                this.tempArr = res.data;
                this.tempArr.map(item => {
                  item.year = item.year.slice(0,4);
                })
                this.classInfo = this.tempArr;
                this.tempArr = null;
                this.currentPage = 1;
              } else {
                alert("不存在对应班级,请改变检索条件")
              }
            } else {
              alert("请求查询失败,请重试");
            }
          })
        } else { // 填了专业
          findClassBySpe(this.form.dep_id,this.form.degree,this.form.spe_id).then( res => {
            if(res.status=='200') {
              if(res.data.length !=0 ) {
                this.tempArr = res.data;
                this.tempArr.map(item => {
                  item.year = item.year.slice(0,4);
                })
                this.classInfo = this.tempArr;
                this.tempArr = null;
                this.currentPage = 1;
              } else {
                alert("不存在对应班级,请改变检索条件")
              }
            } else {
              alert("请求查询失败,请重试");
            }
          })
        }
      }
    },
    dep_change(dep_id) {
      this.data.forEach((item,index) => {
        if(item.dep_id === dep_id) {
          this.right_spe = item.spe_arr;
        }
      })
      this.form.spe_id = "";
    },    
  },
  created() {
    findDepSpe().then(res => {
      this.data = res.data;
    });
    findClassByDep(" "," ").then(res => {
      if(res.status =='200') {
        this.tempArr = res.data;
        this.tempArr.map(item => {
          item.year = item.year.slice(0,4);
        })
        this.classInfo = this.tempArr;
        this.saveAll = this.tempArr;
        this.tempArr = null;
      }
    }).catch(err => {
      console.log(err);
    })
  }
}
</script>

<style>
  #find_choice_form {
    padding-left: 20px;
  }
  #find_class_detail .findclass_detail_form{
    flex-direction: row;
    width: 100%;
  }
  #find_class_detail .findclass_detail_form .el-form-item__label{
    color: black;
  }
  #find_class_detail .findclass_detail_form .el-form-item{
    width: 250px;
  }
  #find_class_detail .findclass_detail_form .el-form-item:first-of-type{
    width: 300px;
  }
  #find_class_detail .findclass_detail_form .el-form-item:last-of-type{
    width: 70px;
  }
</style>