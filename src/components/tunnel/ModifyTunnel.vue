<template>
  <transition name="el-zoom-in-center">
    <el-card class="card" v-show="showCard" shadow="hover">
      <div slot="header">
        <span id="title">修改隧道信息</span>
        <el-page-header @back="goBack"></el-page-header>
      </div>

      <div v-loading="loading" element-loading-text="玩命加载中..." class="main">
        <div v-if="loadingSuccess">
          <el-form :model="tunnel" label-position="top">
            <el-form-item label="名称">
              <el-input v-model="tunnel.tunnelName" style="width: 50%;"></el-input>
            </el-form-item>
            <el-form-item label="简介">
              <el-input v-model="tunnel.tunnelIntro" type="textarea" autosize style="width: 50%;"></el-input>
            </el-form-item>
          </el-form>

          <el-collapse>
            <el-collapse-item>
              <template slot="title">
                <span class="label">1、方案设计</span>
              </template>

              <el-form :model="tunnel" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="业主单位">
                  <el-input v-model="tunnel.projectDesign.ownerUnit"></el-input>
                </el-form-item>
                <el-form-item label="设计单位">
                  <el-input v-model="tunnel.projectDesign.designUnit"></el-input>
                </el-form-item>
                <el-form-item label="施工单位">
                  <el-input v-model="tunnel.projectDesign.constructionUnit"></el-input>
                </el-form-item>
                <el-form-item label="监理单位">
                  <el-input v-model="tunnel.projectDesign.supervisionUnit"></el-input>
                </el-form-item>
                <el-form-item label="公路等级">
                  <el-input v-model="tunnel.projectDesign.highwayGrade"></el-input>
                </el-form-item>
                <el-form-item label="地理位置描述">
                  <el-input v-model="tunnel.projectDesign.location"></el-input>
                </el-form-item>
                <el-form-item label="建筑限界">
                  <el-input v-model="tunnel.projectDesign.clearance"></el-input>
                </el-form-item>
                <el-form-item label="临空断面">
                  <el-input v-model="tunnel.projectDesign.openingSection"></el-input>
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <el-collapse-item>
              <template slot="title">
                <span class="label">2、初步设计</span>
              </template>

              <el-form :model="tunnel" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="隧道桩号坐标">
                  <el-input v-model="tunnel.preliminaryDesign.tunnelPileNumberCoordinates"></el-input>
                </el-form-item>
                <el-form-item label="沿桩衬砌类型">
                  <el-input v-model="tunnel.preliminaryDesign.typeOfLiningAlongPile"></el-input>
                </el-form-item>
                <el-form-item label="洞门衬砌">
                  <el-input v-model="tunnel.preliminaryDesign.davidLining"></el-input>
                </el-form-item>
                <el-form-item label="初喷混凝土">
                  <el-input v-model="tunnel.preliminaryDesign.primaryShotcrete"></el-input>
                </el-form-item>
                <el-form-item label="锚杆">
                  <el-input v-model="tunnel.preliminaryDesign.anchor"></el-input>
                </el-form-item>
                <el-form-item label="路面层">
                  <el-input v-model="tunnel.preliminaryDesign.pavementLayer"></el-input>
                </el-form-item>
                <el-form-item label="设备洞室">
                  <el-input v-model="tunnel.preliminaryDesign.equipmentCavern"></el-input>
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <el-collapse-item>
              <template slot="title">
                <span class="label">3、施工图设计</span>
              </template>

              <el-form :model="tunnel" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="洞门端墙">
                  <el-input v-model="tunnel.constructionDesign.davidSideWall"></el-input>
                </el-form-item>
                <el-form-item label="洞门填筑">
                  <el-input v-model="tunnel.constructionDesign.davidFilling"></el-input>
                </el-form-item>
                <el-form-item label="洞门衬砌">
                  <el-input v-model="tunnel.constructionDesign.davidLining"></el-input>
                </el-form-item>
                <el-form-item label="衬砌钢筋笼">
                  <el-input v-model="tunnel.constructionDesign.liningSteelCage"></el-input>
                </el-form-item>
                <el-form-item label="初喷混凝土">
                  <el-input v-model="tunnel.constructionDesign.primaryShotcrete"></el-input>
                </el-form-item>
                <el-form-item label="钢筋网">
                  <el-input v-model="tunnel.constructionDesign.steelFabric"></el-input>
                </el-form-item>
                <el-form-item label="工字钢架">
                  <el-input v-model="tunnel.constructionDesign.steel"></el-input>
                </el-form-item>
                <el-form-item label="锚杆">
                  <el-input v-model="tunnel.constructionDesign.anchor"></el-input>
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <el-collapse-item>
              <template slot="title">
                <span class="label">4、施工信息</span>
              </template>
              <el-form :model="tunnel" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="计划进度">
                  <el-input v-model="tunnel.constructionInformation.schedule"></el-input>
                </el-form-item>
                <el-form-item label="实际进度">
                  <el-input v-model="tunnel.constructionInformation.actualSchedule"></el-input>
                </el-form-item>
                <el-form-item label="初衬施工质量">
                  <el-input v-model="tunnel.constructionInformation.initial"></el-input>
                </el-form-item>
                <el-form-item label="二衬施工质量">
                  <el-input v-model="tunnel.constructionInformation.second"></el-input>
                </el-form-item>
                <el-form-item label="注浆施工质量">
                  <el-input v-model="tunnel.constructionInformation.grouting"></el-input>
                </el-form-item>
                <el-form-item label="锚杆施工质量">
                  <el-input v-model="tunnel.constructionInformation.bolt"></el-input>
                </el-form-item>
                <el-form-item label="隧道路面质量">
                  <el-input v-model="tunnel.constructionInformation.pavement"></el-input>
                </el-form-item>
                <el-form-item label="围岩变更">
                  <el-input v-model="tunnel.constructionInformation.changes"></el-input>
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <el-collapse-item>
              <template slot="title">
                <span class="label">5、周边环境</span>
              </template>
              <el-form :model="tunnel" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="地表水源">
                  <el-input v-model="tunnel.surroundingEnvironment.surfaceWater"></el-input>
                </el-form-item>
                <el-form-item label="地表水质">
                  <el-input v-model="tunnel.surroundingEnvironment.quality"></el-input>
                </el-form-item>
                <el-form-item label="潜水">
                  <el-input v-model="tunnel.surroundingEnvironment.diving"></el-input>
                </el-form-item>
                <el-form-item label="地下水质">
                  <el-input v-model="tunnel.surroundingEnvironment.groundWater"></el-input>
                </el-form-item>
                <el-form-item label="植被种类">
                  <el-input v-model="tunnel.surroundingEnvironment.vegetationType"></el-input>
                </el-form-item>
                <el-form-item label="植被根系">
                  <el-input v-model="tunnel.surroundingEnvironment.vegetationRootSystem"></el-input>
                </el-form-item>
                <el-form-item label="开挖洞渣">
                  <el-input v-model="tunnel.surroundingEnvironment.excavationHoleSlag"></el-input>
                </el-form-item>
                <el-form-item label="弃渣场地">
                  <el-input v-model="tunnel.surroundingEnvironment.abandonSlagField"></el-input>
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <el-collapse-item>
              <template slot="title">
                <span class="label">6、监测信息</span>
              </template>
              <el-form :model="tunnel" :inline="true" label-position="right" label-width="150px">
                <el-form-item label="地质及支护状态观察">
                  <el-input v-model="tunnel.monitoringInformation.state"></el-input>
                </el-form-item>
                <el-form-item label="地表下沉数据">
                  <el-input v-model="tunnel.monitoringInformation.surfaceSubsidenceData"></el-input>
                </el-form-item>
                <el-form-item label="地表下沉数据预警值">
                  <el-input v-model="tunnel.monitoringInformation.surfaceSubsidenceDataWarning"></el-input>
                </el-form-item>
                <el-form-item label="拱顶下沉数据">
                  <el-input v-model="tunnel.monitoringInformation.vaultSinkData"></el-input>
                </el-form-item>
                <el-form-item label="拱顶下沉数据预警值">
                  <el-input v-model="tunnel.monitoringInformation.vaultSinkDataWarning"></el-input>
                </el-form-item>
                <el-form-item label="洞内收敛数据">
                  <el-input v-model="tunnel.monitoringInformation.holeConvergenceData"></el-input>
                </el-form-item>
                <el-form-item label="洞内收敛数据预警值">
                  <el-input v-model="tunnel.monitoringInformation.holeConvergenceDataWarning"></el-input>
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <el-collapse-item>
              <template slot="title">
                <span class="label">7、地层基本信息</span>
              </template>
              <el-form :model="tunnel" :inline="true" label-position="right" label-width="150px">
                <el-form-item label="地层名">
                  <el-input v-model="tunnel.basicFormationInformation.name"></el-input>
                </el-form-item>
                <el-form-item label="地层年代">
                  <el-input v-model="tunnel.basicFormationInformation.year"></el-input>
                </el-form-item>
                <el-form-item label="地层岩性">
                  <el-input v-model="tunnel.basicFormationInformation.lithology"></el-input>
                </el-form-item>
                <el-form-item label="地层记录代码或编号">
                  <el-input v-model="tunnel.basicFormationInformation.code"></el-input>
                </el-form-item>
                <el-form-item label="风化程度">
                  <el-input v-model="tunnel.basicFormationInformation.degreeOfWeathering"></el-input>
                </el-form-item>
                <el-form-item label="承载力基本容许值">
                  <el-input
                    v-model="tunnel.basicFormationInformation.basicAllowableBearingCapacity"
                  ></el-input>
                </el-form-item>
                <el-form-item label="地层分布范围">
                  <el-input
                    v-model="tunnel.basicFormationInformation.dtratigraphicDistributionRange"
                  ></el-input>
                </el-form-item>
                <el-form-item label="倾向">
                  <el-input v-model="tunnel.basicFormationInformation.tendency"></el-input>
                </el-form-item>
                <el-form-item label="倾角">
                  <el-input v-model="tunnel.basicFormationInformation.angle"></el-input>
                </el-form-item>
                <el-form-item label="地层总体描述">
                  <el-input
                    v-model="tunnel.basicFormationInformation.overallStratigraphicDescription"
                  ></el-input>
                </el-form-item>
                <el-form-item label="关联文件索引">
                  <el-input v-model="tunnel.basicFormationInformation.associatedFileIndex"></el-input>
                </el-form-item>
              </el-form>
            </el-collapse-item>

            <el-collapse-item>
              <template slot="title">
                <span class="label">8、二次衬砌</span>
              </template>
              <el-form :model="tunnel" :inline="true" label-position="right" label-width="150px">
                <el-form-item label="衬砌类型">
                  <el-input v-model="tunnel.secondaryLining.liningType"></el-input>
                </el-form-item>
                <el-form-item label="是否设置仰拱">
                  <el-input v-model="tunnel.secondaryLining.invert"></el-input>
                </el-form-item>
                <el-form-item label="二衬混凝土型号">
                  <el-input v-model="tunnel.secondaryLining.secondLiningConcrete"></el-input>
                </el-form-item>
                <el-form-item label="拱顶二衬内半径">
                  <el-input v-model="tunnel.secondaryLining.radiusInsideTheSecondLiningOfTheVault"></el-input>
                </el-form-item>
                <el-form-item label="拱顶二衬圆心角">
                  <el-input v-model="tunnel.secondaryLining.theVaultIsLinedWithACentralAngle"></el-input>
                </el-form-item>
                <el-form-item label="拱脚二衬内半径">
                  <el-input v-model="tunnel.secondaryLining.innerRadiusOfArchFootSecondLining"></el-input>
                </el-form-item>
                <el-form-item label="拱脚二衬圆心角">
                  <el-input v-model="tunnel.secondaryLining.archLegWithCentralAngle"></el-input>
                </el-form-item>
                <el-form-item label="仰拱二衬内半径">
                  <el-input v-model="tunnel.secondaryLining.radiusInsideTheSecondLiningOfTheInvert"></el-input>
                </el-form-item>
                <el-form-item label="仰拱二衬圆心角">
                  <el-input v-model="tunnel.secondaryLining.invertedArchWithCentralAngle"></el-input>
                </el-form-item>
                <el-form-item label="拱顶二衬厚度">
                  <el-input v-model="tunnel.secondaryLining.thicknessOfSecondLiningOfVault"></el-input>
                </el-form-item>
                <el-form-item label="侧墙二衬厚度">
                  <el-input v-model="tunnel.secondaryLining.thicknessOfSideWallLining"></el-input>
                </el-form-item>
                <el-form-item label="仰拱厚度">
                  <el-input v-model="tunnel.secondaryLining.heThicknessOfTheInvertedArch"></el-input>
                </el-form-item>
                <el-form-item label="仰拱混凝土型号">
                  <el-input v-model="tunnel.secondaryLining.invertConcreteModel"></el-input>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>

          <el-button type="primary" round @click="modify()" icon="el-icon-edit" class="btn">确定</el-button>
        </div>

        <Tip v-else :tip="tip" v-on:refresh="GetTunnel()"></Tip>
      </div>
    </el-card>
  </transition>
</template>

<script>
import Tip from "@/components/general/Tip";
import store from "@/vuex/store.js";
export default {
  name: "ModifyTunnel",
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

      tunnel: {}
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

        this.$http.put(this.globalApi.ModifyTunnelApi, this.tunnel).then(
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
              message: "修改失败:服务器异常",
              type: "error",
              center: true,
              duration: 2000
            });
          }
        );
      }
    },

    //获取动态
    GetTunnel() {
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
          tunnelId: this.$route.query.tunnelId
        };

        this.$http.get(this.globalApi.GetTunnelApi, { params: data }).then(
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

            if (response.data.tunnel == null) {
              console.log("tunnel为空");

              this.tip.show = true;
              this.tip.businessError = true;
              this.tip.errorMessage = "tunnel为空";
              return;
            }

            this.loadingSuccess = true;

            this.tunnel = response.data.tunnel;
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

    this.GetTunnel();
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
