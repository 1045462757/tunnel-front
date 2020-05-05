<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import store from "@/vuex/store.js";
export default {
  name: "App",
  store,
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("userInfo")) {
      this.$store.commit(
        "addUserInfo",
        JSON.parse(sessionStorage.getItem("userInfo"))
      );
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem(
        "userInfo",
        JSON.stringify(this.$store.state.userInfo)
      );
    });
  }
};
</script>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  background: #e0e0e0 !important;
}
* {
  padding: 0px;
  margin: 0px;
}
</style>
