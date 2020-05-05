<template>
  <el-menu
    :default-active="activeIndex"
    class="menu"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <!--logo-->
    <el-menu-item class="menu-item">
      <!-- <img width="50px" src="@/assets/logo.png"> -->
      <span id="logo-title">隧道健康基础数据平台</span>
    </el-menu-item>

    <el-menu-item index="1" class="menu-item el-icon-s-home">首页</el-menu-item>

    <!-- <el-menu-item index="2" class="menu-item el-icon-edit" :disabled="!isLogin">发表</el-menu-item> -->

    <el-submenu index="3" class="menu-item" :show-timeout="0" :hide-timeout="0">
      <!--二级菜单标题-->
      <template slot="title">
        <span v-if="isLogin" class="submenu-title">
          <!-- <img :src="avatar" class="avatar" /> -->
          {{name}}
        </span>
        <span class="submenu-title el-icon-user-solid" v-else>游客</span>
      </template>

      <!--已登录-->
      <div v-if="isLogin">
        <!-- <el-menu-item index="3-1" class="el-icon-s-custom sbumenu-menu-item">个人中心</el-menu-item>
        <el-menu-item index="3-2" class="el-icon-message-solid sbumenu-menu-item">我的消息</el-menu-item>-->
        <el-menu-item index="3-3" class="el-icon-circle-close sbumenu-menu-item">退出系统</el-menu-item>
      </div>

      <!--未登录-->
      <div v-else>
        <el-menu-item index="3-4" class="el-icon-star-on sbumenu-menu-item">登录</el-menu-item>
      </div>
    </el-submenu>

    <el-dialog :visible.sync="showLoginDialog" center :close-on-click-modal="false" width="25%">
      <div slot="title">感谢使用隧道健康基础数据平台</div>
      <!-- <div slot="footer">感谢使用55mm</div> -->
      <el-tabs type="border-card" lazy="true" :stretch="true">
        <el-tab-pane label="登录">
          <el-form
            :model="loginForm"
            status-icon
            :rules="loginRules"
            ref="loginForm"
            class="loginForm"
          >
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
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </el-menu>
</template>

<script>
import { setCookie, getCookie, delCookie } from "@/utils/cookie.js";
import EventVue from "@/utils/EventVue.js";
import store from "@/vuex/store.js";
export default {
  name: "Header",
  store,
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
      activeIndex: "1",
      isLogin: false,
      showLoginDialog: false,
      resetPassword: false,

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
    handleSelect(key, keyPath) {
      if (key == "1") {
        this.activeIndex = "1";
        this.$router.push("/main");
      } else if (key == "2") {
        this.activeIndex = "2";
        this.$router.push("/write");
      } else if (key == "3-1") {
        this.activeIndex = "3";
        this.$router.push("/user");
      } else if (key == "3-2") {
        this.activeIndex = "3";
        this.$router.push("/message");
      } else if (key == "3-3") {
        this.activeIndex = "3";
        this.$confirm("确认退出吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$message({
            message: "退出成功",
            type: "success",
            center: true,
            duration: 2000
          });
          this.isLogin = false;

          delCookie("userInfo");
          this.$store.commit("addUserInfo", "");
          this.$store.commit("addMyActions", "");
          sessionStorage.removeItem("userInfo");
          this.$router.push("/login");
        });
      } else if (key == "3-4") {
        this.activeIndex = "3";
        this.showLoginDialog = true;
      }
    },

    login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$Loading.start();

          let data = {
            account: this.loginForm.account,
            password: this.loginForm.password
          };

          if (data.account == "admin" && data.password == "12345678") {
            this.$Loading.finish();

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

            this.isLogin = true;
            this.showLoginDialog = false;
            this.loginForm.password = "";

            // this.$router.push("/main/info");
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
  },
  mounted() {
    /*页面挂载获取cookie，如果存在userInfo的cookie，则已登录*/
    if (getCookie("userInfo")) {
      this.isLogin = true;
      //通过cookie设置vuex
      this.$store.commit("addUserInfo", JSON.parse(getCookie("userInfo")));
    }

    //接收登录请求
    EventVue.$on("login", message => {
      this.showLoginDialog = true;
    });
  },
  computed: {
    name: function() {
      return "admin";
    }
  }
};
</script>

<style scoped>
.menu {
  width: 95%;
  margin: 10px auto;
  /* max-width: 1200px; */
  font-size: 24px;
}
.menu-item {
  font-size: 24px;
  font-weight: bold;
  width: 33%;
}
.submenu-title {
  font-size: 24px;
}
.sbumenu-menu-item {
  display: block;
  font-size: 18px;
  width: 100%;
  letter-spacing: 10px;
  text-align: center;
  margin-top: 5px;
  font-weight: bold;
}

#logo-title {
  font-size: 24px;
  font-weight: bold;
  color: #1f9b90;
}

.login-btn {
  margin: 20px auto;
  width: 100%;
}

.loginForm {
  margin: 0 auto;
  padding: 0px 50px 0px 50px;
}
</style>