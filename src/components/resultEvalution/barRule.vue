<template>
  <div id="barrule" style="width: 100%; height: 500px"></div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      data: [
        // {product: '10-17', 'human': 43.3, 'model1': 85.8, 'model2': 93.7},
        // {product: '10-18', 'human': 83.1, 'model1': 73.4, 'model2': 55.1},
        // {product: '10-19', 'human': 86.4, 'model1': 65.2, 'model2': 82.5},
        // {product: '10-20', 'human': 72.4, 'model1': 53.9, 'model2': 39.1}
      ],
    };
  },

  props: {
    resData: {
      type: Object,
    },
  },
  mounted() {
    this.ready();
  },
  methods: {
    ready: function () {
      var echarts = require("echarts");
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("barrule"), "black");
      // 绘制图表
      
      var option = {
        title: {
          text: "违反约束统计图",
          // subtext: '数据来源：深圳市'
        },
        legend: {
          data: ["human", "model1", "model2"],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        toolbox: {
          show: false,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: [ "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        xAxis: this.resData.xAxis,
        yAxis: [
          {
            type: "value",
          },
        ],

        series: this.resData.series,
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style>
</style>
