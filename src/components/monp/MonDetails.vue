<template>
  <transition name="el-zoom-in-center">
    <el-card class="card" shadow="hover" v-show="showCard">
      <div slot="header">
        <span id="title">监测点数据</span>
        <el-page-header @back="goBack"></el-page-header>
      </div>

      <el-date-picker
        v-model="time"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="getMonpData()"
      ></el-date-picker>

      <div v-loading="loading" element-loading-text="玩命加载中..." class="main">
        <div v-if="loadingSuccess">
          <el-table :data="monpDataList" border stripe max-height="600px" id="table">
            <el-table-column prop="time" label="监测时间"></el-table-column>
            <el-table-column prop="value" label="监测数据"></el-table-column>
          </el-table>
        </div>
        <Tip v-else :tip="tip" v-on:refresh="getMonpData()"></Tip>
      </div>
    </el-card>
  </transition>
</template>

<script>
import Tip from "@/components/general/Tip";
import store from "@/vuex/store.js";
export default {
  name: "MonDetails",
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

      monpDataList: [],

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },

      time: ""
    };
  },
  methods: {
    getMonpData() {
      //状态初始化
      this.loading = true;
      this.loadingSuccess = false;
      this.monpData = [];
      this.tip.show = false;
      this.tip.netError = false;
      this.tip.businessError = false;
      this.tip.errorMessage = "";

      let data = {
        monpId: this.$route.query.monpId,
        time: JSON.stringify(this.time)
      };

      this.$http.get(this.globalApi.ListMonpDataApi, { params: data }).then(
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
          if (response.data.monpDataList == null) {
            console.log("monpDataList为空");

            this.tip.show = true;
            this.tip.businessError = true;
            this.tip.errorMessage = "monpDataList为空";
            return;
          }

          this.loadingSuccess = true;
          this.monpDataList = response.data.monpDataList;
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

    goBack() {
      this.$router.back(-1);
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

.main {
  /* width: 95%; */
  /* max-width: 950px; */
  margin: 20px auto;
  /* min-height: 600px; */
}

#title {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 10px;
}

#name {
  font-size: 32px;
  font-weight: bold;
  color: brown;
}

#describe {
  font-size: 18px;
}

.label {
  font-size: 20px;
  color: darkcyan;
}

#table {
  width: 60%;
  margin: 20px auto;
}
</style>
