<template>
  <div id="import_stu">

    <div class="import_btns">
      <el-button size="small" @click="changeImport(true)">单个导入</el-button>
      <el-button size="small" @click="changeImport(false)">批量导入</el-button>
    </div>

    <!-- 单个导入 -->
    <div class="upload_box" v-if="sign">

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
import { importSingleStu,importMultiStu,importStuAvatar } from 'network/importInfo/importStu.js'
import { findDepSpe } from 'network/find/findDepSpe.js'

export default {
  name:'',
  data() {
    return {
      sign: true,
      limitNum: 2,  // 上传excell时，同时允许上传的最大数
      fileList: [],   // excel文件列表
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
      excelList:[]
    }
  },
  methods:{
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
      this.excelList.push(file.raw) ;
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
      this.excelList.forEach((item,index) => {
        if(item.uid == file.uid) {
          this.excelList.splice(index,1);
        }
      })
    },
    uploadFile() {
      if (this.excelList.length === 0){
        this.$message.warning('请上传文件');
      } else if(this.excelList.length === 2){
        alert("导入时间受依据文件大小影响，请等待提示");
          let file = new FormData();
          file.append('file', this.excelList[0]);
          importMultiStu(file).then( res1 => {
            if(res1.status == '200') {
              file = new FormData();
              file.append('file', this.excelList[1]);
              importMultiStu(file).then( res2 => {
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
        alert("导入时间受依据文件大小影响，请等待提示");
          let file = new FormData();
          file.append('file', this.excelList[0]);
          importMultiStu(file).then( res1 => {
            if(res1.status == '200') {
              alert("导入成功");
            } else {
              alert("导入失败");
            }
          })        
      }
    },
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
                alert("导入成功")
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
  #import_stu .import_btns{
    text-align: left;
    margin-bottom: 30px;
    margin-left: 10px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgb(154, 166, 182);
  }
  #import_stu .upload_box {
    margin-left: 20px;
  }
  #import_stu .el-form-item__label {
    color: rgb(19, 22, 18);
  }
  #import_stu .el_import_btns {
    display: flex;
    text-align: center;
  }
  #import_stu .el-form-item__content button {
    margin-right: 12px;
  }
  #import_stu .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    left: 20px;
  }
  #import_stu .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  #import_stu .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  #import_stu .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
  #avatar_box {
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-right: 70px;
    margin-bottom: 20px;
  }
  #avatar_box span {
    width: 100%;
    text-align: center;
    font-size: 14px;
    transform: translateX(12px);
  }

</style>