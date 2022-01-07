<template>
  <div id="import_stu">

    <div class="import_btns">
      <el-button size="small" @click="changeImport(true)">单个导入</el-button>
      <el-button size="small" @click="changeImport(false)">批量导入</el-button>
    </div>

    <!-- 单个导入 -->
    <div class="upload_box" v-if="sign">
      <Single></Single>
    </div>

    <!-- 批量导入 -->
    <div class="upload_box" v-else>
      <Mult></Mult>
    </div>

  </div>
</template>

<script>
import Single from './childComps/Single.vue'
import Mult from './childComps/Mult.vue'

export default {
  name:'',
  data() {
    return {
      sign: true,
    }
  },
  components: {
    Single,Mult
  },
  methods:{
    changeImport(value) {
      this.sign = value;
    },
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
  #import_stu .upload_box #upload_alert {
    margin-bottom: 20px;
    font-weight: bolder;
    color: red;
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
  #import_stu #avatar_box {
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-right: 70px;
    margin-bottom: 20px;
  }
  #import_stu #avatar_box span {
    width: 100%;
    text-align: center;
    font-size: 14px;
    transform: translateX(12px);
  }

</style>