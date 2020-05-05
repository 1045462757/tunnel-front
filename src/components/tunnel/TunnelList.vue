<template>
  <transition name="el-zoom-in-center">
    <el-card class="card" shadow="hover" v-show="showCard">
      <div slot="header">
        <span id="title">隧道目录</span>
      </div>

      <div v-loading="loading" element-loading-text="玩命加载中..." class="main">
        <div v-if="loadingSuccess">
          <el-table :data="tunnelList" style="width: 100%" border stripe max-height="600px">
            <el-table-column prop="tunnelName" label="名称"></el-table-column>
            <el-table-column prop="tunnelIntro" label="简介"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="medium" type="primary" @click="handleMore(scope.row)">详情</el-button>
                <el-button size="medium" type="success" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button
                  size="medium"
                  type="danger"
                  @click="handleDelete(scope.$index,scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <div id="page" v-show="page.showPage">
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="10"
              :page-count="page.totalPages"
              @current-change="handleCurrentChange"
              :current-page="page.currentPage"
            ></el-pagination>
          </div>
        </div>
        <Tip v-else :tip="tip" v-on:refresh="ListTunnel()"></Tip>
      </div>
    </el-card>
  </transition>
</template>

<script>
import Tip from "@/components/general/Tip";
import store from "@/vuex/store.js";
export default {
  name: "TunnelList",
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

      page: {
        showPage: false,
        currentPage: 1,
        totalPages: 1
      },

      tunnelList: []
    };
  },
  methods: {
    //分页
    handleCurrentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.ListTunnel();
    },

    //获取动态
    ListTunnel() {
      //vuex存在数据
      if (this.$store.state.tunnelList.length != 0) {
        // this.loading = false;
        // this.loadingSuccess = true;
        // this.tunnelList = this.$store.state.tunnelList;
        // this.pages = this.tunnelList.slice(
        //   (this.page.currentPage - 1) * 10,
        //   this.page.currentPage * 10
        // );
        return;
      }

      //从服务器获取数据

      //状态初始化
      this.loading = true;
      this.loadingSuccess = false;
      this.tunnelList = [];
      this.tip.show = false;
      this.tip.netError = false;
      this.tip.businessError = false;
      this.tip.errorMessage = "";
      this.page.showPage = false;

      let data = {
        pageIndex: this.page.currentPage
      };

      this.$http.get(this.globalApi.ListTunnelApi, { params: data }).then(
        response => {
          // console.log(response);

          this.loading = false;

          //无返回数据
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

          //无数据
          if (response.data.tunnelList == null) {
            console.log("tunnelList为空");

            this.tip.show = true;
            this.tip.businessError = true;
            this.tip.errorMessage = "tunnelList为空";
            return;
          }

          this.loadingSuccess = true;
          this.tunnelList = response.data.tunnelList;

          this.page.showPage = true;
          if (
            response.data.currentPage != null &&
            response.data.totalPage != null
          ) {
            this.page.currentPage = response.data.currentPage;
            this.page.totalPages = response.data.totalPage;
          }

          //存入vuex;
          // this.$store.commit("addFans", response.data.data);
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
    },

    handleMore(row) {
      this.$router.push({
        path: "/main/tunnelDetails",
        query: { tunnelId: row.tunnelId }
      });
    },

    handleEdit(row) {
      this.$router.push({
        path: "/main/modifyTunnel",
        query: { tunnelId: row.tunnelId }
      });
    },

    handleDelete(index, row) {
      this.$confirm("确认删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delete(index, row.tunnelId);
        })
        .catch(() => {});
    },

    delete(index, tunnelId) {
      let data = {
        tunnelId: tunnelId
      };

      this.$Loading.start();

      this.$http
        .delete(this.globalApi.DeleteTunnelApi, {
          body: data,
          emulateJSON: true
        })
        .then(
          response => {
            // console.log(response);

            this.$Loading.finish();

            if (response.data == null) {
              console.log("data为空");

              return;
            }

            //业务错误
            if (response.data.errorCode != null) {
              console.log("errorCode:" + response.data.errorCode);
              console.log("errorMessage:" + response.data.errorMessage);

              this.$message({
                message: "删除失败:" + response.data.errorMessage,
                type: "error",
                center: true,
                duration: 2000
              });
              return;
            }

            //success
            this.$message({
              message: "删除成功",
              type: "success",
              center: true,
              duration: 2000
            });

            this.tunnelList.splice(index, 1);
          },
          err => {
            // console.log(err);

            this.$Loading.error();

            console.log("status:" + err.status);
            console.log("statusText:" + err.statusText);

            //异常处理
            this.$message({
              message: "删除失败:服务器异常",
              type: "error",
              center: true,
              duration: 2000
            });
          }
        );
    }
  },
  mounted() {
    this.showCard = true;

    this.ListTunnel();
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
  /* width: 95%;
  margin: 0 auto; */
  /* max-width: 950px; */
  min-height: 600px;
}

#title {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 10px;
}

#page {
  margin-top: 20px;
}
</style>
