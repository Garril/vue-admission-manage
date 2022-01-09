<template>
  <div id="find_class_detail">
    <!-- 查找选项 -->
    <div id="find_choice_form">
      <el-form :inline="true" :model="form" class="findclass_detail_form">
        
        <el-form-item label="学号查询">
          <el-input v-model="form.sno" placeholder="可选-优先级最高" @keyup.enter.native="onSubmit" size="middle"></el-input>
        </el-form-item>

        <el-form-item label="学历">
          <el-select v-model="form.degree" placeholder="请选择学历" size="middle">
            <el-option label="" value=""></el-option>
            <el-option label="本科" value="3"></el-option>
            <el-option label="硕士" value="2"></el-option>
            <el-option label="博士" value="1"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="学院">
          <el-select v-model="form.dep_id" placeholder="请选择学院" @change="dep_change" size="middle">
            <el-option label="" value=""></el-option>
            <span v-for="(item,index) in data">
              <el-option :label="item.dep_name" :value="item.dep_id"></el-option>
            </span>
          </el-select>
        </el-form-item>

        <el-form-item label="专业">
          <el-select v-model="form.spe_id" placeholder="请选择专业" size="middle">
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
    <TablePage :classInfo="classInfo" @updateClassInfoRightNow="childNeedUpdate"></TablePage>

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
    // 查询分班信息按钮触发
    onSubmit() {
      if(this.form.sno!='') {
        // 通过学号查询分班接口的调用
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
                // tempArr进行格式的转化
                this.tempArr = res.data;
                this.tempArr.map(item => {
                  item.year = item.year.slice(0,4);
                })
                // 赋值给classInfo（双向绑定，用于table显示）
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
    // 多级联动选项
    dep_change(dep_id) {

      this.data.forEach((item,index) => {
        if(item.dep_id === dep_id) {
          this.right_spe = item.spe_arr;
        }
      })
      this.form.spe_id = "";

    },
    // 重新获取所有分班信息的封装函数
    getMultiClassByDep() {
      // 调用接口
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
    },
    // 监听子组件TablePage的，表示他进行了学生的删除，这边需要进行重新请求（班级的人数变了）
    childNeedUpdate(value) {
      if(value) {
        this.getMultiClassByDep();
      }
    }
  },
  created() {
    // 初始获取多级联动使用的，学院和对应专业
    findDepSpe().then(res => {
      this.data = res.data;
    });
    // 获取所有分班信息
    this.getMultiClassByDep();

  },
  // 为了解决，初始时无数据，导入后，created不重新执行,一直无数据
  // 同样，如果不接store，需要查询后才能获取新的，单个引入的班级的数据
  activated() {
    // 跳转到当前路由，判断是否要重新获取所有分班信息
    if(this.saveAll.length == 0 || this.$store.state.classUpdate) {
      this.getMultiClassByDep();
      this.$store.commit('update_classlist',false);
    }

  },
}
</script>

<style scoped>

  #find_class_detail .findclass_detail_form{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
  }
  #find_class_detail .findclass_detail_form .el-form-item__label{
    color: black;
  }
  #find_class_detail .findclass_detail_form .el-form-item{
    width: 250px;
  }
  #find_class_detail .findclass_detail_form .el-form-item:first-of-type{
    width: 280px;
  }
  #find_class_detail .findclass_detail_form .el-form-item:last-of-type{
    width: 70px;
  }
</style>