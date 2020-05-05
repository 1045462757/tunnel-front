<template>
  <transition name="el-zoom-in-center">
    <el-card class="card" shadow="hover" v-show="showCard">
      <div slot="header">
        <span id="title">监测点目录</span>
      </div>

      <el-select v-model="tunnelId" @change="ListMonp()" placeholder="请选择隧道">
        <el-option
          v-for="item in tunnelList"
          :key="item.tunnelId"
          :label="item.tunnelName"
          :value="item.tunnelId"
        ></el-option>
      </el-select>

      <div v-loading="loading" element-loading-text="玩命加载中..." class="main">
        <div v-if="loadingSuccess">
          <el-table :data="monpList" style="width: 100%" border stripe max-height="600px">
            <el-table-column prop="name" label="监测点名称"></el-table-column>
            <el-table-column prop="unit" label="监测数据单位"></el-table-column>
            <el-table-column prop="instrument" label="监测点仪器"></el-table-column>
            <el-table-column prop="rate" label="监测频率描述"></el-table-column>
            <el-table-column prop="contractor" label="监测仪器操作人员"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column label="操作" min-width="130px">
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  type="primary"
                  @click="handleMore(scope.$index, scope.row)"
                >数据</el-button>
                <el-button
                  size="medium"
                  type="success"
                  @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button>
                <el-button
                  size="medium"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
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
          <Tip :tip="tip"></Tip>
        </div>
        <Tip v-else :tip="tip" v-on:refresh="ListMonp()"></Tip>
      </div>
    </el-card>
  </transition>
</template>

<script>
import Tip from "@/components/general/Tip";
import store from "@/vuex/store.js";
export default {
  name: "MonList",
  store,
  components: { Tip },
  data() {
    return {
      showCard: false,

      loading: false,
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

      tunnelId: "",

      tunnelList: [],

      monpList: [
        {
          monId: "CQJT6910001298",
          monName: "云南楚大高速九顶山隧道监测点一",
          monDanwei: "米",
          monDevice: "钻孔机",
          monDescribe: "2小时",
          monMan: "xxx",
          monNote: "xxx"
        },
        {
          monId: "CQJT6910001293",
          monName: "云南楚大高速九顶山隧道监测点二",
          monDanwei: "米",
          monDevice: "钻孔机",
          monDescribe: "2小时",
          monMan: "xxx",
          monNote: "xxx"
        },
        {
          monId: "CQJT6910001498",
          monName: "云南楚大高速九顶山隧道监测点三",
          monDanwei: "米",
          monDevice: "钻孔机",
          monDescribe: "2小时",
          monMan: "xxx",
          monNote: "xxx"
        },
        {
          monId: "CQJT6910023298",
          monName: "云南楚大高速九顶山隧道监测点四",
          monDanwei: "米",
          monDevice: "钻孔机",
          monDescribe: "2小时",
          monMan: "xxx",
          monNote: "xxx"
        },
        {
          monId: "CQJT6910004298",
          monName: "云南楚大高速九顶山隧道监测点五",
          monDanwei: "米",
          monDevice: "钻孔机",
          monDescribe: "2小时",
          monMan: "xxx",
          monNote: "xxx"
        }
      ]
    };
  },
  methods: {
    //分页
    handleCurrentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.ListMonp();
    },

    handleMore(index, row) {
      this.$router.push({
        path: "/main/monDetails",
        query: { monpId: row.monpId }
      });
    },

    handleEdit(index, row) {
      this.$router.push({
        path: "/main/modifyMon",
        query: { monpId: row.monpId }
      });
    },

    handleDelete(index, row) {
      this.$confirm("确认删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delete(index, row.monpId);
        })
        .catch(() => {});
    },

    delete(index, monpId) {
      let data = {
        monpId: monpId
      };

      this.$Loading.start();

      this.$http
        .delete(this.globalApi.DeleteMonpApi, {
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

            this.monpList.splice(index, 1);
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

    ListMonp() {
      //状态初始化

      this.loading = true;
      this.loadingSuccess = false;
      this.monpList = [];
      this.tip.show = false;
      this.tip.netError = false;
      this.tip.businessError = false;
      this.tip.errorMessage = "";
      this.page.showPage = false;

      let data = {
        tunnelId: this.tunnelId,
        pageIndex: this.page.currentPage
      };

      this.$http.get(this.globalApi.ListMonpApi, { params: data }).then(
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
          if (response.data.monpList == null) {
            console.log("monpList为空");

            this.tip.show = true;
            this.tip.businessError = true;
            this.tip.errorMessage = "monpList为空";
            return;
          }

          this.loadingSuccess = true;
          this.monpList = response.data.monpList;

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

.main {
  /* width: 95%;
  margin: 0 auto; */
  /* max-width: 950px; */
  margin: 20px auto;
  /* min-height: 600px; */
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
