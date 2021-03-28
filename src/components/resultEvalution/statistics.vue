<template>
  
	 <!-- 面包屑---显示当前页面的路径，快速返回之前的任意页面-->
	<div style="height:100px;width:100%">
	 <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 分配结果评价
        </el-breadcrumb-item>
        <el-breadcrumb-item>统计数据</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
<div class="container">	 
		<el-header>
			<!-- <div class="up"> -->
			<div class="block">
         	<span class="demonstration">开始时间:</span>
            <el-date-picker
               v-model="queryParams.startDate"
               type="date"
			   value-format="yyyy-MM-dd" 
               format="yyyy 年 MM 月 dd 日" 
               placeholder="选择日期">
            </el-date-picker>
           </div>
        	<!-- <div class="block">
          <span class="demonstration">结束时间:</span>
          <el-date-picker
          
            type="date"
			value-format="yyyy-MM-dd" 
           format="yyyy 年 MM 月 dd 日" 
            placeholder="选择日期">
          </el-date-picker>
        </div> -->
			<!-- 查询按钮 -->
        	<el-button
				type="primary"
				icon="el-icon-search"
				class="handle-del"
				@click="afterDate(); selectAirNum()">查询</el-button >
			<!-- 重置按钮 -->
			<el-button class="handle-del" @click="selectAirNumCancel">重置</el-button >
			 <!-- </div> -->
			</el-header>
			<div id="contain" > 
				<div class="left">
					<!-- 靠桥率对比图 -->
					<div class="heti">,</div>
					<div style="margin-top:17px">
						<bar :resData ="bridgeRate" v-if='flag'></bar>
					</div>
				</div>
				<!-- 违反约束统计图 -->
				<div class="right">
					<div class="heti"></div>
					<div style="margin-top:17px">
					<barrule  v-if="flag" :resData ="constainsCount"></barrule>
					</div>
				</div>
				<!-- 一致率折线图 -->
				<div class="left">
					<div class="heti"></div>
					<div style="margin-top:0">
					<linecon v-if="flag" :resData="agreementRate"></linecon>
					</div>
				</div>
				<!-- 各约束违反次数 -->
				<div class="right">
					<div class="heti"></div>
					<div style="margin-top:0">
					<linerule  v-if="flag" :resData="perConstrainCount"></linerule>
					</div>
				</div>
			</div>		
		</div>
  </div>
</template>


<script type="text/javascript">
import bar from './barBrige'
import barrule from './barRule'
import linecon from './lineCon'
import linerule from './lineRule'
// import barnew from './barnew'
// import pienew from './pienew'

export default{
    components: {
        bar,
        barrule,
        linecon,
		linerule,
		// barnew,
        // pienew,
	 }, 
	 data(){
		return{
			queryParams:{
				startDate: undefined,
				endDate: undefined,
				filename: undefined,
				userid: undefined
			},
			bridgeRate:[],
			constainsCount:[],
			agreementRate:{},
			perConstrainCount:{},
			flag:false
		}
	},
	methods: {
			defaultIcon(){
			getlast().then((res) => {
					this.bridgeRate = res.data.data.bridgeRate;
					this.constainsCount = res.data.data.constainsCount;
					this.agreementRate =  res.data.data.agreementRate;
					this.perConstrainCount = res.data.data.perConstrainCount;
				})
		},
		afterDate() {
			console.log(this.queryParams.startDate);
			let sd = new Date(this.queryParams.startDate);
			if(sd.getDate() < 28){
				this.queryParams.endDate = new Date(sd.setDate(sd.getDate() + 3));
				console.log(this.queryParams.endDate);
			}else{
				this.open("请选择开始日期","提示");
			}
		},
		selectAirNum(){
			// if( this.queryParams.startDate != undefined && this.queryParams.endDate == undefined ){
			// 	this.open("请选择结束日期","提示");
			// 	return;
			// }
			if( this.queryParams.startDate == undefined && this.queryParams.endDate != undefined ){
				this.open("请选择开始日期","提示");
				return;
			}
			this.getStatistics();
		},
		selectAirNumCancel(){
			this.queryParams.startDate = undefined;
			this.queryParams.endDate = undefined;
			this.getStatistics()
		},
		getStatistics(){
			//获取filename
			//获取userid 是id不是role
			this.flag = false;
			this.$axios({
       		method: "get",
       		// 跨域调用
       		url: "http://localhost:8866/EvaluationResult/getStatisticalTables",
        	headers: {
          		token: window.sessionStorage.token,
          		"Content-type": "x-www-form-urlencoded;charset=UTF-8",
          		"Content-type": "application/json",
        	},
			params: this.queryParams
     	 	}).then((res) => {
        		this.bridgeRate = res.data.data.bridgeRate;
				this.constainsCount = res.data.data.constainsCount;
				this.agreementRate =  res.data.data.agreementRate;
				this.perConstrainCount = res.data.data.perConstrainCount;
				this.flag = true;
     		})
		},
		open(content,title) {
         	this.$alert(content, title, {
          	confirmButtonText: '确定',
          	callback: action => {}
          });
    },
	},
	mounted(){
		this.getStatistics();
	}
}
</script>

<style scoped>
body,div,p,dl,dt,dd,h1,a{
	margin: 0px;
	padding: 0px;
	
}
.left{
	
	float: left;
	width: 48%;
    /* border: 1px solid #034c6a; */
    /* box-sizing: border-box; */
	/* position: relative; */
	margin-left:1%;
	height: 500px;
	margin-top: 8px;

}
.right{
	width: 48%;
	float: left;
	height: 500px;
	margin-left: 2%;
	margin-top: 8px;
	/* overflow: hidden; */
	/* position: relative; */
	/* box-sizing: border-box; */
	/* box-shadow: -10px 0px 15px #034c6a inset, 
 				0px -10px 15px #034c6a inset, 
				10px 0px 15px #034c6a inset, 
 				0px 10px 15px #034c6a inset; */

}
#contain{
	overflow: hidden;
	width: 100%;
	/* background-color: #081832; */
	/* overflow:auto; */
	
}
.heti{
	/* background-color: #034c6a; */
    border-radius: 18px;
    height: 12px;
    width: 60%;
	top: -15px;
	/* margin-top: -15px; */
    color: white;
    font-weight: bold;
    font-size: 16px;
    left: 20%;
    line-height: 35px;
	text-align: center;
	text-align: center;
	/* margin-left: 20%; */
}
.block{
  display: inline-block;
}
.demonstration {
	margin-top: 30px;
    font-size: inherit;
    margin-left: 25px;
}
.handle-del{
	margin-top: 30px;
	margin-left: 30px;
}
.container{
   margin-top: 13px;
   
}
.crumbs{
  margin-top: 5px;
}

</style>

