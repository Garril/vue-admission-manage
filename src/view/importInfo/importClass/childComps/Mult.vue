<template>
  <div id="import_stu_multi">
      <div v-show="uploadShow" id="upload_alert">导入时间受依据文件大小影响，请等待提示~</div>
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
          :file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过10M</div>
      </el-upload>
      <br/>
      <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
  </div>
</template>

<script>
import { importMultiClass } from 'network/importInfo/importClass.js'

export default {
  name:"Mult",
  data() {
    return {
      limitNum: 2,  // 上传excell时，同时允许上传的最大数
      fileList: [],   // excel文件列表
      uploadShow:false
    }
  },
  methods: {
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
          this.uploadShow = true;
          let file = new FormData();
          file.append('file', this.fileList[0]);
          importMultiClass(file).then( res1 => {
            if(res1.status == '200') {
              file = new FormData();
              file.append('file', this.fileList[1]);
              importMultiClass(file).then( res2 => {
                if(res2.status == "200") {
                  alert(res2.data);
                  // 改变store，让列表获取更新
                  this.$store.commit('update_classlist',true);
                } else {
                  alert("第二个文件导入失败");
                }
              })
            } else {
              alert("第一个文件导入失败");
            }
            this.uploadShow = false;
          })
      } else {
          let file = new FormData();
          file.append('file', this.fileList[0]);
          this.uploadShow = true;
          importMultiClass(file).then( res1 => {
            if(res1.status == '200') {
              alert(res1.data);
              // 改变store，让列表获取更新
              this.$store.commit('update_classlist',true);
            } else {
              alert("导入失败");
            }
            this.uploadShow = false;
          })        
      }
    },    
  }
}
</script>

<style>


</style>