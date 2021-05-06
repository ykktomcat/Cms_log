<template>
  <div class="welcome" style="padding-bottom:20px;">
    <el-card>
      <div slot="header" class="hdTitle">
        <i class="el-icon-s-opportunity"></i>
        <span>欢迎使用CMS日志计划管理系统</span>
      </div>
      <div class="main">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-card shadow="never">
              <!-- 日历显示 -->
              <el-calendar></el-calendar>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-carousel indicator-position="outside" height="500px">
              <el-carousel-item>
                <div class="dataOne" ref="dataOne" style="width: 100%;height:500px"></div>
              </el-carousel-item>
              <el-carousel-item>
                <div class="dataTwo" ref="dataTwo" style="width: 100%;height:500px"></div>
              </el-carousel-item>
              <el-carousel-item>
                <div class="dataThree" ref="dataThree" style="width: 100%;height:500px"></div>
              </el-carousel-item>
              <el-carousel-item>
                <div class="dataFour" ref="dataFour" style="width: 100%;height:500px"></div>
              </el-carousel-item>
              <el-carousel-item>
                <div class="dataFive" ref="dataFive" style="width: 100%;height:500px"></div>
              </el-carousel-item>
            </el-carousel>
          </el-col>
          <el-card class="sysinfo">
            <div slot="header" class="info">
              <i class="el-icon-document-copy"></i>
              <span>系统介绍以及说明</span>
            </div>
            <div>此系统前后端分离，前端使用vue，后端使用django。Copyright 2021 by Ykk.</div>
          </el-card>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  info1Axios,
  info2Axios,
  info3Axios,
  info4Axios,
  info5Axios
} from "../../network/networks";
import * as echarts from "echarts";
export default {
  data() {
    return {
      // 近7天每人新增日志量
      namelist: [],
      numlist: [],
      //近7天日增量
      datelist: [],
      datenumlist: [],
      //近7天来源系统 日志情况
      systemnamelist: [],
      systemlist: [],

      //所有日志 公司分布情况
      ownernamelist: [],
      ownernamenumlist: [],

      //# 需求 人为原因 系统原因 占比
      system_list: [],
      type_list: [],
      inf5_data: {}
    };
  },
  mounted() {
    this.getInfo1();
    this.getInfo2();
    this.getInfo3();
    this.getInfo4();
    this.getInfo5();
  },

  methods: {
    initEcharts() {
      var myecharts = echarts.init(this.$refs["dataOne"]);
      var Option = {
        title: {
          text: "用户日志数量分析",
          subtext: "近7天数据",
          left: "center"
        },
        tooltip: {},
        xAxis: {
          data: this.namelist
        },
        yAxis: {},
        series: [
          {
            name: "日志数量",
            type: "bar",
            data: this.numlist
          }
        ]
      };
      myecharts.setOption(Option);
    },

    initEcharts2() {
      var myecharts = echarts.init(this.$refs["dataTwo"]);
      var Option = {
        title: {
          text: "所属系统分析",
          subtext: "近7天数据",
          left: "center"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: this.systemnamelist
        },
        series: [
          {
            name: "所属系统",
            type: "pie",
            radius: "50%",
            data: this.systemlist,

            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      myecharts.setOption(Option);
    },

    initEcharts3() {
      var myecharts = echarts.init(this.$refs["dataThree"]);
      var Option = {
        title: {
          text: "系统日增量分析",
          subtext: "近7天数据",
          left: "center"
        },
        xAxis: {
          type: "category",
          data: this.datelist
        },
        tooltip: {
          trigger: "axis"
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: this.datenumlist,
            type: "line"
          }
        ]
      };
      myecharts.setOption(Option);
    },

    initEcharts4() {
      var myecharts = echarts.init(this.$refs["dataFour"]);
      var Option = {
        title: {
          text: "日志所属公司分布情况",
          subtext: "所有数据",
          left: "center"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: this.ownernamelist
        },
        series: [
          {
            name: "所属系统",
            type: "pie",
            radius: "50%",
            data: this.ownernamenumlist,

            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      myecharts.setOption(Option);
    },
    //# 需求 人为原因 系统原因 占比
    initEcharts5() {
      var myecharts = echarts.init(this.$refs["dataFive"]);
      var Option = {
        toolbox: {
          show: true,
          padding: [0, 150, 0, 0],
          feature: {
            saveAsImage: {}
          }
        },
        title: {
          text: "日志问题归类占比分析",
          subtext: "近7天数据",
          left: "center"
        },
        tooltip: {
          // trigger: "item",
          trigger: "axis",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow" // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {
          orient: "vertical",
          left: "right",
          //top: "8%",
          data: this.type_list
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category",
          data: this.system_list
        },
        series: [
          {
            name: this.inf5_data[0].name,
            type: "bar",
            stack: "total",
            label: {
              show: true,
              ///
              formatter: function(params) {
                if (params.value > 0) {
                  return params.value;
                } else {
                  return "";
                }
              }
              ///
            },
            emphasis: {
              focus: "series"
            },
            data: this.inf5_data[0].data
          },
          {
            name: this.inf5_data[1].name,
            type: "bar",
            stack: "total",
            label: {
              show: true,
              ///
              formatter: function(params) {
                if (params.value > 0) {
                  return params.value;
                } else {
                  return "";
                }
              }
              ///
            },
            emphasis: {
              focus: "series"
            },
            data: this.inf5_data[1].data
          },
          {
            name: this.inf5_data[2].name,
            type: "bar",
            stack: "total",
            label: {
              show: true,
              ///
              formatter: function(params) {
                if (params.value > 0) {
                  return params.value;
                } else {
                  return "";
                }
              }
              ///
            },
            emphasis: {
              focus: "series"
            },
            data: this.inf5_data[2].data
          },
          {
            name: this.inf5_data[3].name,
            type: "bar",
            stack: "total",
            label: {
              show: true,
              ///
              formatter: function(params) {
                if (params.value > 0) {
                  return params.value;
                } else {
                  return "";
                }
              }
              ///
            },
            emphasis: {
              focus: "series"
            },
            data: this.inf5_data[3].data
          },
          {
            name: this.inf5_data[4].name,
            type: "bar",
            stack: "total",
            label: {
              show: true,
              ///
              formatter: function(params) {
                if (params.value > 0) {
                  return params.value;
                } else {
                  return "";
                }
              }
              ///
            },
            emphasis: {
              focus: "series"
            },
            data: this.inf5_data[4].data
          }
        ]
      };

      myecharts.setOption(Option);
    },

    //近7天日志量到个人统计
    getInfo1() {
      //封装后的用户请求接口
      info1Axios(this.ruleForm).then(res => {
        this.namelist = res.data.name;
        this.numlist = res.data.num;

        this.initEcharts();
      });
    },

    //近7天来源系统 日志情况
    getInfo2() {
      //封装后的用户请求接口
      info2Axios().then(res => {
        this.systemnamelist = res.data.name;
        this.systemlist = res.data.list;
        this.initEcharts2();
      });
    },

    //# 近7天日增量
    getInfo3() {
      //封装后的用户请求接口
      info3Axios().then(res => {
        this.datelist = res.data.date;
        this.datenumlist = res.data.num;
        this.initEcharts3();
      });
    },
    //# 所有日志分布
    getInfo4() {
      //封装后的用户请求接口
      info4Axios().then(res => {
        this.ownernamelist = res.data.name;
        this.ownernamenumlist = res.data.list;
        this.initEcharts4();
      });
    },
    //# 需求 人为原因 系统原因 占比
    getInfo5() {
      //封装后的用户请求接口
      info5Axios().then(res => {
        this.system_list = res.data.system_list;
        this.type_list = res.data.type_list;
        this.inf5_data = res.data.data;
        this.initEcharts5();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.welcome {
  .hdTitle {
    font-size: 30px;
    font-weight: 600;
    color: #409eff;
    span {
      padding-left: 10px;
    }
  }
  .info {
    font-weight: 600;
    color: #409eff;
    span {
      padding-left: 10px;
    }
  }
}
</style>