<template>
    <div id="bar" style="width:100%;height:500px;"></div>
</template>

<script type="text/javascript">
export default{
    data(){
        return{
            data:[
            // {product: '10-17', 'human': 43.3, 'model1': 85.8, 'model2': 93.7},
            // {product: '10-18', 'human': 83.1, 'model1': 73.4, 'model2': 55.1},
            // {product: '10-19', 'human': 86.4, 'model1': 65.2, 'model2': 82.5},
            // {product: '10-20', 'human': 72.4, 'model1': 53.9, 'model2': 39.1}
            ]
        }
    },

    props:{
      resData: {
        type:  Array
      }
    },
    mounted(){
        this.ready()
    },
    //commit_test
    //commit_test1
    methods:{
        ready:function(){
            var echarts = require('echarts');
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('bar'),'black');
            // 绘制图表
            var option = {
                title: {
                     text: '靠桥率对比图',
                    // subtext: '数据来源：深圳市'
                },
                legend: {
                    textStyle: {
                        // color: 'white'
                    }
                },
                tooltip: {},
                dataset: {
                    // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
                    // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
                    dimensions: ['product', 'human', 'model1', 'model2'],
                    source: this.resData
                    // source: this.data
                },
                xAxis: {type: 'category'},
                yAxis: {},
               
                series: [
                {type: 'bar'},
                {type: 'bar'},
                {type: 'bar'}
                
                ]
            };
            myChart.setOption(option);
        }
    }
}
</script>

<style>

</style>
