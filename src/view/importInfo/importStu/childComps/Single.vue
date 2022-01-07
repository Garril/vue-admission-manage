<template>
  <div id="import_class_single">
    <el-form ref="form" :model="form" label-width="80px" size="small">
      
      <div id="avatar_box">
        <el-upload
          class="avatar-uploader"
          action="#"
          accept="image/png,image/jpg,image/jpeg"
          :auto-upload="false"
          :on-change="uploadAvatarChanged"
          :show-file-list="false"
          >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>点击修改头像</span>
      </div>

      <el-form-item label="录取号">
        <el-input v-model="form.id" placeholder="请输入录取号"></el-input>
      </el-form-item>

      <el-form-item label="姓名">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <el-form-item label="性别">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>

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


      <el-form-item class="el_import_btns">
        <el-button type="primary" size="small" @click="onSubmit">立即创建</el-button>
        <el-button size="small" @click="onQuitUpload">清空</el-button>
      </el-form-item>
      
    </el-form>    
  </div>  
</template>

<script>
import { importSingleStu,importStuAvatar } from 'network/importInfo/importStu.js'
import { findDepSpe } from 'network/find/findDepSpe.js'

export default {
  name:"",
  data() {
    return {
      form: {
        id:"",
        name:"",
        degree:"",
        sex:"",
        dep_id:"",
        spe_id:"",
        url:"",
        year:""
      },
      data:[],
      right_spe:[],
      imageUrl: '',
      fileList:[],
      submitSign: 0,      
    }
  },
  methods: {
    onSubmit() {
      if(this.imageUrl=='') {
        alert("请上传头像!");
      }
      this.form.year = new Date().getFullYear();
      for(let key in this.form) {
        if(this.form[key]==''&& key!='url') {
          
          this.submitSign = 4;
          break;
        }
      }
      if(this.submitSign ==0) {
        let fd = new FormData();
        let len = this.fileList.length;        
        fd.append('file',this.fileList[len-1].raw);
        importStuAvatar(fd).then(res => {
          if(res.status=='200') {
            this.form.url = res.data;
            importSingleStu(this.form).then(res => {
              if(res.status == '200') {
                alert(res.data);
              } else {
                alert("请求发送失败");
              }
            })
            
          } else {
            alert("图片上传失败");
          }
        })
      } else if(this.submitSign == 1) { // 表示头像格式不对
        alert("上传头像图片只能是 JPG/JPEG/PNG 格式!");
      } else if(this.submitSign == 2) {
        alert("上传头像图片大小不能超过 2MB!")
      } else if(this.submitSign == 3){
        alert("上传头像图片只能是 JPG/JPEG/PNG 格式! 且！上传头像图片大小不能超过 2MB! ");
      } else if(this.submitSign == 4){
        alert("请将信息补充完整!");
        this.submitSign = 0;
      }

    },
    onQuitUpload() {
      this.form.id="";
      this.form.name="";
      this.form.degree="";
      this.form.sex="";
      this.form.dep_id="";
      this.form.spe_id="";
    },
    dep_change(dep_id) {
      this.data.forEach((item,index) => {
        if(item.dep_id === dep_id) {
          this.right_spe = item.spe_arr;
        }
      })
      this.form.spe_id = "";
    },

    // 头像上传处理
    uploadAvatarChanged(file,fileList) {
      let isJPG = true;
      const isLt2M = file.raw.size / 1024 / 1024 < 2;
      // 初始化标志，代表头像状态，非0不能上传
      this.submitSign = 0;
      if(file.raw.type === 'image/jpeg' || file.raw.type ==='image/png' ) {
        isJPG = false;
      }
      if (isJPG) {
        this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!');
        this.submitSign = 1;
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        if(this.submitSign == 1) {
          this.submitSign = 3;
        } else {
          this.submitSign = 2;
        }
      }
      // 在页面上显示图片(假url)
      this.imageUrl = URL.createObjectURL(file.raw);
      // 保存文件信息到fileList
      this.fileList = fileList;
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