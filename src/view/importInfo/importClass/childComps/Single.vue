<template>
  <div id="import_stu_single">
      <el-form ref="form" :model="form" label-width="80px" size="small">

        <el-form-item label="学历">
          <el-select v-model="form.degree" placeholder="请选择学历">
            <el-option label="本科" value="3"></el-option>
            <el-option label="硕士" value="2"></el-option>
            <el-option label="博士" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学院">
          <el-select v-model="form.dep_id" placeholder="请选择学院" @change="dep_change">
            <span v-for="(item,index) in data">
              <el-option :label="item.dep_name" :value="item.dep_id"></el-option>
            </span>
          </el-select>
        </el-form-item>

        <el-form-item label="专业">
          <el-select v-model="form.spe_id" placeholder="请选择专业">
            <span v-for="(item,index) in right_spe">
              <el-option :label="item" :value="index+1"></el-option>
            </span>
          </el-select>
        </el-form-item>

        <el-form-item label="班级名称">
          <el-input v-model="form.class_name" placeholder="请输入班级名称"></el-input>
        </el-form-item>

        <el-form-item label="班级序号">
          <el-input v-model="form.class_no" placeholder="请输入班级序号,1代表1班"></el-input>
        </el-form-item>

        <el-form-item class="el_import_btns">
          <el-button type="primary" size="small" @click="onSubmit">立即创建</el-button>
          <el-button size="small" @click="onQuitUpload">清空</el-button>
        </el-form-item>
        
      </el-form>
  </div>
</template>

<script>
import { importSingleClass } from 'network/importInfo/importClass.js'
import { findDepSpe } from 'network/find/findDepSpe.js'

export default {
  name:"Single",
  data() {
    return {
      form: {
        degree:"",
        dep_id:"",
        spe_id:"",
        class_no:"",
        class_name:"",
        year:""
      },
      data: [],
      right_spe:[],      
    }
  },
  methods: {
    dep_change(dep_id) {
      this.data.forEach((item,index) => {
        if(item.dep_id === dep_id) {
          this.right_spe = item.spe_arr;
        }
      })
      this.form.spe_id = "";
    },
    onSubmit() {
      this.form.year = new Date().getFullYear();
      importSingleClass(this.form).then(res => {
        if(res.status =='200') {
          alert("提交成功");
          // 改变store，让列表获取更新
          this.$store.commit('update_classlist',true);
        } else {
          alert("提交失败");
        }
      })
    },
    onQuitUpload() {
      this.form.degree="";
      this.form.dep_id="";
      this.form.spe_id="";
      this.form.class_no="";
      this.form.class_name=""
      this.form.year="";
    }
  },
  created() {
    findDepSpe().then(res => {
      this.data = res.data;
    });
  }
}
</script>

<style>

</style>