<template>
  <div class="inner" style="overflow-y:hidden;">
    <el-form
      :model="loginForm"
      :rules="loginrules"
      ref="loginForm"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-container"
      status-icon
    >
      <h3 class="title">欢迎登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">登录</el-button>
        <el-button @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//导入封装的用户接口
import { loginAxios } from "../network/networks";
export default {
  data() {
    return {
      logining: false,
      loginForm: {
        username: "",
        password: ""
      },
      loginrules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" }
          //{ validator: validaePass }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
          //{ validator: validaePass2 }
        ]
      },
      checked: true
    };
  },
  methods: {
    handleSubmit(ev) {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          //封装后的用户请求接口
          loginAxios(this.loginForm).then(res => {
            if (res.data.code === 1) {
              //保存token到浏览器缓存

              window.sessionStorage.setItem("token", res.data.token);
              //用户名
              this.$local.set("username", res.data.name);
              //是否管理员
              this.$local.set("admin", res.data.admin);
              //window.sessionStorage.setItem("name", res.data.name);
              this.$message.success("登录成功");
              this.$router.push("home");
            } else {
              this.$message.error(res.data.data);
            }
          });
        } else {
          this.$message.error("用户名密码为必填项!");
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="less" scoped >
.inner {
  height: 100%;
}
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.remember {
  margin: 0px 0px 35px 0px;
}
</style>