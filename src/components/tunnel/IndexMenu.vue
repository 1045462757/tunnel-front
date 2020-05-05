<template>
  <el-menu default-active="1" @select="handleSelect">
    <el-submenu index="1" class="menu-mainItem">
      <template slot="title">
        <i class="el-icon-star-on"></i>
        <span class="menu-item">隧道设置</span>
      </template>
      <el-menu-item-group title="隧道">
        <el-menu-item index="1-1" class="menu-minItem el-icon-star-off">隧道目录</el-menu-item>
        <el-menu-item index="1-2" class="menu-minItem el-icon-star-off">添加隧道</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="监测点">
        <el-menu-item index="1-3" class="menu-minItem el-icon-star-off">监测点目录</el-menu-item>
        <el-menu-item index="1-4" class="menu-minItem el-icon-star-off">添加监测点</el-menu-item>
      </el-menu-item-group>
    </el-submenu>

    <el-submenu index="2" class="menu-mainItem">
      <template slot="title">
        <i class="el-icon-star-on"></i>
        <span class="menu-item">数据分析</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="2-1" class="menu-minItem el-icon-star-off">监测数据</el-menu-item>
        <!-- <el-menu-item index="2-2" class="menu-minItem el-icon-star-off">数据解析</el-menu-item>
        <el-menu-item index="2-3" class="menu-minItem el-icon-camera-solid">我发起的约拍</el-menu-item>
        <el-menu-item index="2-4" class="menu-minItem el-icon-document">我的草稿</el-menu-item>-->
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "IndexMenu",
  methods: {
    handleSelect(key, keyPath) {
      if (key == "1-1") {
        this.$router.push("/main/tunnelList");
      } else if (key == "1-2") {
        this.$router.push("/main/addTunnel");
      } else if (key == "1-3") {
        this.$router.push("/main/monList");
      } else if (key == "1-4") {
        this.$router.push("/main/addMon");
      } else if (key == "2-1") {
        this.$router.push("/main/monParse");
      } else if (key == "2-2") {
        // this.$router.push("/user/myActions");
      } else if (key == "2-3") {
        // this.$router.push("/user/myCollection");
      }
    }
  }
};
</script>

<style scoped>
.menu-item {
  font-size: 24px;
  font-weight: bold;
  color: purple;
}
.menu-minItem {
  font-size: 18px;
  font-weight: bold;
}
</style>

