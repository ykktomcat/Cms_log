<template>
  <div class="homeView" style="overflow-y:hidden;">
    <el-container>
      <el-header>
        <div class="logo" @click="goHome">
          <img v-bind:src="imgUrl" />
          <div class="text">日志计划管理系统</div>
        </div>

        <div class="upLogin">
          <!-- 登录后显示用户名 -->
          <el-button
            @click="goModpassword"
            type="primary"
            icon="el-icon-user-solid"
            round
          >{{userinfo}}</el-button>
          <el-popconfirm title="确认退出登录吗？" @confirm="outLogin">
            <el-button type="danger" slot="reference" round>退出登录</el-button>
          </el-popconfirm>
        </div>
      </el-header>

      <el-container>
        <el-aside :width="isCollapse ? '64px': '150px'">
          <div class="fold" @click="clickFold">
            <el-tooltip effect="dark" content="折叠" placement="right">
              <i class="el-icon-arrow-left" v-show="!isCollapse"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="展开" placement="right">
              <i class="el-icon-arrow-right" v-show="isCollapse"></i>
            </el-tooltip>
          </div>
          <el-menu
            background-color="#304156"
            text-color="rgba(255,255,255,0.6)"
            active-text-color="#fff"
            :collapse="isCollapse"
            :collapse-transition="collapseFlash"
            router
          >
            <el-menu-item index="/welcome">
              <i class="el-icon-s-data" size="mini"></i>
              <span slot="title">欢迎页</span>
            </el-menu-item>

            <el-menu-item index="/cmslogquery">
              <i class="el-icon-search" size="mini"></i>
              <span slot="title">查询日志</span>
            </el-menu-item>
            <el-menu-item index="/cmslogadd">
              <i class="el-icon-document-add" size="mini"></i>
              <span slot="title">新增日志</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-dialog
          title="修改密码"
          :visible.sync="dialogFormVisible"
          width="40%"
          :close-on-click-modal="false"
          @close="resetForm('ruleForm')"
        >
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            label-position="right"
          >
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm('ruleForm')">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          </div>
        </el-dialog>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { modpsAxios } from "../../network/networks";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userinfo: "",
      isCollapse: true,
      collapseFlash: false,
      imgUrl: require("../../assets/cmslog.png"),

      dialogFormVisible: false,

      ruleForm: {
        username: this.$local.get("username"),
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  // components: {},
  mounted() {
    //打开时获取登录名
    this.userinfo = this.$local.get("username");
    //console.log(this.userinfo);
  },

  methods: {
    //点击图片返回首页
    goHome() {
      this.$router.push("/welcome");
    },
    //显示密码弹窗
    goModpassword() {
      this.dialogFormVisible = true;
    },

    //表单提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //封装后的用户请求接口
          modpsAxios(this.ruleForm).then(res => {
            if (res.data.code === 1) {
              this.$message.success("密码修改成功");
              this.resetForm("ruleForm");
              this.dialogFormVisible = false;
            } else {
              this.$message.error(res.data.data);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //表单重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },

    //展开和折叠菜单
    clickFold() {
      this.isCollapse = !this.isCollapse;
    },

    //退出按钮 清空token
    outLogin() {
      window.sessionStorage.removeItem("token");
      //清空 admin  username
      window.localStorage.removeItem("username");
      window.localStorage.removeItem("admin");
      //localStorage.clear();
      this.$message.success("退出成功");
      this.$router.push("/");
    }
  }
};
</script>

<style lang="less" scoped>
.homeView {
  height: 100%;
}
.el-header {
  background: #17253f;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  .logo {
    display: flex;
    align-items: center;
    img {
      display: block;
      height: 80%;
    }
    .text {
      font-size: 26px;
      color: rgba(255, 255, 255, 0.6);
      padding-left: 20px;
    }
  }
}
.el-aside {
  background: #304156;
  position: relative;
  .el-menu {
    border-right: none;
  }
  .fold {
    background: #304156;
    position: absolute;
    color: #ccc;
    width: 30px;
    line-height: 60px;
    text-align: center;
    right: 0;
    top: calc(50% - 30px);
    font-size: 15px;
  }
}
.el-container {
  background: #f8f8f8;
  height: 100%;
}
</style>