<template>
  <transition name="el-zoom-in-center">
    <el-card class="card" v-show="showCard" shadow="hover">
      <div slot="header">
        <span id="title">添加监测点</span>
      </div>

      <el-select v-model="monp.tunnel.tunnelId" placeholder="请选择隧道">
        <el-option
          v-for="item in tunnelList"
          :key="item.tunnelId"
          :label="item.tunnelName"
          :value="item.tunnelId"
        ></el-option>
      </el-select>

      <el-form :model="monp" :inline="true" label-position="right" label-width="150px" id="form">
        <el-form-item label="监测点名称">
          <el-input v-model="monp.name"></el-input>
        </el-form-item>
        <el-form-item label="监测数据单位">
          <el-input v-model="monp.unit"></el-input>
        </el-form-item>
        <el-form-item label="监测点仪器">
          <el-input v-model="monp.instrument"></el-input>
        </el-form-item>
        <el-form-item label="监测频率描述">
          <el-input v-model="monp.rate"></el-input>
        </el-form-item>
        <el-form-item label="监测仪器操作人员">
          <el-input v-model="monp.contractor"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="monp.remarks"></el-input>
        </el-form-item>
      </el-form>

      <el-button type="primary" round @click="add()" icon="el-icon-edit" class="btn">确定</el-button>
    </el-card>
  </transition>
</template>

<script>
import store from "@/vuex/store.js";
export default {
  name: "AddMon",
  components: {},
  store,
  data() {
    return {
      showCard: false,

      tunnelList: [],

      monp: {
        tunnel: {
          tunnelId: ""
        },
        name: "",
        unit: "",
        instrument: "",
        rate: "",
        contractor: "",
        remarks: ""
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

    getTunnelList() {
      this.$http.get(this.globalApi.ListIdAndName).then(
        response => {
          // console.log(response);

          //无返回数据
          if (response.data == null) {
            console.log("data为空");

            return;
          }

          //业务错误
          if (response.data.errorCode != null) {
            console.log("errorCode:" + response.data.errorCode);
            console.log("errorMessage:" + response.data.errorMessage);

            return;
          }

          //无数据
          if (response.data.tunnelList == null) {
            console.log("tunnelList为空");

            return;
          }

          this.tunnelList = response.data.tunnelList;
        },
        err => {
          // console.log(err);

          this.loading = false;

          console.log("status:" + err.status);
          console.log("statusText:" + err.statusText);
        }
      );
    },

    submit() {
      if (this.monp.tunnel.tunnelId.length == 0 || this.monp.name.length == 0) {
        this.$message({
          message: "请选择隧道和输入名称",
          type: "warning",
          center: true,
          duration: 1000
        });
      } else {
        this.$Loading.start();

        this.$http.post(this.globalApi.InsertMonpApi, this.monp).then(
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

            this.$router.push("/main/monList");

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
    this.getTunnelList();
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

#form {
  margin-top: 20px;
}
</style>
