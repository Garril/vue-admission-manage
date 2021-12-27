<template>
  <div id="import_class">

    <div class="import_btns">
      <el-button size="small" @click="changeImport(true)">单个导入</el-button>
      <el-button size="small" @click="changeImport(false)">批量导入</el-button>
    </div>
    <!-- 单个导入 -->
    <div class="upload_box" v-if="sign">

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
    <!-- 批量导入 -->
    <div class="upload_box" v-else>

      <el-upload drag
          :limit=limitNum
          multiple
          :auto-upload="false"
          accept=".xlsx"
          :action="UploadUrl()"
          :before-upload="beforeUploadFile"
          :before-remove="beforeRemove"
          :on-change="fileChange"
          :on-remove="handleRemove"
          :on-exceed="exceedFile"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过10M</div>
      </el-upload>
      <br/>
      <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
    </div>


  </div>  
</template>

<script>
import { importSingleClass,importMultiClass } from 'network/importInfo/importClass.js'
import { findDepSpe } from 'network/find/findDepSpe.js'


export default {
  name:'',
  data() {
    return {
      sign: true,
      limitNum: 2,  // 上传excell时，同时允许上传的最大数
      fileList: [],   // excel文件列表
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
  methods:{
    dep_change(dep_id) {
      this.data.forEach((item,index) => {
        if(item.dep_id === dep_id) {
          this.right_spe = item.spe_arr;
        }
      })
      this.form.spe_id = "";
    },
    changeImport(value) {
      this.sign = value;
    },
    // 文件超出个数限制时
    exceedFile(files, fileList) {
      this.$message.warning(`最多只能选择 ${this.limitNum} 个文件`);
    },
    // 文件状态改变时
    fileChange(file, fileList) {
      // console.log("1",file.raw);
      this.fileList.push(file.raw) ;
      // console.log("2",this.fileList);
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {

      let extension = file.name.substring(file.name.lastIndexOf('.')+1);
      let size = file.size / 1024 / 1024;
      if(extension !== 'xlsx') {
        this.$message.warning('只能上传后缀是.xlsx的文件');
      }
      if(size > 10) {
        this.$message.warning('文件大小不得超过10M');
      }
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success('文件上传成功');
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$message.error('文件上传失败');
    },
    UploadUrl:function(){
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，
      // 直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return ""
    },
    beforeRemove(file,fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleRemove(file,fileList) {
      let t = 0;
      this.fileList.forEach((item,index) => {
        if(item.uid == file.uid) {
          this.fileList.splice(index,1);
        }
      })
    },
    uploadFile() {
      if (this.fileList.length === 0){
        this.$message.warning('请上传文件');
      } else if(this.fileList.length === 2){
          let file = new FormData();
          file.append('file', this.fileList[0]);
          importMultiClass(file).then( res1 => {
            if(res1.status == '200') {
              file = new FormData();
              file.append('file', this.fileList[1]);
              importMultiClass(file).then( res2 => {
                if(res2.status == "200") {
                  alert("导入成功");
                } else {
                  alert("第二个文件导入失败");
                }
              })
            } else {
              alert("第一个文件导入失败");
            }
          })
      } else {
          let file = new FormData();
          file.append('file', this.fileList[0]);
          importMultiClass(file).then( res1 => {
            if(res1.status == '200') {
              alert("导入成功");
            } else {
              alert("导入失败");
            }
          })        
      }
    },
    onSubmit() {
      this.form.year = new Date().getFullYear();
      importSingleClass(this.form).then(res => {
        if(res.status =='200') {
          alert("提交成功");
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
  #import_class .import_btns{
    text-align: left;
    margin-bottom: 30px;
    margin-left: 10px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgb(154, 166, 182);
  }
  #import_class .upload_box {
    margin-left: 20px;
  }
  #import_class .el-form-item__label {
    color: rgb(19, 22, 18);
  }
  #import_class .el_import_btns {
    display: flex;
    text-align: center;
  }
  #import_class .el-form-item__content button {
    margin-right: 12px;
  }
</style>