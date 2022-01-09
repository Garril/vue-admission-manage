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
    // 头像上传到 前端本地 处理
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
    },

    // 创建学生
    onSubmit() {
      // 要求上传头像到 前端本地
      if(this.imageUrl=='') {
        alert("请上传头像!");
      }
      // 获取本地时间写入form
      this.form.year = new Date().getFullYear();
      // 遍历form的属性，url暂时不考虑，因为还没生成，imageUrl是假url
      for(let key in this.form) {
        if(this.form[key]==''&& key!='url') {
          // 4是一种情况，表示信息没填写完整
          this.submitSign = 4;
          break;
        }
      }
      // 0就是默认值，到这里表示表格都填写完整了
      if(this.submitSign ==0) {
        // fileList是上传的头像的文件信息
        let fd = new FormData();
        let len = this.fileList.length;        
        fd.append('file',this.fileList[len-1].raw);
        // 上传头像数据流
        importStuAvatar(fd).then(res => {
          if(res.status=='200') {
            // 头像上传成功，保存后端返回的url
            this.form.url = res.data;
            // 创建学生 的接口的调用
            importSingleStu(this.form).then(res => {
              if(res.status == '200') {
                // 创建结果信息提示
                alert(res.data);
                  // 改变store内值，让其他组件 学生列表信息重新获取
                this.$store.commit('update_stulist',true);
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
        // 初始化 submitSign的值为0
        this.submitSign = 0;
      }

    },
    // 清空按钮触发
    onQuitUpload() {
      this.form.id="";
      this.form.name="";
      this.form.degree="";
      this.form.sex="";
      this.form.dep_id="";
      this.form.spe_id="";
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
  },
  created() {
    // 拿到 学院和 对应的 所有的专业，用于多级联动选项
    findDepSpe().then(res => {
      this.data = res.data;
    });
  }  
}
</script>

<style>

</style>