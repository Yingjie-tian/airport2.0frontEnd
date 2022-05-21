<template>
  <!-- 面包屑---显示当前页面的路径，快速返回之前的任意页面-->
    <div style="height:100px;width:100%">
 <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 分配结果评价
        </el-breadcrumb-item>
        <el-breadcrumb-item>结果诊断</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
   <div class="container">
  <div class="resultE">
    <div style="height:50px;width:100%">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
          <!-- <el-form-item  label="航班号:" prop="flightId"> -->
             <span class="hang">航班号:</span>
            <el-input v-model="queryParams.flightId" placeholder="请输入航班号" clearable size="small" />
      
            <div class="block">
               <span class="demonstration">日期:</span>
               <el-date-picker 
              :picker-options="pickerOptions"
               v-model="queryDate" 
               type="date" 
               value-format="yyyy-MM-dd" 
               format="yyyy 年 MM 月 dd 日" 
               placeholder="选择日期">
               </el-date-picker>
            </div>
              <span class="time">时间:</span>
              <el-select v-model="queryTime" placeholder="请选择时间点">
                <el-option
                  v-for="item in timePoints[queryDate]"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
             <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="gettable" >查询</el-button> 
              <el-button   @click="resetTable"  >重置</el-button> 
        
              <el-button  type="primary"  size="mini"  >
                <a href="http://localhost:8866/EvaluationResult/testDownload"
                   target="_blank"
                   class="link-button"
                   data-options="plain:true"
                   style="width: 50px; text-align: center; text-decoration: none;"
            >导出结果</a></el-button>
             </el-form-item>
       </el-form>
    </div>
      
      <div class="chart">
        <span>甘特图:</span>
        <el-link type="primary" @click="manmodel" class="word" id="m" >人工&nbsp;&nbsp;|&nbsp;&nbsp;</el-link>
        <el-link type="primary" @click="seeresult" class="word" id="r">模型一&nbsp;&nbsp;|&nbsp;&nbsp;</el-link>
        <el-link type="primary" @click="seestatic" class="word" id="s">模型二</el-link>
      </div>
      <div class="chartr">
        <span>评分结果:  人工:{{ scoreList["0"] }}  模型一:{{ scoreList["1"] }} 模型二:{{ scoreList["2"] }} </span>
      </div>
      <div class="ruleintro">
        <span
          >约束说明:约束1:航班与机位国际/国内属性匹配；
          约束2:同机位前后航班满足最小间隔; 约束3:航班与机位机型匹配;
          约束4:滑入推出限制; 约束5:航司限停限制; 约束6:航司靠桥率限制;
          </span>
      </div>
    
    </div>
    <div class="mytable">
      <!-- 表格数据 -->
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        row-key="id">
        <el-table-column prop="flightId" label="航班号"  align="center">
           <template slot-scope="scope">
                <div class="text-center">
                 {{scope.row.flightId==null?0:scope.row.flightId}}
                </div>
            </template>
        </el-table-column>
        <el-table-column label="分配结果" align="center">
          <el-table-column prop="model2" label="模型一" align="center">
             <template slot-scope="scope">
                <div class="text-center">
                 {{scope.row.model2==null?0:scope.row.model2}}
                </div>
            </template>
          </el-table-column>
          <el-table-column label="模型二"  align="center">
             <template slot-scope="scope">
                <div class="text-center">
                 {{scope.row.model3==null?0:scope.row.model3}}
                </div>
            </template>
          </el-table-column>
          <el-table-column  label="人工"  align="center">
            <template slot-scope="scope">
                <div class="text-center">
                 {{scope.row.model1==null?3:scope.row.model1}}
                </div>
            </template>
          </el-table-column>

          <el-table-column label="约束1"  align="center">
            <template  slot-scope="scope">
              <div  class="full-column text-center" 
              :style="viewRendering(scope.row.constrain1)?'background:#F08080':''">
             <span>
                {{numberRendering(scope.row.constrain1)}}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column  label="约束2"  align="center">
            <template slot-scope="scope">
              <div  class="full-column text-center" 
             :style="viewRendering(scope.row.constrain2)?'background:#F08080':''">
             <span>
                {{numberRendering(scope.row.constrain2)}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="约束3"  align="center">
             <template slot-scope="scope">
                <div  class="full-column text-center" 
              :style="viewRendering(scope.row.constrain3)?'background:#F08080':''"> 
             <span>
                {{numberRendering(scope.row.constrain3)}}</span>
             </div>
            </template>
          </el-table-column>
          <el-table-column  label="约束4" align="center">
             <template slot-scope="scope">
               <div  class="full-column text-center" 
              :style="viewRendering(scope.row.constrain4)?'background:#F08080':''">
             <span>
                {{numberRendering(scope.row.constrain4)}}</span>
             </div>
            </template>
          </el-table-column>
          <el-table-column  label="约束5"  align="center">
             <template slot-scope="scope">
               <div  class="full-column text-center" 
               :style="viewRendering(scope.row.constrain5)?'background:#F08080':''">
             <span>
                {{numberRendering(scope.row.constrain5)}}</span>
             </div>
            </template>
          </el-table-column>
          <el-table-column label="约束6"  align="center">
             <template slot-scope="scope">
               <div  class="full-column text-center" 
              :style="viewRendering(scope.row.constrain6)?'background:#F08080':''">
             <span>
                {{numberRendering(scope.row.constrain6)}}
                </span>
             </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="约束7"  align="center">
             <template slot-scope="scope">
               <div  class="full-column text-center" 
              :style="viewRendering(scope.row.constrain7)?'background:#F08080':''">
             <span>
                {{numberRendering(scope.row.constrain7)}}</span>
             </div>
            </template>
          </el-table-column> -->
        </el-table-column>
        <el-table-column label="合计"  align="center">
           <template slot-scope="scope">
             <div  class="full-column text-center" 
              :style="viewRendering(scope.row.constrains)?'background:#F08080':''">
             <span>
               {{numberRendering(scope.row.constrains)}}
             </span>
             </div>
            </template>
        </el-table-column>
        <el-table-column prop="date" label="日期"  align="center">
           <template slot-scope="scope">
                <div class="text-center">
                 {{scope.row.date==null?0:scope.row.date}}
                </div>
            </template>
        </el-table-column>
      </el-table>
    </div>
    
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="PageSize"
          :total="totalCount"
        ></el-pagination>
      </div>
        <!-- style是甘特图的样式 -->
 <div
          id="myChart"
          ref="chart"
         :style="{ width: '1200px', height: '700px', left: '0px' }"
        ></div>

  </div>
  </div>
</template>
<script>
import echarts from "echarts/lib/echarts";
import "echarts/map/js/china.js";
import $ from "jquery";
export default {
  data() {
    return {
      options: {},
      numvalue: "",
      value1: "",
      showSearch: true,
      // 前端分页功能
      // 当前页，默认显示第1页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [3, 5, 10],
      // 默认每页显示的条数（可修改）
      PageSize: 5,
      // //航班号筛选
      // selectAirportNum: "",
      //备用数据
      subTableData: [],
      //表格数据
      tableData:[],
      flightData:[],
      //2020.12.23
       queryParams:{
        flightId:undefined,
        queryTime:undefined,
        date:undefined,
        page:1,
        size:5
      },
      scoreParams:{
        userid:window.sessionStorage.usernamen,
        filename:this.$store.state.testDataNameVuex,
        airportname: this.$store.state.airportNameVuex,
        updatetime:undefined,
      },
    
      testData:[],
      tempData:[],
      //分数列表
      // scoreList: [ 0, 0, 0],
      scoreList: {"0":0, "1":0, "2":0},
      flightData:[],

      //甘特图
       //冲突数据bar
      manualData2: [],
      //甘特图数据定义
      ylen: "",
      //请求的所有机位
      gateList: [],
      //进出港时间有效的航班
      validflight: [],
      validflight1: [],
      //有效航班的停机位
      validgate: [],
      // data1: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292],
      data1: [],
      data2: [],
      lastend_time: [],
      series1: [],
      //有效航班进出港时间
      flightmap: {
        flgtnum: "",
        atime: "",
        dtime: "",
      },
      //冲突事件
      redbar: [],
      allconflicttable: [],
      //冲突航班
      allconflictflight: [],
      allconflictflighttable: [],
      //根据航班所选所有数据
      theseflight: [],

      //甘特图参数
      _rawData0: [],
      _rawData: [],
      //冲突数据
      _rawData2: [],
      //2020/05/01
      _rawData3: [],
      _rawData22222: [],
      DIM_CATEGORY_INDEX: 0,
      DIM_TIME_ARRIVAL: 1,
      DIM_TIME_DEPARTURE: 2,
      DIM_NATION: 4,
      DIM_ARRIVAL_COMPANY: 5,
      DIM_DEPARTURE_COMPANY: 6,
      DIM_ARRIVAL_LINE: 7,
      DIM_DEPARTURE_LINE: 8,
      DIM_AIRPORTNAME: 9,
      _cartesianXBounds: [],
      HEIGHT_RATIO: 0.6,

      manualData: [],
      manualData1: [],
      timePoints: [],
      dateTimeList:[],
      timeLimit:[
      ],
       //时间查询
      UpdateTime:[],
       queryTime: undefined,
      //  queryDate: "",
        queryDate:undefined,
      // 日期可选范围
      pickerOptions: {},

      //拖拽
      myChart: "",
      _draggable: false,
      _draggingEl: "",
      _autoDataZoomAnimator: "",
      _dropShadow: "",
      _draggingRecord: "",
      _dropRecord: "",
      _draggingCursorOffset: [0, 0],
      _draggingTimeLength: "",
     

    }
  },
  created() {
    this.gettable();
    // this.getScore(); 
    this.getTimePoint()
  
    // this.getUniondata().then(() => {
    //   let uniondata = {
    //     filename: this.$store.state.testDataNameVuex,
    //     userId: window.sessionStorage.usernamen,
    //   };
    //   console.log("文件名+用户id" + JSON.stringify(uniondata));
    //   this.getAirData(uniondata).then(() => {
    //     this.getparkingGate();
    //     this.conflictgate(this.flightData);
    //     /////改2
    //     this.allconflictflg(this.flightData);
    //     this.drawLine();
    //     if (this.flightData.length == 0) {
    //       this.go();
    //     }
    //   });
    // });


    //甘特图
    this.$http.get("static/airport-schedule.json").then((res) => {
      let resbody = [];
      this._rawData = res.body;
      resbody = res.body;
      this._rawData22222 = res.body;
      resbody = res.body;
      // myChart.setOption(option = makeOption());
      // this.initDrag();
      //*********************************************** */
      // console.log("默认的json数据为:" + JSON.stringify(this._rawData22222))
      this._rawData2 = JSON.parse(JSON.stringify(this._rawData22222));
      //2020/05/01
      this._rawData3 = JSON.parse(JSON.stringify(this._rawData22222));
      // myChart.setOption(option = makeOption());
      // this.initDrag();
      //*********************************************** */
      //console.log("默认的json数据为:" + this._rawData.parkingApron.data[0]); //此处的res对象包含了json的文件信息和数据，我们需要的json数据存在于body属性中
    });

  },
  mounted() {
    this.myChart = this.$echarts.init(document.getElementById("myChart"));
      // this.testGetTime();
  },
  watch:{
  },
  methods: {
    go() {
      this.$message({
        message: "没有对应的数据，请重新选择",
        showClose: true,
        duration: 3000,
        offset: 200,
        type: "warning",
      });
    },
    // 根据文件名称得到对应的机场的所有停机位 存到table中
    async getAirData(airname) {
      await this.$axios({
        method: "post",
        url: "http://localhost:8866/getalldata/select_testgate",
        data: airname,
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
      }).then((data) => {
        // console.log('token'+window.sessionStorage.token);
        // 将数据保存到本地database中
        this.table = data.data;
        console.log("&&&&&" + JSON.stringify(this.table));
      });
    },
    getTimePoint(){
        this.$axios({
        method: "get",
        // 跨域调用
        url: "http://localhost:8866/EvaluationResult/getTimePoint",
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
      }).then((res) => {
        let result = res.data.data
        console.log("result")
        console.log(result)
        // this.timePoints = result.timeList
        this.timePoints = result.timeDict
        this.dateTimeList = result.dateList
        this.timeLimit = result.timeLimit

        this.pickerOptions =  {
          disabledDate(time) {
            return( time.getTime() < (new Date(result.timeLimit[0]) - 8.64e7 ) || time.getTime() >new Date(result.timeLimit[1]))
          }
        }
        console.log(this.pickerOptions);
      })
    },
    //获取停机位
    getparkingGate() {
      let a = [];
      for (let i = 0; i < this.table.length; i++) {
        a.push(this.table[i].parkinggate);
      }
      // console.log(a)
      this.removalgateList = new Set(a);
      this.removalgateList0 = Array.from(this.removalgateList);
      // console.log("去重后的table" + this.removalgateList0);
      // let gateList = [];
      for (let i = 0; i < this.removalgateList0.length; i++) {
        let onesele = {
          label: this.removalgateList0[i],
          value: i,
        };
        this.gateList.push(onesele);
      }
      // console.log(JSON.stringify(this.gateList))
    },
     getUniondata(uniondata) {
      // console.log('传送数据'+JSON.stringify(uniondata))
      return this.$axios({
        method: "post",
        url: "http://localhost:8866/result/getUnionResult",
        data: uniondata,
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
      }).then((data) => {
        // 将数据保存到本地database中
        this.flightData = data.data;
        console.log('哈哈哈哈'+JSON.stringify(this.flightData));

      })
      },
   
    viewRendering(value){
      if((value.key1!=null && value.key1 ) || (value.key2!=null && value.key2 ) || (value.key3!=null && value.key3 )){
        return true;
      }else{
        return false;
      }
    },
    numberRendering(value){
      var str='';
      return str+(value.key1==null?0:value.key1)+"|"+(value.key2==null?0:value.key2)+"|"+(value.key3==null?0:value.key3)
    },

    gettable() {
       if (this.$store.state.testDataNameVuex === "") {
          this.$message({
          message: "请在航班数据页面选择测试数据！",
          type: "warning",
          offset: 300,
          center: true,
          duration: 3000,
      });
      }else{
          if(this.queryDate == undefined && this.  queryTime == undefined){
        //跳过
         this.queryParams.date = undefined
      }
      if( this.queryDate != undefined && this.queryTime == undefined ){
        this.open("请选择时间","提示");
        return;
      }
      if( this.queryDate == undefined && this.queryTime != undefined ){
        this.open("请选择日期","提示");
        return;
      }
       if( this.queryDate != undefined && this.queryTime != undefined ){
         this.queryParams.date = this.queryDate+" "+this.queryTime
      }
      this.$axios({
        method: "get",
        // 跨域调用
        url: "http://localhost:8866/EvaluationResult/test",
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
        params: this.queryParams
      }).then((res) => {
        // 将数据保存到本地中
        const dataList = res.data.data;
        this.currentPage = dataList.current;
        if(dataList.total !==0 ){
          this.tableData = dataList.records
          this.totalCount = dataList.total;
        }else{
            this.tableData = this.testData;
            this.subTableData = null;
            this.totalCount = 0;
        }
      });
      // 20210324获取得分
      this.$axios({
        method: "get",
        // 跨域调用
        url: "http://localhost:8866/ScoreResult/selectScore",
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
        params: this.scoreParams
      }).then((res) => {
         this.scoreList=res.data
      });
      }
    }, 

    open(content,title) {
        this.$alert(content, title, {
          confirmButtonText: '确定',
          callback: action => {}
          });
    },
    resetTable(){
      this.queryDate = undefined;
      this.queryTime = undefined;
      this.queryParams.date = undefined
      this.queryParams.queryTime = undefined
      this.queryParams.flightId = undefined
      this.gettable()
    },
    //2020.12.23
    //202012.23查询按钮操作
    handleQuery(){
      this.getList();
    },
    //202012.23重置按钮
    restQuery(){
      this.queryDate = undefined;
      this.queryTime = undefined;
      this.resetTable();
      this.handleQuery();
    },

     manmodel() {
      let uniondata0 = {
        filename: this.$store.state.testDataNameVuex,
        //1109晚
        // filename:"LJG",
        userId: window.sessionStorage.usernamen,
        model:0
      };
      this.getUniondata(uniondata0).then(()=>{
        let uniondata = {
        filename: this.$store.state.testDataNameVuex,
        userId: window.sessionStorage.usernamen,
      };
      console.log("文件名+用户id" + JSON.stringify(uniondata));
      this.getAirData(uniondata).then(() => {
        this.getparkingGate();
        this.conflictgate(this.flightData);
        /////改2
        this.allconflictflg(this.flightData);
        this.drawLine();
        if (this.flightData.length == 0) {
          this.go();
        }
      });
      })
      myChart.style.display = "block";
      this.$el.querySelector(`#myChart`).scrollIntoView({
        behavior: "smooth",  // 平滑过渡
        block:    "center"  // 上边框与视窗顶部平齐。默认值
      });
    },
    ExportData() {
      this.$axios({
        method: "get",
        // 跨域调用
        url: this.host+"/EvaluationResult/testDownload",
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
        params: this.queryParams
      });
    },
     seestatic() {
      let uniondata0 = {
        filename: this.$store.state.testDataNameVuex,
        //1109晚
        // filename:"LJG",
        userId: window.sessionStorage.usernamen,
        model:2
      };
      this.getUniondata(uniondata0).then(()=>{
        let uniondata = {
        filename: this.$store.state.testDataNameVuex,
        userId: window.sessionStorage.usernamen,
      };
      console.log("文件名+用户id" + JSON.stringify(uniondata));
      this.getAirData(uniondata).then(() => {
        this.getparkingGate();
        this.conflictgate(this.flightData);
        /////改2
        this.allconflictflg(this.flightData);
        this.drawLine();
        if (this.flightData.length == 0) {
          this.go();
        }
      });
      })
      myChart.style.display = "block";
      this.$el.querySelector(`#myChart`).scrollIntoView({
        behavior: "smooth",  // 平滑过渡
        block:    "center"  // 上边框与视窗顶部平齐。默认值
      });
    },
    seeresult() {
      let uniondata0 = {
        filename: this.$store.state.testDataNameVuex,
        //1109晚
        // filename:"LJG",
        userId: window.sessionStorage.usernamen,
        model:1
      };
      this.getUniondata(uniondata0).then(()=>{
        let uniondata = {
        filename: this.$store.state.testDataNameVuex,
        userId: window.sessionStorage.usernamen,
      };
      console.log("文件名+用户id" + JSON.stringify(uniondata));
      this.getAirData(uniondata).then(() => {
        this.getparkingGate();
        this.conflictgate(this.flightData);
        /////改2
        this.allconflictflg(this.flightData);
        this.drawLine();
        if (this.flightData.length == 0) {
          this.go();
        }
      });
      })
      myChart.style.display = "block";
      this.$el.querySelector(`#myChart`).scrollIntoView({
        behavior: "smooth",  // 平滑过渡
        block:    "center"  // 上边框与视窗顶部平齐。默认值
      });
    },
    // 前端分页功能
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;
      this.queryParams.page = 1;
      this.queryParams.size = val;
      this.gettable()
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      this.queryParams.page = val;
      this.gettable()
    },
    //停机位去重
    parkinggateSortAndSet(arr) {
      arr = arr.sort(function (a, b) {
        return a - b;
      });
      return Array.from(new Set(arr));
    },
     //********************//冲突机位判断//************************************ */
    async conflictgate(table) {
      //  console.log("lilili" + JSON.stringify(this.removalgateList0));
      //  console.log("wuwuwuwuwu" + JSON.stringify(table));
      let flg = [];
      this.allconflicttable = [];
      //冲突的时间数据条列表
      let conflicttable = [];
      let allcontable = [];
      for (let i = 0; i < this.removalgateList0.length; i++) {
        //定义该机位上的冲突航班冲突时间段列表
        let period = [];
        //选出该机位对应的所有航班
        flg = this.selecttheseflg(table, this.removalgateList0[i]);

        // console.log("flghhhhhhhhhhhhhhhhhoooo:" + JSON.stringify(flg));
        conflicttable = this.isTimeCollision(flg, this.removalgateList0[i]);
        // var newDate0 = new Date(conflicttable[0].atime);
        conflicttable = JSON.parse(JSON.stringify(conflicttable));
        allcontable = allcontable.concat(conflicttable);
        //  console.log("所有冲突的表12345678:" + JSON.stringify(allcontable));
      }
      this.allconflicttable = allcontable;

      // console.log(
      //   "所有冲突的表alalalalall:" + JSON.stringify(this.allconflicttable)
      // );
    },
    //返回冲突航班列表
    async conflictflight(table) {
      let flg = [];
      this.allconflictflight = [];
      //冲突的时间数据条列表
      let conflicttable = [];
      let allcontable = [];
      // console.log("hhhhhhhhhhhhhhhhhhhhhhhh");
      //  console.log("length2:" + this.gateList.length);
      for (let i = 0; i < this.gateList.length; i++) {
        //定义该机位上的冲突航班冲突时间段列表
        let period = [];
        //选出该机位对应的所有航班
        flg = this.selecttheseflg(table, this.gateList[i]);
        conflicttable = this.isTimeCollision2(flg, this.gateList[i]);
        // var newDate0 = new Date(conflicttable[0].atime);
        conflicttable = JSON.parse(JSON.stringify(conflicttable));
        allcontable = allcontable.concat(conflicttable);
        // console.log('所有冲突的表12345678:'+JSON.stringify(allcontable))
      }
      this.allconflictflighttable = allcontable;
      // console.log(
      //   "冲突航班表22222:" + JSON.stringify(this.allconflictflighttable)
      // );
    },
    //根据机位选出该机位所有航班
    selecttheseflg(table, gateno) {
      // console.log('传入的table:'+(JSON.stringify(table)));
      this.theseflight = [];
      // console.log('shcuhu'+gateno)
      for (let i = 0; i < table.length; i++) {
        if (table[i].parkinggate == gateno) {
          this.theseflight.push(table[i]);
        }
      }
      return this.theseflight;
    },
    //判断该机位上航班是否冲突返回冲突时间段
    isTimeCollision(flg, gateno) {
      let alist = [];
      let dlist = [];
      //冲突的航班数据表格
      let confilght = [];
      // let confilght=[];
      // //冲突的数据对象
      // let condata={
      //     parkinggate: '',
      //     atime: '',
      //     dtime: ''
      // };
      for (let i = 0; i < flg.length; i++) {
        // console.log("atime:" + flg[i].atime);
        // console.log('atime2:'+Date.parse(flg[i].atime));
        // console.log('atime2_2:'+new Date(Date.parse(flg[i].atime)));
        alist.push(Date.parse(flg[i].atime));
        dlist.push(Date.parse(flg[i].dtime));
        // console.log('fltimehoooo:'+JSON.stringify(alist))
      }
      let timesortresult = this.atimesort(alist, dlist);
      // console.log('timesortresult:::'+JSON.stringify(timesortresult))
      for (let i = 0; i < alist.length; i++) {
        alist[i] = timesortresult.aa[i];
        dlist[i] = timesortresult.dd[i];
      }
      let lastendtime = dlist[0];
      for (let i = 1; i < alist.length; i++) {
        //冲突的数据对象
        let condata = {
          parkinggate: "",
          atime: "",
          dtime: "",
        };
        //冲突
        // if(alist[i]<dlist[i-1]){
        if (alist[i] < lastendtime) {
          condata.parkinggate = gateno;
          condata.atime = alist[i];
          if (dlist[i] < dlist[i - 1]) {
            condata.dtime = dlist[i];
            // lastendtime=dlist[i-1];
          } else {
            condata.dtime = dlist[i - 1];
            lastendtime = dlist[i];
          }
          // condata.dtime=dlist[i-1];
          confilght.push(condata);
          // console.log('atime3:'+JSON.stringify(confilght[1]));
          // console.log('atime3:'+(alist[i]));
          // console.log('atime4:'+(new Date(alist[i])))
          // console.log('atime5:'+(new Date(dlist[i-1])))
        } else {
          lastendtime = dlist[i];
        }
        // console.log('每一次push进去的atimeokkojon:'+(confilght[0].atime))
        // console.log('每一次push进去的atimeokkojon:'+(confilght[0].dtime))
      }
      // console.log('atime3:'+JSON.stringify(confilght[0]));
      // console.log('atime3:'+JSON.stringify(confilght[1]));

      // console.log('每一次push进去的atimeokkojon:'+(confilght))
      // if(confilght.length>0){
      //     console.log('atjianizmimeokkojon:'+(confilght[0].atime))
      // }
      // console.log('atimeokkojon:'+(confilght[0].atime))
      // console.log('atimekokokokokokoko:'+JSON.stringify(confilght))
      return confilght;
    },
    //判断该机位上航班是否冲突返回冲突航班
    isTimeCollision2(flg, gateno) {
      let alist = [];
      // let dlist=[];
      //冲突的航班数据表格
      let confilght = [];
      for (let i = 0; i < flg.length; i++) {
        let tempflg = {
          parkinggate: "",
          atime: "",
          dtime: "",
          aflightnum: "",
          dflightnum: "",
        };
        tempflg.parkinggate = gateno;
        tempflg.atime = Date.parse(flg[i].atime);
        tempflg.dtime = Date.parse(flg[i].dtime);
        tempflg.aflightnum = flg[i].aflightnum;
        tempflg.dflightnum = flg[i].dflightnum;
        alist.push(tempflg);
      }
      // console.log("冲突航班表22222hhhhhhhhhhhhhhhhh:" + JSON.stringify(alist));
      let timesortresult = this.atimesort2(alist);
      let dlist = [];
      for (let i = 0; i < alist.length; i++) {
        dlist[i] = alist[i].dtime;
      }
      let lastendtime = dlist[0];
      for (let i = 1; i < alist.length; i++) {
        //冲突的数据对象
        let condata = {
          parkinggate: "",
          atime: "",
          dtime: "",
          aflightnum: "",
          dflightnum: "",
        };
        //冲突
        // if(alist[i]<dlist[i-1]){
        if (alist[i] < lastendtime) {
          condata.parkinggate = gateno;
          condata.atime = alist[i];
          if (dlist[i] < dlist[i - 1]) {
            condata.dtime = dlist[i];
          } else {
            condata.dtime = dlist[i - 1];
            lastendtime = dlist[i];
          }
          condata.aflightnum = alist[i].aflightnum;
          condata.dflightnum = alist[i].dflightnum;
          confilght.push(condata);
        } else {
          lastendtime = dlist[i];
        }
      }
      return confilght;
    },
    //按开始时间进行排序
    atimesort(alist, dlist) {
      // console.log('atime1:'+JSON.stringify(alist))
      // console.log('dtime1:'+JSON.stringify(dlist))
      //排序之后的alist
      let result = [];
      let resultItem = {
        aa: [],
        dd: [],
      };
      for (let i = 0; i < alist.length - 1; i++) {
        for (let j = i + 1; j < alist.length; j++) {
          if (alist[i] > alist[j]) {
            let temp1 = alist[i];
            alist[i] = alist[j];
            alist[j] = temp1;
            let temp2 = dlist[i];
            dlist[i] = dlist[j];
            dlist[j] = temp2;
          }
        }
      }
      // console.log('atime2222222222:'+JSON.stringify(alist))
      // console.log('dtime22222222222222:'+JSON.stringify(dlist))
      for (let i = 0; i < alist.length; i++) {
        resultItem.aa[i] = alist[i];
        resultItem.dd[i] = dlist[i];
      }
      // console.log('lalalallallalsetetetet:'+JSON.stringify(resultItem))
      return resultItem;
    },
    //按开始时间进行排序返回包括航班
    atimesort2(alist) {
      // console.log('atime1:'+JSON.stringify(alist))
      // console.log('dtime1:'+JSON.stringify(dlist))
      //排序之后的alist
      // let result=[];
      // let resultItem={
      //         parkinggate: '',
      //         atime: '',
      //         dtime: '',
      //         aflightnum: '',
      //         dflightnum: ''
      //     };
      for (let i = 0; i < alist.length - 1; i++) {
        for (let j = i + 1; j < alist.length; j++) {
          if (alist[i].atime > alist[j].atime) {
            let temp1 = alist[i];
            alist[i] = alist[j];
            alist[j] = temp1;
          }
        }
      }
      // for(let i=0;i<alist.length;i++){
      //     resultItem.aa[i]=alist[i];
      //     resultItem.dd[i]=dlist[i];
      // }
      // console.log('lalalallallalsetetetet:'+JSON.stringify(resultItem))
      return alist;
    },
    //********************//冲突机位判断结束***************************************** */
     //返回所有冲突航班
    allconflictflg(table) {
      let allflgs = [];
      let flg = [];
      for (let i = 0; i < this.removalgateList0.length; i++) {
        //选出该机位对应的所有航班
        flg = this.selecttheseflg(table, this.removalgateList0[i]);
        for (let m = 0; m < flg.length - 1; m++) {
          for (let n = m + 1; n < flg.length; n++) {
            //冲突
            let condata = {
              parkinggate: "",
              flightnum1: "",
              flightnum2: "",
            };
            if (this.conflictwarning(flg[m], flg[n]) == 1) {
              condata.parkinggate = this.removalgateList0[i];
              condata.flightnum1 = flg[m].aflightnum;
              condata.flightnum2 = flg[n].aflightnum;
              allflgs.push(condata);
            }
          }
        }
        this.allconflictflgs = allflgs;
        this.clashData = this.allconflictflgs;
        let old=this.clashDataList || []
        old.push(this.clashData)
        this.clashDataList=old
        //所有冲突航班
        // this.allconflictflgs = allflgs;
        // this.clashData = this.allconflictflgs;
        // this.clashDataList.push(this.clashData);
      }
      // console.log(
      //   "所有冲突的航班表alalalalall:" + JSON.stringify(this.allconflictflgs)
      // );
      //  console.log("我是冲突表" + this.clashData);
    },
    //判断两个航班是否冲突
    conflictwarning(flg1, flg2) {
      let a1 = Date.parse(flg1.atime);
      let d1 = Date.parse(flg1.dtime);
      let a2 = Date.parse(flg2.atime);
      let d2 = Date.parse(flg2.dtime);
      if (a2 > a1 && a2 < d1) {
        return 1;
      } else if (d2 > a1 && d2 < d1) {
        return 1;
      } else if (a2 < a1 && d2 > d1) {
        return 1;
      } else {
        return 0;
      }
    },

    //*******************改(结束)************冲突提示*************************************

    //甘特图start*********************************
    drawLine() {
      //将航班数据覆盖存入_rawdata甘特图数据源
      this.$http.get("static/airport-schedule.json").then((res) => {
        this._rawData = res.body;
        let resbody = [];
        resbody = res.body;
        this._rawData22222 = res.body;
        resbody = res.body;
        // myChart.setOption(option = makeOption());
        // this.tDrag();
        //*********************************************** */
        // console.log("默认的json数据为:" + JSON.stringify(this._rawData22222))
        this._rawData2 = JSON.parse(JSON.stringify(this._rawData22222));
        // myChart.setOption(option = makeOption());
        // this.initDrag();
        //*********************************************** */
        // console.log("默认的json数据为:" + this._rawData.parkingApron.data[0]); //此处的res对象包含了json的文件信息和数据，我们需要的json数据存在于body属性中
      });
      //甘特图航班Object
      let ganttflight = [];
      //甘特图机位Object
      let ganttgate = [];
      // console.log('1111222223333'+JSON.stringify(this.tableData));
      //2020/12/12
      //替换航班数据
      // this.manualData = this.tableData;
      this.manualData = this.flightData;
      let datalength = this.manualData.length;
      //***************************2020/4/14****************************//
      this.manualData1 = [];
      let manualparking = [];
      for (let i = 0; i < this.manualData.length; i++) {
        this.manualData1.push(this.manualData[i]);
      }
      for (let i = 0; i < this.manualData1.length; i++) {
        manualparking[i] = this.manualData1[i];
      }

      //manualData排序
      // this.manualData1.sort(function(a,b){
      //     return Date.parse(a.atime)-Date.parse(b.atime);
      // })
      this.manualData1.sort(function (a, b) {
        return Date.parse(a.atime) - Date.parse(b.atime);
      });
      let intervalTime = "";
      let intervalTime0 = "";
      if (this.manualData1.length > 0) {
        let minTime = Date.parse(this.manualData1[0].atime);
        let lenlen1 = this.manualData1.length - 1;
        let maxTime = Date.parse(this.manualData1[lenlen1].atime);
        intervalTime = maxTime - minTime;
        intervalTime0 = Date.parse("2018/10/31") - Date.parse("2018/10/30");
      } else {
        intervalTime0 = Date.parse("2018/10/31") - Date.parse("2018/10/30");
        intervalTime = intervalTime0;
      }

      // let intervalTime0=Date.parse('2018/10/31')-Date.parse('2018/10/30');
      console.log("24小时时间间隔为：" + intervalTime0);
      console.log("当前的时间间隔为：" + intervalTime);
      // console.log("排序之前的:" + JSON.stringify(this.manualData));
      let difftable = [];
      //2020/4/29
      let index000 = -1;
      //2020/4/30
      let diffdaytable = [];
      var map = new Map();
      //缓冲区行数
      let gaterow = 0;
      //停机位为空的航班列表
      let noassignflight = [];
      for (let i = 0; i < this.manualData1.length; i++) {
        if (this.manualData1[i].parkinggate > 0) {
          // this._rawData.flight.data[i][0]=this.manualData[i].parkinggate;
          // manualData2[i].parkinggate=this.manualData1.parkinggate;
        } else {
          if (noassignflight.length == 0) {
            this.manualData1[i].parkinggate = -1;
            noassignflight.push(this.manualData1[i]);
            gaterow = gaterow - 1;
          } else {
            //存放可用的机位列表
            let position = [];
            for (let j = 0; j < noassignflight.length; j++) {
              //判断两航班是否冲突
              if (
                this.conflictwarning(this.manualData1[i], noassignflight[j]) ==
                0
              ) {
                if (!position.includes(noassignflight[j].parkinggate)) {
                  position.push(noassignflight[j].parkinggate);
                }
              } else {
                //有冲突情况
                if (position.includes(noassignflight[j].parkinggate)) {
                  // position.remove(noassignflight[j].parkinggate);
                  position.splice(
                    position.indexOf(noassignflight[j].parkinggate),
                    1
                  );
                }
              }
            }
            if (position.length > 0) {
              this.manualData1[i].parkinggate = position[0];
              noassignflight.push(this.manualData1[i]);
            } else {
              gaterow = gaterow - 1;
              this.manualData1[i].parkinggate = gaterow;
              noassignflight.push(this.manualData1[i]);
            }
          }
        }
      }

      // console.log('排序之后的:'+JSON.stringify(this.manualData))
      let bufferrow = 0 - gaterow;
      console.log("缓冲区行数为：" + bufferrow);

      //*********************2020/4/14(结束)******************************** */

      // console.log('manualDatalen:'+datalength)
      //  console.log("yyyyy" + this.manualData.length);

      //****************** */
      for (let i = 0; i < this.manualData1.length; i++) {
        if (this.manualData1[i].parkinggate > 0) {
          this._rawData.flight.data[i][0] = this.manualData1[i].parkinggate;
        } else {
          this._rawData.flight.data[i][0] = this.manualData1[i].parkinggate;
          this.manualData1[i].parkinggate = "";
        }

        // this._rawData.flight.data[i][0]=this.manualData[i].parkinggate;
        this._rawData.flight.data[i][1] = Date.parse(this.manualData1[i].atime);
        this._rawData.flight.data[i][2] = Date.parse(this.manualData1[i].dtime);
        this._rawData.flight.data[i][3] = this.manualData1[i].mdl;
        if ((this.manualData1[i].nation = 1)) {
          this._rawData.flight.data[i][4] = "国内";
        } else {
          this._rawData.flight.data[i][4] = "国际";
        }
        this._rawData.flight.data[i][5] = this.manualData1[i].aflightnum;
        this._rawData.flight.data[i][6] = this.manualData1[i].dflightnum;
        this._rawData.flight.data[i][7] = this.manualData1[i].origin;
        this._rawData.flight.data[i][8] = this.manualData1[i].destination;
        this._rawData.flight.data[i][9] = this.manualData1[i].airportname;
      }
      //多余航班数据源删除
      this._rawData.flight.data.splice(
        datalength,
        this._rawData.flight.data.length - datalength
      );
      //************ */
      //停机位去重
      let allparkinggate = [];
      for (let i = 0; i < this.manualData.length; i++) {
        if (
          this.manualData[i].parkinggate != null &&
          this.manualData[i].parkinggate != "null"
        ) {
          allparkinggate.push(this.manualData[i].parkinggate);
        }
      }
      allparkinggate = this.parkinggateSortAndSet(allparkinggate);
      // allparkinggate.sort(function(a,b){return a - b;});
      //替换停机位
      //  console.log("parkinggate:" + allparkinggate.length);
      let l = allparkinggate.length - 1;
      let gatecount = parseInt(allparkinggate[l]) + 1;
      //***********************改******冲突时间段bar******************************** */
      this.$http.get("static/airport-schedule.json").then((res) => {
        this._rawData22222 = res.body;
        // console.log("默认的json数据为:" + JSON.stringify(this._rawData22222))
        this._rawData2 = JSON.parse(JSON.stringify(this._rawData22222));
        // console.log("默认的json数据为:" + this._rawData.parkingApron.data[0])//此处的res对象包含了json的文件信息和数据，我们需要的json数据存在于body属性中
      });
      //将冲突数据覆盖存入_rawdata2甘特图数据源
      //替换航班数据
      let datalength2 = this.allconflicttable.length;
      // console.log("manualData2len:" + JSON.stringify(this.allconflicttable));
      // console.log('原始的_rawData2'+JSON.stringify(this._rawData2))
      // console.log(
      //   "冲突数据计算完成之后数据长度：" + this.allconflicttable.length
      // );

      // this.allconflicttable=JSON.parse(JSON.stringify(this.allconflicttable));
      // for(let i=0;i<datalength2;i++){
      //     console.log('aaaaaaaa：'+this._rawData2.flight.data[i][0])
      // }
      for (let i = 0; i < this.allconflicttable.length; i++) {
        if (this.allconflicttable[i].parkinggate != null) {
          this._rawData2.flight.data[i][0] = this.allconflicttable[
            i
          ].parkinggate;
          // console.log("完成之后传值111：" + this._rawData2.flight.data[i][0]);
        } else {
          this._rawData2.flight.data[i][0] = 1000;
          // console.log(
          //   "完成之后传值111：" + this.allconflicttable[i].parkinggate
          // );
        }
        this._rawData2.flight.data[i][1] = this.allconflicttable[i].atime;
        // console.log("完成之后传值3333：" + this.allconflicttable[i].atime);
        this._rawData2.flight.data[i][2] = this.allconflicttable[i].dtime;
        //  console.log("完成之后传值4444：" + this.allconflicttable[i].dtime);
      }
      // console.log('manualData2len:'+JSON.stringify(this._rawData2))

      //多余航班数据源删除
      this._rawData2.flight.data.splice(
        datalength2,
        this._rawData2.flight.data.length - datalength2
      );
      // console.log('manualData2len:'+JSON.stringify(this._rawData22222.flight.data))
      //************ */
      //停机位去重
      // let allparkinggate2=[];
      // for(let i=0; i < this.allconflicttable.length; i++){
      //     if(this.allconflicttable[i].parkinggate!=null && this.allconflicttable[i].parkinggate!='null'){
      //         allparkinggate2.push(this.allconflicttable[i].parkinggate);
      //     }
      // }
      // allparkinggate2 = this.parkinggateSortAndSet(allparkinggate2);
      // // allparkinggate.sort(function(a,b){return a - b;});
      // //替换停机位
      // // console.log("parkinggate:"+allparkinggate.length);
      // let l2=allparkinggate2.length-1;
      // let gatecount2=parseInt(allparkinggate2[l2])+1;
      // gatecount2=this.gateList.length+1;
      // console.log("gatecount:"+gatecount2);
      // for (let i = 0; i < gatecount2; i++) {
      //     this._rawData2.parkingApron.data[i][0]=i;
      //     this._rawData2.parkingApron.data[i][1]='';
      // }
      // let gatecount2=1;
      // //多余停机位数据源删除
      // this._rawData2.parkingApron.data.splice(gatecount2,this._rawData2.parkingApron.data.length-gatecount2);

      //***********************改(结束)*******冲突时间段bar******************************** */202
      //2021.1.23改的，写固定啦
      //gatecount = this.gateList.length + 1;
      gatecount =29
      console.log("----***" + gatecount);
      for (let i = 0; i < gatecount; i++) {
        this._rawData.parkingApron.data[i][0] = i;
        this._rawData.parkingApron.data[i][1] = "";
        // console.log('yyyy'+this._rawData.parkingApron.data[i][0])
      }
      //console.log("parkinggate:"+gatecount);
      // for (let i = 0; i < gatecount; i++) {
      //     this._rawData.parkingApron.data[i][0]=i;
      //     this._rawData.parkingApron.data[i][1]='';
      // }

      //多余停机位数据源删除
      this._rawData.parkingApron.data.splice(
        gatecount,
        this._rawData.parkingApron.data.length - gatecount
      );
      //替换航班索引名称dimensions
      this._rawData.flight.dimensions[0] = "停机位";
      this._rawData.flight.dimensions[1] = "进港时间";
      this._rawData.flight.dimensions[2] = "出港时间";
      this._rawData.flight.dimensions[3] = "机号";
      this._rawData.flight.dimensions[4] = "国际/国内";
      this._rawData.flight.dimensions[5] = "进港航班号";
      this._rawData.flight.dimensions[6] = "出港航班号";
      this._rawData.flight.dimensions[7] = "进港起始地";
      this._rawData.flight.dimensions[8] = "出港目的地";
      this._rawData.flight.dimensions[9] = "机场名称";

      document.getElementById("myChart").removeAttribute("_echarts_instance_");
      this.myChart = this.$echarts.init(document.getElementById("myChart")); // document.getElementById("interfaceContent").innerHTML="";
      var myChart = this.myChart;
      // var myChart = this.$echarts.init(document.getElementById("myChart"));
      var HEIGHT_RATIO = this.HEIGHT_RATIO;
      var DIM_CATEGORY_INDEX = this.DIM_CATEGORY_INDEX;
      var DIM_TIME_ARRIVAL = this.DIM_TIME_ARRIVAL;
      var DIM_TIME_DEPARTURE = this.DIM_TIME_DEPARTURE;
      var DIM_ARRIVAL_COMPANY = this.DIM_ARRIVAL_COMPANY;
      var DIM_DEPARTURE_COMPANY = this.DIM_DEPARTURE_COMPANY;
      var DIM_ARRIVAL_LINE = this.DIM_ARRIVAL_LINE;
      var DIM_DEPARTURE_LINE = this.DIM_DEPARTURE_LINE;
      var DIM_NATION = this.DIM_NATION;
      var DIM_AIRPORTNAME = this.DIM_AIRPORTNAME;
      var DATA_ZOOM_AUTO_MOVE_THROTTLE = 30;
      var DATA_ZOOM_X_INSIDE_INDEX = 1;
      var DATA_ZOOM_Y_INSIDE_INDEX = 3;
      var DATA_ZOOM_AUTO_MOVE_SPEED = 0.2;
      var DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH = 30;

      var _draggable;
      var _draggingEl;
      var _dropShadow;
      var _draggingCursorOffset = [0, 0];
      var _draggingTimeLength;
      var _draggingRecord;
      var _dropRecord;
      // var _cartesianXBounds = [];
      var _cartesianXBounds = this._cartesianXBounds;
      var _cartesianYBounds = [];
      var _rawData = this._rawData;
      var _rawData2 = this._rawData2;
      var _autoDataZoomAnimator;

      var option = {
        tooltip: {},
        animation: false,
        toolbox: {
          left: 20,
          top: 0,
          itemSize: 20,
          feature: {
            //自定义工具按钮
            myDrag: {
              show: true,
              title: "Make bars\ndraggable",
              // icon:
              //   "path://M990.55 380.08 q11.69 0 19.88 8.19 q7.02 7.01 7.02 18.71 l0 480.65 q-1.17 43.27 -29.83 71.93 q-28.65 28.65 -71.92 29.82 l-813.96 0 q-43.27 -1.17 -72.5 -30.41 q-28.07 -28.07 -29.24 -71.34 l0 -785.89 q1.17 -43.27 29.24 -72.5 q29.23 -29.24 72.5 -29.24 l522.76 0 q11.7 0 18.71 7.02 q8.19 8.18 8.19 18.71 q0 11.69 -7.6 19.29 q-7.6 7.61 -19.3 7.61 l-518.08 0 q-22.22 1.17 -37.42 16.37 q-15.2 15.2 -15.2 37.42 l0 775.37 q0 23.39 15.2 38.59 q15.2 15.2 37.42 15.2 l804.6 0 q22.22 0 37.43 -15.2 q15.2 -15.2 16.37 -38.59 l0 -474.81 q0 -11.7 7.02 -18.71 q8.18 -8.19 18.71 -8.19 l0 0 ZM493.52 723.91 l-170.74 -170.75 l509.89 -509.89 q23.39 -23.39 56.13 -21.05 q32.75 1.17 59.65 26.9 l47.94 47.95 q25.73 26.89 27.49 59.64 q1.75 32.75 -21.64 57.3 l-508.72 509.9 l0 0 ZM870.09 80.69 l-56.13 56.14 l94.72 95.9 l56.14 -57.31 q8.19 -9.35 8.19 -21.05 q-1.17 -12.86 -10.53 -22.22 l-47.95 -49.12 q-10.52 -9.35 -23.39 -9.35 q-11.69 -1.17 -21.05 7.01 l0 0 ZM867.75 272.49 l-93.56 -95.9 l-380.08 380.08 l94.73 94.73 l378.91 -378.91 l0 0 ZM322.78 553.16 l38.59 39.77 l-33.92 125.13 l125.14 -33.92 l38.59 38.6 l-191.79 52.62 q-5.85 1.17 -12.28 0 q-6.44 -1.17 -11.11 -5.84 q-4.68 -4.68 -5.85 -11.7 q-2.34 -5.85 0 -11.69 l52.63 -192.97 l0 0 Z",
              onclick: this.onDragSwitchClick,
            },
          },
        },
        title: {
          text: "Gantt of Airport Flight",
          left: "center",
        },
        dataZoom: [
          {
            //有滑动块
            type: "slider",
            //设置 dataZoom-inside 组件控制的x轴,可以用数组表示多个轴
            xAxisIndex: 0,
            //过滤模式，当全部维度都在数据窗口同侧外部，整个数据项才会被过滤掉
            filterMode: "weakFilter",
            height: 20,
            // 组件离容器下侧的距离,'20%'
            bottom: 0,
            //数据窗口范围的起始百分比
            start: 0,
            //数据窗口范围的结束百分比
            end: 100,
            //2020/4/29
            zoomLock: true,
            handleIcon:
              "M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "100%",
            showDetail: false,
          },
          {
            type: "inside",
            id: "insideX",
            xAxisIndex: 0,
            filterMode: "weakFilter",
            start: 0,
            end: 26,
            //如何触发缩放。可选值为：true：表示不按任何功能键，鼠标滚轮能触发缩放
            // false：表示鼠标滚轮不能触发缩放
            // 'shift'：表示按住 shift 和鼠标滚轮能触发缩放
            // 'ctrl'：表示按住 ctrl 和鼠标滚轮能触发缩放
            // 'alt'：表示按住 alt 和鼠标滚轮能触发缩放。
            zoomOnMouseWheel: false,
            //如何触发数据窗口平移。true：表示不按任何功能键，鼠标移动能触发数据窗口平移
            // false：表示鼠标滚轮不能触发缩放
            // 'shift'：表示按住 shift 和鼠标移动能触发数据窗口平移
            // 'ctrl'：表示按住 ctrl 和鼠标移动能触发数据窗口平移
            // 'alt'：表示按住 alt 和鼠标移动能触发数据窗口平移。
            moveOnMouseMove: false,
          },
          {
            type: "slider",
            // 设置 dataZoom-inside 组件控制的 y轴,可以用数组表示多个轴
            yAxisIndex: 0,
            zoomLock: true,
            //2020/05/01
            // width: 20,
            // right: 5,
            //*********** */
            width: 10,
            right: 10,
            // top: 70,
            // bottom: 20,
            start: 0,
            end: 50,
            handleSize: 0,
            showDetail: false,
          },
          {
            type: "inside",
            id: "insideY",
            yAxisIndex: 0,
            start: 0,
            end: 100,
            //2020/4/29
            zoomOnMouseWheel: false,
            moveOnMouseMove: true,
            moveOnMouseWheel: true,
          },
        ],
        grid: {
          show: true,
          top: 70,
          bottom: 20,
          left: 100,
          right: 20,
          backgroundColor: "#fff",
          borderWidth: 0,
        },
        xAxis: {
          type: "time",
          //修改间隔
          //splitNumber: 30,
          splitNumber: intervalTime > intervalTime0 ? 30 : 21,
          position: "top",
          splitLine: {
            lineStyle: {
              color: ["#E9EDFF"],
            },
          },
          axisLine: {
            show: false,
          },
          //坐标轴刻度相关设置
          axisTick: {
            // 刻度线的颜色
            lineStyle: {
              color: "#929ABA",
            },
          },
          //坐标轴刻度标签的相关设置
          axisLabel: {
            color: "#929ABA",
            // inside: true,
            align: "center",
            //显示数据的格式(修改)
            //2020/4/29
            formatter: function (value, index) {
              //在这里写需要的时间格式
              var t_date = new Date(value);
              let min = t_date.getMinutes();
              if (min < 10) {
                min = "0" + min;
              }
              // attime=time.getHours()+":"+time.getMinutes()+":"+seconds
              // return [t_date.getFullYear(), t_date.getMonth() + 1, t_date.getDate()].join('-') + " \n "
              //     + [t_date.getHours(), min].join(':');
              //     }
              // return [t_date.getDate()].join('-') + "\n"
              //     + [t_date.getHours(), min].join(':');
              // return [t_date.getHours()].join(':');
              //                 if(!difftable.includes(t_date.getHours())){
              //                     difftable.push(t_date.getHours());
              //                     return [t_date.getHours()].join(':');
              //                   }else{
              //                     return "";
              //                   }
              //2020/4/29
              // index000=index000+1;
              // if(index==index000){
              //   if(!difftable.includes(t_date.getHours())){
              //     difftable.push(t_date.getHours());
              //     return [t_date.getHours()].join(':');
              //   }else{
              //     // return "";
              //     return [t_date.getHours(),min].join(':')
              //   }
              // }else{
              //   difftable=[];
              //   index000=0;
              //   if(!difftable.includes(t_date.getHours())){
              //     difftable.push(t_date.getHours());
              //     return [t_date.getHours()].join(':');
              //   }else{
              //     // return "";
              //     return [t_date.getHours(),min].join(':')
              //   }
              // }
              //2020/4/30
              index000 = index000 + 1;
              let res = 0;
              if (index == index000) {
                if (!difftable.includes(t_date.getHours())) {
                  difftable.push(t_date.getHours());
                  map.set(t_date.getDate(), t_date.getHours());
                  return [t_date.getHours()].join(":");
                } else {
                  diffdaytable = [];
                  for (let [key, value] of map.entries()) {
                    if (key == t_date.getDate() && value == t_date.getHours()) {
                      res = 1;
                      break;
                    }
                  }
                  if (res == 0) {
                    return [t_date.getHours()].join(":");
                  } else {
                    return [t_date.getHours(), min].join(":");
                  }
                }
              } else {
                difftable = [];
                index000 = 0;
                diffdaytable = [];
                map = new Map();
                difftable.push(t_date.getHours());
                diffdaytable.push(t_date.getDate());
                return [t_date.getHours()].join(":");
              }
            },
          },
        },
        yAxis: {
          axisTick: { show: true },
          splitLine: { show: false },
          axisLine: { show: false },
          axisLabel: { show: false },
          //min: -10,
          min: gaterow - 2,
          // max: 29,
          max: _rawData.parkingApron.data.length,
        },
        //自定义系列（ custom series）
        series: [
          {
            id: "flightData",
            type: "custom",
            //2020/05/01
            // blendMode: 'multiply',
            //renderItem 函数实现自定义的图形元素渲染逻辑
            renderItem: this.renderGanttItem,
            tooltip: {
              // trigger: 'item',
              formatter: function (params) {
                let table = "";
                var adate = new Date(params.data[1]);
                let mon1 = adate.getMonth() + 1;
                if (mon1 < 10) {
                  mon1 = "0" + mon1;
                }
                let day1 = adate.getDate();
                if (day1 < 10) {
                  day1 = "0" + day1;
                }
                let hor1 = adate.getHours();
                if (hor1 < 10) {
                  hor1 = "0" + hor1;
                }
                let min1 = adate.getMinutes();
                if (min1 < 10) {
                  min1 = "0" + min1;
                }
                let sec1 = adate.getSeconds();
                if (sec1 < 10) {
                  sec1 = "0" + sec1;
                }
                let atime =
                  adate.getFullYear() +
                  "/" +
                  mon1 +
                  "/" +
                  day1 +
                  " " +
                  hor1 +
                  ":" +
                  min1 +
                  ":" +
                  sec1;
                var ddate = new Date(params.data[2]);
                let mon2 = ddate.getMonth() + 1;
                if (mon2 < 10) {
                  mon2 = "0" + mon2;
                }
                let day2 = ddate.getDate();
                if (day2 < 10) {
                  day2 = "0" + day2;
                }
                let hor2 = ddate.getHours();
                if (hor2 < 10) {
                  hor2 = "0" + hor2;
                }
                let min2 = ddate.getMinutes();
                if (min2 < 10) {
                  min2 = "0" + min2;
                }
                let sec2 = adate.getSeconds();
                if (sec2 < 10) {
                  sec2 = "0" + sec2;
                }
                let dtime =
                  ddate.getFullYear() +
                  "/" +
                  mon2 +
                  "/" +
                  day2 +
                  " " +
                  hor2 +
                  ":" +
                  min2 +
                  ":" +
                  sec2;
                let parkinggate = "";
                if (params.data[0] > 0) {
                  parkinggate = params.data[0];
                }
                table =
                  "停机位：" +
                  parkinggate +
                  "</br>" +
                  "进港时间：" +
                  atime +
                  "</br>" +
                  "出港时间：" +
                  dtime +
                  "</br>" +
                  "进港航班号：" +
                  params.data[5] +
                  "</br>" +
                  "出港航班号：" +
                  params.data[6] +
                  "</br>" +
                  "进港起始地：" +
                  params.data[7] +
                  "</br>" +
                  "出港目的地：" +
                  params.data[8] +
                  "</br>" +
                  "国际/国内：" +
                  params.data[4] +
                  "</br>" +
                  "机场名称：" +
                  params.data[9];
                return table;
              },
            },
            //为 data 每个维度取名
            dimensions: _rawData.flight.dimensions,
            encode: {
              // data 中『维度1』和『维度2』对应到 X 轴
              x: [DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE],
              // data 中『维度0』对应到 Y 轴
              y: DIM_CATEGORY_INDEX,
              // 表示『维度DIM_CATEGORY_INDEX』和『维度DIM_TIME_ARRIVAL』和『维度DIM_TIME_DEPARTURE』要显示到 tooltip (提示框)中。
            },
            data: _rawData.flight.data,
          },
          //纵轴索引0处添加markline分隔缓冲区
          {
            type: "line",
            // hoverAnimation:false,
            // emphasis: {
            //                     show:false},
            markLine: {
              symbol: "none",
              silent: true,
              data: [
                {
                  silent: true, //鼠标悬停事件  true没有，false有
                  lineStyle: {
                    //警戒线的样式  ，虚实颜色
                    type: "solid",
                    color: "black",
                    //    width: 10
                  },
                  label: {
                    show: false,
                  },
                  tooltip: { show: false },
                  dispatchAction: { type: "downplay" },
                  yAxis: 0, // 警戒线的标注值，可以有多个yAxis,多条警示线
                },
              ],
            },
          },
          // **************************改*******冲突时间段bar****************** */
          {
            id: "conflictData",
            type: "custom",
            //renderItem 函数实现自定义的图形元素渲染逻辑
            renderItem: this.renderGanttItem2,
            //为 data 每个维度取名
            dimensions: _rawData2.flight.dimensions,
            encode: {
              // data 中『维度1』和『维度2』对应到 X 轴
              x: [DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE],
              // data 中『维度0』对应到 Y 轴
              y: DIM_CATEGORY_INDEX,
              // 表示『维度DIM_CATEGORY_INDEX』和『维度DIM_TIME_ARRIVAL』和『维度DIM_TIME_DEPARTURE』要显示到 tooltip (提示框)中。
              tooltip: [],
            },
            data: _rawData2.flight.data,
          },
          //***********************改(结束)*******冲突时间段bar******************************** */
          {
            type: "custom",
            renderItem: this.renderAxisLabelItem,
            dimensions: _rawData.parkingApron.dimensions,
            encode: {
              x: -1, // Then this series will not controlled by x.
              y: 0,
            },
            //使用图形元素组件在节点上划出一个隐形的图形覆盖住节点
            data: this.$echarts.util.map(
              _rawData.parkingApron.data,
              function (item, index) {
                return [index].concat(item);
              }
            ),
          },
        ],
      };
      myChart.clear();
      myChart.setOption(option, true);
      // this.initDrag();
      this._cartesianXBounds = _cartesianXBounds;
    },
    renderGanttItem(params, api) {
      //这里 DIM_CATEGORY_INDEX 为 0
      var DIM_CATEGORY_INDEX = this.DIM_CATEGORY_INDEX;
      //这里 DIM_TIME_ARRIVAL 为 1
      var DIM_TIME_ARRIVAL = this.DIM_TIME_ARRIVAL;
      //这里 DIM_TIME_DEPARTURE 为 2
      var DIM_TIME_DEPARTURE = this.DIM_TIME_DEPARTURE;
      //这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值
      var categoryIndex = api.value(DIM_CATEGORY_INDEX);
      // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值
      var timeArrival = api.coord([api.value(DIM_TIME_ARRIVAL), categoryIndex]);
      var timeDeparture = api.coord([
        api.value(DIM_TIME_DEPARTURE),
        categoryIndex,
      ]);
      var _cartesianXBounds = [];
      var _cartesianYBounds = [];

      // 当前坐标系的包围盒
      var coordSys = params.coordSys;
      _cartesianXBounds[0] = coordSys.x;
      _cartesianXBounds[1] = coordSys.x + coordSys.width;
      _cartesianYBounds[0] = coordSys.y;
      _cartesianYBounds[1] = coordSys.y + coordSys.height;

      this._cartesianXBounds = _cartesianXBounds;
      this._cartesianYBounds = _cartesianYBounds;

      var barLength = timeDeparture[0] - timeArrival[0];

      // Get the heigth corresponds to length 1 on y axis.
      // 使用 api.size(...) 获得 Y 轴上数值范围为 1 的一段所对应的像素长度。
      var barHeight = api.size([0, 1])[1] * this.HEIGHT_RATIO * 1.5;
      // var barHeight = api.size([0, 0.08])[1] * this.HEIGHT_RATIO;
      var x = timeArrival[0];
      var y = timeArrival[1] - barHeight;
      //设置bar中标签
      var atime = api.value(1);
      var atime0 = new Date(api.value(1));
      let min1 = atime0.getMinutes();
      if (min1 < 10) {
        min1 = "0" + min1;
      }
      var atime = atime0.getHours() + ":" + min1;
      var dtime = api.value(2);
      var dtime0 = new Date(api.value(2));
      let min2 = dtime0.getMinutes();
      if (min2 < 10) {
        min2 = "0" + min2;
      }
      var dtime = dtime0.getHours() + ":" + min2;

      var flightnum = api.value(5) + "/" + api.value(6);
      //修改1
      var flightNumber =
        flightnum + "\n" + api.value(3) + " " + atime + "-" + dtime;
      var flightNumberWidth = this.$echarts.format.getTextRect(flightNumber)
        .width;

      //修改2
      // var text = (barLength > flightNumberWidth + 40 && x + barLength >= 180)
      //     ? flightNumber : '';
      // var text=flightNumber;
      //2020/05/19
      var flightNumber_1 = api.value(5) + "\n" + api.value(3);
      flightNumber =
        barLength < flightNumberWidth ? flightNumber_1 : flightNumber;
      //2020/05/01
      var flightNumber2 = api.value(5) + " " + api.value(3) + " " + "?";
      var flightNumber3 = api.value(5) + "\n" + api.value(3) + " " + "?";
      flightNumber2 =
        barLength < flightNumberWidth ? flightNumber3 : flightNumber2;
      var text = api.value(0) > 0 ? flightNumber : flightNumber2;

      // clipRectByRect表示如果矩形超出了当前坐标系的包围盒，则剪裁这个矩形
      var rectNormal = this.clipRectByRect(params, {
        // 矩形的位置和大小
        x: x,
        y: y,
        width: barLength,
        height: barHeight,
      });
      var rectVIP = this.clipRectByRect(params, {
        // 当前坐标系的包围盒
        x: x,
        y: y,
        width: barLength / 2,
        height: barHeight,
      });
      var rectText = this.clipRectByRect(params, {
        x: x,
        y: y,
        width: barLength,
        height: barHeight,
      });
      // 这里返回为这个 dataItem 构建的图形元素定义
      return {
        // 一组图形元素
        type: "group",
        children: [
          {
            // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等
            type: "rect",
            // ignore: !rectNormal,
            shape: rectNormal,
            // 使用 api.style(...) 函数得到 series.itemStyle.normal 中定义的样式信息，以及视觉映射的样式信息
            // 也可以用这种方式覆盖这些样式信息：api.style({fill: 'green', stroke: 'yellow'})
            //*****************改 */
            // style: api.style()
            //修改三
            // style: api.style({fill: '#ddb30b'})
            style: api.style({ fill: "#bce4ca" }),
          },
          // {
          //     type: 'rect',
          //     ignore: !rectVIP && !api.value(4),
          //     shape: rectVIP,
          //     //修改四
          //     // style: api.style({fill: '#ddb30b'})
          //     style: api.style({fill: '#bce4ca'})
          // },
          {
            type: "rect",
            ignore: !rectText,
            shape: rectText,
            style: api.style({
              fill: "transparent",
              stroke: "transparent",
              text: text,
              // 2020/4/29
              fontSize: "9",
              // textFill: '#fff'
              textFill: "black",
            }),
          },
        ],
      };
    },

    //***********************改(05/01)*******冲突时间段bar******************************** */
    renderGanttItem2(params, api) {
      //这里 DIM_CATEGORY_INDEX 为 0
      var DIM_CATEGORY_INDEX = this.DIM_CATEGORY_INDEX;
      //这里 DIM_TIME_ARRIVAL 为 1
      var DIM_TIME_ARRIVAL = this.DIM_TIME_ARRIVAL;
      //这里 DIM_TIME_DEPARTURE 为 2
      var DIM_TIME_DEPARTURE = this.DIM_TIME_DEPARTURE;
      //这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值
      var categoryIndex = api.value(DIM_CATEGORY_INDEX);
      // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值
      var timeArrival = api.coord([api.value(DIM_TIME_ARRIVAL), categoryIndex]);
      var timeDeparture = api.coord([
        api.value(DIM_TIME_DEPARTURE),
        categoryIndex,
      ]);
      var _cartesianXBounds = [];
      var _cartesianYBounds = [];

      // 当前坐标系的包围盒
      var coordSys = params.coordSys;
      _cartesianXBounds[0] = coordSys.x;
      _cartesianXBounds[1] = coordSys.x + coordSys.width;
      _cartesianYBounds[0] = coordSys.y;
      _cartesianYBounds[1] = coordSys.y + coordSys.height;

      this._cartesianXBounds = _cartesianXBounds;
      this._cartesianYBounds = _cartesianYBounds;

      var barLength = timeDeparture[0] - timeArrival[0];

      // Get the heigth corresponds to length 1 on y axis.
      // 使用 api.size(...) 获得 Y 轴上数值范围为 1 的一段所对应的像素长度。
      var barHeight = api.size([0, 1])[1] * this.HEIGHT_RATIO * 1.5;
      // var barHeight = api.size([0, 0.08])[1] * this.HEIGHT_RATIO;
      var x = timeArrival[0];
      var y = timeArrival[1] - barHeight;
      //设置bar中标签
      var atime = api.value(1);
      var atime0 = new Date(api.value(1));
      var atime = atime0.getHours() + ":" + atime0.getMinutes();
      var dtime = api.value(2);
      var dtime0 = new Date(api.value(2));
      var flightnum = api.value(5) + "/" + api.value(6);

      // var dtime = (dtime0.getHours()+':'+dtime0.getMinutes());
      // var flightNumber = flightnum + '           ' + api.value(3) + " \n " + '           '+atime+ '           '+dtime;
      // var flightNumberWidth = this.$echarts.format.getTextRect(flightNumber).width;

      // var text = (barLength > flightNumberWidth + 40 && x + barLength >= 180)
      //     ? flightNumber : '';

      // clipRectByRect表示如果矩形超出了当前坐标系的包围盒，则剪裁这个矩形
      var rectNormal = this.clipRectByRect(params, {
        // 矩形的位置和大小
        x: x,
        y: y,
        width: barLength,
        height: barHeight,
      });
      var rectVIP = this.clipRectByRect(params, {
        // 当前坐标系的包围盒
        x: x,
        y: y,
        width: barLength / 2,
        height: barHeight,
      });
      var rectText = this.clipRectByRect(params, {
        x: x,
        y: y,
        width: barLength,
        height: barHeight,
      });
      // 这里返回为这个 dataItem 构建的图形元素定义
      return {
        // 一组图形元素
        type: "group",
        children: [
          {
            // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等
            type: "rect",
            ignore: !rectNormal,
            shape: rectNormal,
            // 使用 api.style(...) 函数得到 series.itemStyle.normal 中定义的样式信息，以及视觉映射的样式信息
            // 也可以用这种方式覆盖这些样式信息：api.style({fill: 'green', stroke: 'yellow'})
            //*****************改 */
            style: api.style({ fill: "#FF3366" }),
            // style: api.style({fill: '#ddb30b'})
          },
          {
            type: "rect",
            ignore: !rectVIP && !api.value(4),
            shape: rectVIP,
            // style: api.style({fill: '#ddb30b'})
            style: api.style({ fill: "#FF3366" }),
          },
          // {
          //     type: 'rect',
          //     ignore: !rectText,
          //     shape: rectText,
          //     style: api.style({
          //         fill: 'transparent',
          //         stroke: 'transparent',
          //         text: text,
          //         textFill: '#fff'
          //     })
          // }
        ],
      };
    },
    //***********************改(结束)*******冲突时间段bar*
    renderAxisLabelItem(params, api) {
      var y = api.coord([0, api.value(0)])[1];
      if (y < params.coordSys.y + 5) {
        return;
      }
      return {
        type: "group",
        position: [10, y],
        children: [
          {
            type: "path",
            shape: {
              d: "M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z",
              x: 0,
              y: -20,
              width: 90,
              height: 20,
              layout: "cover",
            },
            style: {
              fill: "#368c6c",
            },
          },
          {
            type: "text",
            style: {
              x: 24,
              y: -3,
              text: api.value(1),
              textVerticalAlign: "bottom",
              textAlign: "center",
              textFill: "#fff",
            },
          },
          {
            type: "text",
            style: {
              x: 75,
              y: -2,
              textVerticalAlign: "bottom",
              textAlign: "center",
              text: api.value(2),
              textFill: "#000",
            },
          },
        ],
      };
    },
    clipRectByRect(params, rect) {
      return this.$echarts.graphic.clipRectByRect(rect, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      });
    },
    // -------------
    //  Enable Drag
    // -------------
    onDragSwitchClick(model, api, type) {
      var myChart = this.$echarts.init(document.getElementById("myChart"));
      var _draggable;
      _draggable = !_draggable;
      myChart.setOption(
        {
          dataZoom: [
            {
              id: "insideX",
              disabled: _draggable,
            },
            {
              id: "insideY",
              disabled: _draggable,
            },
          ],
        },
        true
      );
      // this.model.setIconStatus(type, _draggable ? 'emphasis' : 'normal');
    },

 
  

  //甘特图end************************************
 ExportData() {
      //定义文件内容，类型必须为Blob 否则createObjectURL会报错
      let content = new Blob([JSON.stringify(this.tableData)]);
      //  console.log(content)

      //生成url对象
      let urlObject = window.URL || window.webkitURL || window;
      let url = urlObject.createObjectURL(content);
      //生成<a></a>DOM元素
      let el = document.createElement("a");
      //链接赋值
      el.href = url;
      el.download = "tableData文件导出.txt";
      //必须点击否则不会下载
      el.click();
      //移除链接释放资源
      urlObject.revokeObjectURL(url);
    },  
    
  },
};
</script>
<style lang="scss" scoped>
.link-button{
  text-decoration: none;
  color:#fff;
}
.container{
   margin-top: 8px;
}
.el-table {
  margin-top: 20px;
}
.el-header {
  float: left;
}
.el-input {
  width: 155px;
}
.block {
  display: inline-block;
}
.demonstration {
  font-size: inherit;
  margin-left: 30px;
}
.hang{
  font-size: inherit;
 
}
.time{
  font-size: inherit;
   margin-left: 25px;
}
.handle-del {
  margin-top: 15px;
  margin-left: 30px;
}
.chart {
  margin-top: 3px;
  // font-size: 500;
}
.chartr {
  margin-top: 15px;
  background-color:dodgerblue;
  height: 25px;
}
.ruleintro {
  margin-top: 15px;
  background-color: white;
}
.pagination {
  margin-top: 20px;
}
.full-column{
  height: 100%;
  width: 100%;
}
.text-center{
  text-align: center;
}

.crumbs{
  margin: 2;
}
.resultE{
  margin-top: 20px;
}
#myChart {
  // width: 80%;
  display: none;
  // position: absolute;
  z-index: 5;
  margin-top: 3%;
}


</style>



