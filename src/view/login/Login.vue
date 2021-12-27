<template>
  <div id="login">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <p id="title">Login</p>
      <!-- 姓名 -->
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"  type="password"></el-input>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-form-item class="sign">
        <el-button type="primary" @click="onSubmit('ruleForm')">登录</el-button>
      </el-form-item>

    </el-form>
    
  </div>
</template>

<script>
import { postLogin } from 'network/login.js'
import { asyncRoutes } from '../../router'
export default {
  name:'Login',
  components:{
    
  },
  data() {
    return {
      form: {
        name:'master',
        password:'123456'
      },
      rules: {
        name:[
          { required: true, message: '请输入用户名',trigger: 'blur'},
          { min: 3, max: 10, message: '长度 3 到 10 个字符',trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入密码',trigger: 'blur'},
          { min: 6, max: 20, message: '长度 6 到 20 个字符',trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    onSubmit() {
      const user = {
        id: this.form.name,
        pw: this.form.password
      }
      postLogin(user).then(res => {
        if(res.data.code==200) {
          // 把登录用户存到vuex内
          this.$router.addRoutes(asyncRoutes);
          if(this.$route.path.indexOf('/index')===-1) {
              this.$router.push('/index');
          }
        } else if(res.data.code==400) {
          alert("用户名或者密码错误");
        }
      })
    }
  },
  computed: {

  }
}
</script>

<style>
  #login {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-image: url('../../assets/img/login_bg.png');
    background-size: cover;
  }
  #title {
    font-size: 35px;
    font-family: Helvetice;
    font-weight: bolder;
    text-align: center;
    margin: 20px 0;
    transform: translateX(-13px);
  }
  .el-form {
    color: rgb(8, 47, 83);
    width: 330px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .el-form-item__label {
    color: white;
  }
  .el-form-item {
    width: 300px;
    transform: translateX(-14%);
  }
  .el-form-item.sign {
    transform: translateX(5%);
  }
</style>