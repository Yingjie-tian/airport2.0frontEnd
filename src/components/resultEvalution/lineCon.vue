<template>
    <div id="line" style="width: 100%;height:500px;"></div>
</template>

<script type="text/javascript">
export default{
    data(){
        return{
            data:[
            // [320, 302, 301, 334, 390, 330, 320],
            // [120, 132, 101, 134, 90, 230, 210],
            // [220, 182, 191, 234, 290, 330, 310],
            // [150, 212, 201, 154, 190, 330, 410],
            // [820, 832, 901, 934, 1290, 1330, 1320]
            ]
        }
    },

    props:{
      resData: {type:Object}
    },
    mounted(){
        this.ready()
    },
    methods:{
        ready:function(){
            var echarts = require('echarts');
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('line'),'black');
            // 绘制图表
            var option = {
                title: {
                    text: '一致率折线图',
                    // subtext: '数据来源：深圳市'
                },
                tooltip: {
                        trigger: 'axis'
                },
                legend: {
                    data: ['model1', 'model2']
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
               xAxis:  this.resData.xAxis,
                yAxis: {
                    type: 'value'
                },
                series: this.resData.series
            };
            myChart.setOption(option);
        }
    }
}
</script>

<style>

</style>


