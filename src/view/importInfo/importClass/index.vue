<template>
  <div id="import_class">

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
      <Multi></Multi>
    </div>

  </div>  
</template>

<script>
import Multi from './childComps/Mult.vue'
import Single from './childComps/Single.vue'

export default {
  name:'',
  data() {
    return {
      sign: true,
    }
  },
  components: {
    Multi,
    Single
  },
  methods:{
    changeImport(value) {
      this.sign = value;
    }
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
  #import_class .upload_box #upload_alert {
    margin-bottom: 20px;
    font-weight: bolder;
    color: red;
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