<template>
  <div>
    <el-form :rules="rules"
             v-loading="loading"
             element-loading-text="正在登录中..."
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             ref="loginForm"
             :model="loginForm"
             class="loginContainer">
      <div style="display: flex;flex-direction: column;align-items: center;justify-content: center">
        <img src="../../../public/hungry.png" style="height:40px;"/>
        <h3 class="loginTitle">hungry后台系统登录</h3>
      </div>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" placeholder="请输入用户名" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input type="text" v-model="loginForm.code" placeholder="点击图片更换验证码" auto-complete="off"
                  style="width:230px;margin-right: 15px"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha"/>
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-button type="primary" class="loginBtn" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import {postRequest} from "@/utils/api";

export default {
  name: 'Login',
  data() {
    return {
      loading:false,
      checked: true,
      captchaUrl: '/captcha?time=' + new Date(),
      loginForm: {
        username: 'root',
        password: '123',
        code: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    updateCaptcha() {
      this.captchaUrl = '/captcha?time=' + new Date();
    },
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading=true;
          console.log(this.loginForm);
          this.postRequest('/login', this.loginForm).then(resp => {
            if (resp){
              this.loading=false;
              console.log(resp);
              //存储用户token
              const tokenStr=resp.data.tokenHead+resp.data.token;
              window.sessionStorage.setItem('tokenStr',tokenStr)
              //跳转首页
              //this.$router.replace('/home')
              let path=this.$route.query.redirect;
              console.log(path);
              this.$router.replace((path=='/'||path==undefined)?'/home':path);
            }
          })
        } else {
          console.log('error submit!!');
          this.$message.error('请输入正确的字段！');
          return false;
        }
      });
    }
  }
}
</script>

<style>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #caca6c;
}

.loginTitle {
  margin: 0px auto 15px auto;
  text-align: center;
}

.loginBtn {
  width: 100%;
}

.loginRemember {
  text-align: left;
  margin-bottom: 15px;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>
