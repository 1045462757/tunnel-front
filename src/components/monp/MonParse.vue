<template>
  <transition name="el-zoom-in-center">
    <el-card class="card" v-show="showCard" shadow="hover">
      <div slot="header">
        <span id="title">监测点数据解析</span>
      </div>

      <el-select v-model="tunnelId" placeholder="请选择隧道" @change="getMonpList()">
        <el-option
          v-for="item in tunnelList"
          :key="item.tunnelId"
          :label="item.tunnelName"
          :value="item.tunnelId"
        ></el-option>
      </el-select>

      <el-select v-model="monpId" placeholder="请选择监测点">
        <el-option
          v-for="item in monpList"
          :key="item.monpId"
          :label="item.monpName"
          :value="item.monpId"
        ></el-option>
      </el-select>

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
      ></el-date-picker>

      <el-button type="primary" round @click="parse()" icon="el-icon-edit" class="btn">确定</el-button>

      <div id="example"></div>
      <!-- <div v-loading="loading" element-loading-text="正在解析..." class="main">
        <div v-if="loadingSuccess">
          <div id="example"></div>
        </div>
        <Tip v-else :tip="tip" v-on:refresh="parse()"></Tip>
      </div>-->
    </el-card>
  </transition>
</template>

<script>
import echarts from "echarts";
import Tip from "@/components/general/Tip";
import store from "@/vuex/store.js";
export default {
  name: "MonParse",
  components: { Tip },
  store,
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

      tunnelList: [],
      monpList: [],
      monpDataList: [],

      tunnelId: "",
      monpId: "",

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

      time: "",

      monpDataTime: [],
      monpDataValue: []
    };
  },
  methods: {
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

    getMonpList() {
      let data = {
        tunnelId: this.tunnelId
      };

      this.$http
        .get(this.globalApi.ListIdAndNameForMonp, { params: data })
        .then(
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
            if (response.data.monpList == null) {
              console.log("monpList为空");

              return;
            }

            this.monpList = response.data.monpList;
          },
          err => {
            // console.log(err);

            this.loading = false;

            console.log("status:" + err.status);
            console.log("statusText:" + err.statusText);
          }
        );
    },

    parse() {
      if (
        this.tunnelId.length == 0 ||
        this.monpId.length == 0 ||
        this.time.length == 0
      ) {
        this.$message({
          message: "请选择隧道，监测点和时间",
          type: "warning",
          center: true,
          duration: 1000
        });
      } else {
        //状态初始化
        this.loading = true;
        this.loadingSuccess = false;
        this.monpDataList = [];
        this.monpDataTime = [];
        this.monpDataValue = [];
        this.tip.show = false;
        this.tip.netError = false;
        this.tip.businessError = false;
        this.tip.errorMessage = "";

        let data = {
          monpId: this.monpId,
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

            this.monpDataList.forEach(item => {
              this.monpDataTime.push(item.time);
              this.monpDataValue.push(item.value);
            });

            var echarts = require("echarts");

            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById("example"));
            myChart.setOption({
              xAxis: {
                data: this.monpDataTime
              },
              series: [
                {
                  data: this.monpDataValue
                }
              ]
            });

            myChart.resize();
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
    }
  },
  mounted() {
    this.showCard = true;
    this.getTunnelList();

    var echarts = require("echarts");

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("example"));

    // 绘制图表
    myChart.setOption({
      tooltip: {
        show: true,
        trigger: "axis"
      },
      xAxis: {
        name: "时间",
        type: "category",
        show: false,
        data: this.monpDataTime
      },
      yAxis: {
        name: "深部位移监测-深部位移",
        type: "value",
        min: -15,
        max: 22,
        splitNumber: 20
      },
      series: [
        {
          data: this.monpDataValue,
          type: "line"
        }
      ]
    });

    // 建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
    // window.addEventListener("resize", function() {
    //   myChart.resize();
    // });
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

.main {
  /* width: 95%; */
  /* max-width: 950px; */
  margin: 20px auto;
  min-height: 500px;
}

#example {
  width: 100%;
  min-height: 500px;
  /* border: 1px solid red; */
  margin: 20px auto;
}
</style>
