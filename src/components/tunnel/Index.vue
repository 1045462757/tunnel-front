<template>
  <transition name="el-zoom-in-center">
    <el-card class="card" v-show="showCard" shadow="hover">
      <!--左侧导航栏-->
      <div id="left">
        <IndexMenu></IndexMenu>
      </div>

      <!--右侧路由-->
      <div id="right">
        <router-view></router-view>
      </div>

      <!--回到顶部-->
      <BackTop :height="100" :bottom="30" :duration="1500">
        <div class="top el-icon-top"></div>
      </BackTop>
    </el-card>
  </transition>
</template>

<script>
import IndexMenu from "@/components/tunnel/IndexMenu";
export default {
  name: "Index",
  components: { IndexMenu },
  data() {
    return {
      showCard: false
    };
  },
  mounted() {
    this.showCard = true;
  }
};
</script>

<style scoped>
.card {
  width: 95%;
  margin: 20px auto;
  border-radius: 10px;
  /* max-width: 1200px; */
  min-height: 800px;
}
#left {
  width: 15%;
  margin-top: 20px;
  float: left;
}
#right {
  width: 85%;
  float: right;
}

.top {
  padding: 10px;
  background: rgba(0, 153, 229, 0.7);
  color: #fff;
  text-align: center;
  border-radius: 2px;
}
</style>