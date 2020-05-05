<template>
  <transition name="el-zoom-in-center">
    <el-card class="card" v-show="showCard" shadow="hover">
      <div slot="header">
        <span id="title">修改监测点信息</span>
        <el-page-header @back="goBack"></el-page-header>
      </div>

      <div v-loading="loading" element-loading-text="玩命加载中..." class="main">
        <div v-if="loadingSuccess">
          <el-form
            :model="monp"
            :inline="true"
            label-position="right"
            label-width="150px"
            id="form"
          >
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

          <el-button type="primary" round @click="modify()" icon="el-icon-edit" class="btn">确定</el-button>
        </div>
      </div>
    </el-card>
  </transition>
</template>

<script>
import Tip from "@/components/general/Tip";
import store from "@/vuex/store.js";
export default {
  name: "ModifyMon",
  store,
  components: { Tip },
  data() {
    return {
      showCard: false,

      loading: true,
      loadingSuccess: false,

      tip: {
        show: false,
        netError: false,
        businessError: false,
        errorMessage: ""
      },

      monp: {}
    };
  },
  methods: {
    modify() {
      this.$confirm("确认修改吗", "提示", {
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
      if (this.monp.name.length == 0) {
        this.$message({
          message: "请输入名称",
          type: "warning",
          center: true,
          duration: 1000
        });
      } else {
        this.$Loading.start();

        this.$http.put(this.globalApi.ModifyMonpApi, this.monp).then(
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
                message: "修改失败:" + response.data.errorMessage,
                type: "error",
                center: true,
                duration: 2000
              });
              return;
            }

            //success
            this.$message({
              message: "修改成功",
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
              message: "修改失败:服务器异常",
              type: "error",
              center: true,
              duration: 2000
            });
          }
        );
      }
    },

    GetMonp() {
      //vuex存在数据
      if (this.$store.state.tunnel != null) {
        // this.loading = false;
        // this.loadingSuccess = true;
        // this.focus = this.$store.state.focus;
        // this.pages = this.focus.slice(
        //   (this.page.currentPage - 1) * 10,
        //   this.page.currentPage * 10
        // );
      } else {
        //从服务器获取数据

        //状态初始化
        this.loading = true;
        this.loadingSuccess = false;
        this.tip.show = false;
        this.tip.netError = false;
        this.tip.businessError = false;
        this.tip.errorMessage = "";

        let data = {
          monpId: this.$route.query.monpId
        };

        this.$http.get(this.globalApi.GetMonpApi, { params: data }).then(
          response => {
            // console.log(response);

            this.loading = false;

            if (response.data == null) {
              console.log("data为空");

              return;
            }

            //业务错误
            if (response.data.errorCode != null) {
              console.log("errorCode:" + response.data.errorCode);
              console.log("errorMessage:" + response.data.errorMessage);

              this.tip.show = true;
              this.tip.businessError = true;
              this.tip.errorMessage = response.data.errorMessage;
              return;
            }

            if (response.data.monp == null) {
              console.log("monp为空");

              this.tip.show = true;
              this.tip.businessError = true;
              this.tip.errorMessage = "monp为空";
              return;
            }

            this.loadingSuccess = true;

            this.monp = response.data.monp;
          },
          err => {
            // console.log(err);

            this.loading = false;

            console.log("status:" + err.status);
            console.log("statusText:" + err.statusText);

            //异常处理
            this.tip.show = true;
            this.tip.netError = true;
          }
        );
      }
    },

    goBack() {
      this.$router.back(-1);
    }
  },
  mounted() {
    this.showCard = true;

    this.GetMonp();
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

.main {
  /* width: 95%; */
  /* margin: 0 auto; */
  /* max-width: 950px; */
  min-height: 600px;
}

#title {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 10px;
}

.label {
  font-size: 20px;
  color: darkcyan;
}

.btn {
  margin-top: 20px;
}
</style>
