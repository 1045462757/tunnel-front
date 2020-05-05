<template>
  <transition name="el-zoom-in-center">
    <el-card class="card" v-show="showCard" shadow="hover">
      <div slot="header">
        <span id="title">添加隧道</span>
      </div>

      <el-form :model="tunnel" label-position="top">
        <el-form-item label="名称">
          <el-input v-model="tunnel.tunnelName" style="width: 50%;"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="tunnel.tunnelIntro" type="textarea" autosize style="width: 50%;"></el-input>
        </el-form-item>
      </el-form>

      <el-button type="primary" round @click="add()" icon="el-icon-edit" class="btn">确定</el-button>
    </el-card>
  </transition>
</template>

<script>
import store from "@/vuex/store.js";
export default {
  name: "AddTunnel",
  store,
  data() {
    return {
      showCard: false,

      tunnel: {
        tunnelName: "",
        tunnelIntro: ""
      }
    };
  },
  methods: {
    /**
     * 提交表单
     */
    add() {
      this.$confirm("确认添加吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.submit();
        })
        .catch(() => {});
    },

    submit() {
      if (
        this.tunnel.tunnelName.length == 0 ||
        this.tunnel.tunnelIntro.length == 0
      ) {
        this.$message({
          message: "请输入名称和简介",
          type: "warning",
          center: true,
          duration: 1000
        });
      } else {
        this.$Loading.start();

        let data = {
          tunnelName: this.tunnel.tunnelName,
          tunnelIntro: this.tunnel.tunnelIntro
        };

        this.$http
          .post(this.globalApi.InsertTunnelApi, data, { emulateJSON: true })
          .then(
            response => {
              // console.log(response);

              this.$Loading.finish();

              //无返回数据
              if (response.data == null) {
                console.log("data为空");

                return;
              }

              //业务错误
              if (response.data.errorCode != null) {
                console.log("errorCode:" + response.data.errorCode);
                console.log("errorMessage:" + response.data.errorMessage);

                this.$message({
                  message: "添加失败:" + response.data.errorMessage,
                  type: "error",
                  center: true,
                  duration: 2000
                });
                return;
              }

              //success
              this.$message({
                message: "添加成功",
                type: "success",
                center: true,
                duration: 2000
              });

              this.$router.push("/main/tunnelList");

              //清空vuex
              // this.$store.commit("addActions", "");
              // this.$store.commit("addMyActions", "");
            },
            err => {
              // console.log(err);

              this.$Loading.error();

              console.log("status:" + err.status);
              console.log("statusText:" + err.statusText);

              //异常处理
              this.$message({
                message: "添加失败:服务器异常",
                type: "error",
                center: true,
                duration: 2000
              });
            }
          );
      }
    }
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
  min-height: 700px;
}

#title {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 10px;
}

.btn {
  margin-top: 20px;
}

.label {
  font-size: 20px;
  color: darkcyan;
}
</style>
