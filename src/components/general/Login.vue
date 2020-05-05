<template>
  <div class="main">
    <h1>隧道健康基础数据平台</h1>

    <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginForm" class="loginForm">
      <el-form-item label="账号" prop="account">
        <el-input
          v-model="loginForm.account"
          clearable
          placeholder="请输入账号"
          @keyup.enter.native="login('loginForm')"
        ></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          autocomplete="off"
          clearable
          show-password
          @keyup.enter.native="login('loginForm')"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button class="login-btn" type="primary" @click="login('loginForm')" round>登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setCookie, getCookie, delCookie } from "@/utils/cookie.js";
import store from "@/vuex/store.js";
export default {
  name: "Login",
  data() {
    //校验账号
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else {
        callback();
      }
    };
    //校验密码
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 8) {
        return callback(new Error("密码不能小于8位"));
      } else {
        if (this.loginForm.checkPass !== "") {
          this.$refs.loginForm.validateField("checkPass");
        }
        callback();
      }
    };

    return {
      loginForm: {
        account: "",
        password: ""
      },
      loginRules: {
        account: [{ validator: checkAccount, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  methods: {
    /**登录 */
    login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            account: this.loginForm.account,
            password: this.loginForm.password
          };

          if (data.account == "admin" && data.password == "12345678") {
            this.$message({
              message: "登录成功",
              type: "success",
              center: true,
              duration: 2000
            });

            //用户信息存入cookie
            setCookie("userInfo", JSON.stringify(data), 1000 * 60);

            //用户信息存入vuex
            this.$store.commit("addUserInfo", data);

            this.$router.push("/main");
          } else {
            this.$message({
              message: "账号或密码错误",
              type: "error",
              center: true,
              duration: 2000
            });
            this.loginForm.password = "";
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.main {
  margin-top: 250px;
}

.loginForm {
  width: 20%;
  margin: 0 auto;
  padding: 0px 50px 0px 50px;
}
</style>
