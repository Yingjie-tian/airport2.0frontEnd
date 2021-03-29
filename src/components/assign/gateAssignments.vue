<template>
  <div class="gates">
    <!-- 面包屑---显示当前页面的路径，快速返回之前的任意页面-->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-edit-outline"></i> 机位分配
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
    <div>  
      <div class="buttondiv">
        <!-- <el-button type="primary" @click="dialogVisible = true"
          >动态模拟仿真</el-button
        > -->
        <el-button type="primary" @click="dialogVisible2 = true"
          >提交结果</el-button
        >
      </div>
      <br />
      <div class="okkk">
        <el-link type="primary" @click="manhandle" class="word"
          >手动分配&nbsp;&nbsp;|&nbsp;&nbsp;</el-link
        >
        <el-link type="primary" @click="manhandle2" class="word"
          >甘特图分配</el-link
        >
        <!-- <el-link type="primary" @click="manhandle2">智慧分配</el-link>&nbsp;&nbsp;&nbsp;&nbsp; -->
      </div>
    </div>
    <!-- <div class="main"> -->
      <br />
      <div>
        <p class="alert">冲 突 提 示</p>
        <div id="nav11">
          <table class="newData">
            <tbody>
              <!-- <transition-group appear tag="tbody"> -->
              <tr class="tr" v-for="item in clashData" :key="item.id">
                <td :id="'tdid' + item.id" class="td1">
                  {{ item.parkinggate }}号停机位 航班{{
                    item.flightnum1
                  }}与航班{{ item.flightnum2 }}冲突
                </td>
              </tr>
              <!-- </transition-group> -->
            </tbody>
          </table>
        </div>
        <div id="table0">
          <el-table
          border
            :data="
              tableData.slice(
                (currentPage - 1) * PageSize,
                currentPage * PageSize
              )
            "
            header-cell-class-name="table-header"
            @row-click="open"
            :header-cell-style="{
              background: 'rgb(250,250,250)',
            }"
            :default-sort="{ prop: 'atime', order: 'descending' }"
          >
            <el-table-column
              align="center"
              prop="flightnum"
              label="航班号"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="airportname"
              label="航班公司"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="planenum"
              label="机号"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="mdl"
              label="机型"
            ></el-table-column>
            <el-table-column align="center" prop="type" label="航班属性">
            </el-table-column>
            <el-table-column prop="nation" label="国际/国内" align="center">
              <template slot-scope="scope">
                <!-- 1-国内 0-国际 -->
                <span v-if="scope.row.nation === 1">国内</span>
                <span v-if="scope.row.nation === 0">国际</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="flightline"
              label="航线"
              align="center"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="atime"
              label="进港时间"
              sortable
            >
              <template slot-scope="scope">{{
                scope.row.atime | atimeFormat
              }}</template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="dtime"
              label="出港时间"
              sortable
            >
              <template slot-scope="scope">{{
                scope.row.dtime | atimeFormat
              }}</template>
            </el-table-column>
            <el-table-column align="center" prop="parkinggate" label="停机位">
              <template slot-scope="scope">
                <span v-if="scope.row.parkinggate === 0"></span>
                <span v-if="scope.row.parkinggate > 0">{{
                  scope.row.parkinggate
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div id="mainFooter">
          <!-- 分页功能 -->
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="pageSizes"
              :page-size="PageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
            ></el-pagination>
          </div>
        </div>

        <div
          id="myChart"
          ref="chart"
          :style="{ width: '1070px', height: '700px', left: '0px' }"
        ></div>

        <!-- <i @click="shanchu"  class="el-icon-close" id="up2"></i> -->
      </div>
      <!-- 动态模拟仿真按钮对话框 -->
      <el-dialog title="动态模拟仿真" :visible.sync="dialogVisible" width="30%">
        <div class="block">
          <span class="demonstration">开始时间</span>
          <el-date-picker
            :picker-options="pickerOptions"
            id="datetimepicker1"
            v-model="starttime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </div>
        <br /><br />
        <div class="block">
          <span class="demonstration">结束时间</span>
          <el-date-picker
            :picker-options="pickerOptions2"
            id="datetimepicker2"
            v-model="endtime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="suretime">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 提交结果按钮对话框 -->
      <el-dialog title="结果提交" :visible.sync="dialogVisible2" width="30%">
        <div class="block">
          <span class="demonstration">模型参数选择:</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value2"
              :label="item.label2"
              :value="item.value2"
            >
            </el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="send"
            >确定提交</el-button
          >
          <el-button @click="dialogVisible2 = false">返回</el-button>
        </span>
      </el-dialog>

      <!-- 确定提交对话框 -->
      <el-dialog :visible.sync="dialogVisible3" width="30%">
        <div class="block">
          <img src="../../assets/img/1234.jpg" style="width:110px;height:100px;display: block;margin:5px auto;"/>
          <span class="demonstration2" style="text-align: center;display:block;font-size:22px;"><strong>提交成功</strong></span>
          <!-- <hr />
          <br /><br />
          <span class="demonstration" style="font-size:13px;text-align:center;display:block;">请在结果分析页面查看模型分配结果</span
          ><br /><br />
          <hr />
          <br />
          <span class="demonstration" style="font-size:17px;text-align:center;display:block;"><strong>最终得分</strong>&nbsp;&nbsp;
          <span style="font-size:30px;color:rgb(24,144,255)">85</span></span> -->
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false" type="primary"
            >确定</el-button
          >
          <el-button @click="checkresults">查看结果</el-button>
          <!-- <el-button @click="dialogVisible3 = false">导出结果</el-button> -->
        </span>
      </el-dialog>

      <!-- 分配机位对话框 -->
      <el-dialog
        title="请选择想要分配的机位"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-select v-model="gatevalue" placeholder="请选机位">
          <el-option
            v-for="item in gateList"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="assign">确定</el-button>
        <el-button @click="del" class="butt1">删除机位</el-button>
      </el-dialog>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import echarts from "echarts/lib/echarts";
import "echarts/map/js/china.js";
import $ from "jquery";
// 导入请求数据方法
import { selectFlightPriorityData,selectTestData } from "../common/axios/index";
// 导入js方法
import {getNewtime2} from "../common/js/index";
export default {
  data() {
    return {
      //存放每行停机位
      rowgate:'',
      //存放test-flight的数据
      testflightList: "",
      //存放航班优先级表里的flighttype字段
      bb: [],
      typeList: [],
      //航班优先级列表
      prioritylist: [],
      // 时间可选范围
      pickerOptions: {},
      pickerOptions2: {},
      //存放去重后的文件名
      removalList0: "",
      value: "",
      //模型参数选择选择器
      options: [
        {
          value2: "选项1",
          label2: "默认",
        },
        {
          value2: "选项2",
          label2: "自定义配置1",
        },
        {
          value2: "选项3",
          label2: "自定义配置2",
        },
      ],
      starttime: "",
      endtime: "",
      // 当前页，默认显示第1页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [10, 20, 40],
      // 默认每页显示的条数（可修改）
      PageSize: 10,
      drawer: false,
      drawer2: false,
      innerVisible: false,
      //仿真对话框
      dialogVisible: false,
      //参数选择对话框
      dialogVisible2: false,
      //确定提交对话框
      dialogVisible3: false,
      //抽屉打开方向
      direction: "btt",
      airportvalue: "",
      //存放测试航班数据
      testairportlist: [],
      //存放机场名字
      airportnameList: [],
      modelvalue: "",
      modellist: [],
      testvalue: "",
      testvaluelist: [],
      sure: 0,

      //左侧显示表格
      tableData: [],
      //存放所有测试数据
      alltestflight: [[]],
      alltest: [[]],
      //冲突列表
      clashData: [],
      clashDataList: [],
      clashData2: [],
      //航班信息列表
      flyData: [],
      //分配机位绑定值
      gatevalue: "",
      //分配机位选择器列表
      gateList: [],
      //点击行的信息列表
      rowList: [],
      table: [],
      //
      removalgateList: [],
      removalgateList0: [],

      removalmodel0: [],
      allmodel: [],
      //  点击的是哪个测试文件
      filenameIndex: 0,

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
    };
  },
  created() {
    // console.log('文件名：'+JSON.stringify(this.$store.state.testDataNameVuex))
    // this.getUniondata().then(()=>{
    //   let uniondata = {
    //     filename: this.$store.state.testDataNameVuex,
    //     userId: window.sessionStorage.usernamen,
    //   };
    //   // console.log("文件名+用户id" + JSON.stringify(uniondata));
    //   this.getAirData(uniondata)
    // }).then(()=>{
    //   this.getparkingGate();
    //     this.conflictgate(this.tableData);
    //     /////改2
    //     this.allconflictflg(this.tableData);
    //     this.drawLine();
    // })
    this.getUniondata()
   

      // let uniondata = {
      //   filename: this.$store.state.testDataNameVuex,
      //   userId: window.sessionStorage.usernamen,
      // };
      // // console.log("文件名+用户id" + JSON.stringify(uniondata));
      // this.getAirData(uniondata).then(() => {
      //   this.getparkingGate();
      //   this.conflictgate(this.tableData);
      //   /////改2
      //   this.allconflictflg(this.tableData);
      //   this.drawLine();
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
    // console.log('----------this.manualData1------',JSON.stringify(this.tableData))
    this.myChart = this.$echarts.init(document.getElementById("myChart"));
  },

  methods: {
    send(){
      this.dialogVisible2=false
      this.$message({
          message: '模型正在计算',
          type: 'warning',
          duration:1500
        });
     
      // console.log('hahah'+JSON.stringify(this.tableData));
      let aa=[]
      let b=""
      let pk=""
      for(let i=0;i<this.tableData.length;i++){
        // console.log();
        if(this.tableData[i].parkinggate==""){
          b=0
          pk="nonegate"
          console.log('我没分配');
        }else{
          b=1
          pk=this.tableData[i].parkinggate
          console.log('我分配了');
        }
        aa[i]={
          filename:this.tableData[i].filename,
          model:"0",
          flightId:this.tableData[i].flightId.toString(),
          allostate:b,
          parkinggate:pk,
          userId:this.tableData[i].userId,
          updateTime:getNewtime2()
        }
      }
      console.log('hahaah'+JSON.stringify(aa));
      let bbb={
      filename: this.$store.state.testDataNameVuex,
      userId: window.sessionStorage.usernamen,
      airportname:"LJG",
      data:aa
      }
      console.log('bbb:'+JSON.stringify(bbb));
      this.$axios({
        method: "post",
        url: "http://localhost:8866/getmodeldata/getdata",
        data: bbb,
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
      }).then((res)=>{
        console.log(res['data'])
        if(res['data']==true){
           this.dialogVisible3=true
        }else{
           this.$message.error('提交失败');
        }
        console.log('今天周二');
      })
    },
    //设置时间选择器的可选择范围
    setDateTimePicker() {
      let atime2 = [];
      let atime3 = [];
      for (let i = 0; i < this.flightData.length; i++) {
        atime2.push(this.flightData[i].atime);
        // console.log('lx'+atime2)
      }
      atime2 = atime2.sort();
      // console.log('拍了一下'+atime2.length)
      //需要将时间转换一下格式
      let mintime = new Date((this.starttime = atime2[0]));
      let maxtime = new Date((this.endtime = atime2[atime2.length - 1]));
      //disabledDate设置时间选择器禁用状态
      this.pickerOptions = {
        disabledDate(time) {
          return time.getTime() < mintime || time.getTime() > maxtime;
        },
      };
      this.pickerOptions2 = {
        disabledDate(time) {
          return time.getTime() < mintime || time.getTime() > maxtime;
        },
      };
    },
    selectAtimeAddRandom2() {
      let aa = [];
      aa = {
        userId: window.sessionStorage.usernamen,
        filename: this.$store.state.testDataNameVuex,
      };
      //根据用户id和文件名查询test_flight的数据
      this.$axios({
        method: "post",
        url: "http://localhost:8866/test-flight/select",
        data: aa,
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
      }).then((data) => {
        this.testflightList = JSON.parse(JSON.stringify(data.data));
        console.log("test-flight表：" + JSON.stringify(this.testflightList));
        //时间选择器间转为时间戳
        let start = Date.parse(this.starttime);
        let end = Date.parse(this.endtime);
        // console.log("选择器开始结束时间：" + start, end);
        let alist = [];
        let alist2 = [];
        for (let i = 0; i < this.testflightList.length; i++) {  
      //标准时间加.replace(/\s/g,'T').replace(/\//g,'-') 字符串日期格式必须符合ISO 8601标准，标准为：YYYY-MM-DDTHH:mm:ss.sssZ
         let a = Date.parse(new Date(this.testflightList[i].atime.replace(/\s/g,'T').replace(/\//g,'-')))
         console.log("a:"+a);
          if(a>start && a<end){
            alist2.push(this.testflightList[i])
          }
        }
        console.log("我是alist2" + JSON.stringify(alist2));
        //alist2存放符合时间段的test-flight数据
        for (let i = 0; i < alist2.length; i++) {
          //给atime加0-180000毫秒的随机数
          let bb = Math.round(180000 * Math.random());
          // console.log("wo"+new Date(Date.parse(alist2[i].atime.replace(/\s/g,'T').replace(/\//g,'-'))+bb));
          // let cc=Date.parse(alist2[i].atime)
          let cc =new Date(Date.parse(alist2[i].atime.replace(/\s/g,'T').replace(/\//g,'-'))+bb) ;
          console.log("cc+"+cc);
          //将cc标准时间转为2012-11-12 22:11:22格式
          let ccyear = cc.getFullYear();
          let ccmouth =
            cc.getMonth() + 1 < 10
              ? "0" + (cc.getMonth() + 1)
              : cc.getMonth() + 1;
          let ccday = cc.getDate() < 10 ? "0" + cc.getDate() : cc.getDate();
          let cchour = cc.getHours() < 10 ? "0" + cc.getHours() : cc.getHours();
          let ccmin =
            cc.getMinutes() < 10 ? "0" + cc.getMinutes() : cc.getMinutes();
          let ccsec =
            cc.getSeconds() < 10 ? "0" + cc.getSeconds() : cc.getSeconds();
          alist2[
            i
          ].atime = `${ccyear}-${ccmouth}-${ccday} ${cchour}:${ccmin}:${ccsec}`;
          //给dtime加0-180000毫秒的随机数
          let cc1 = new Date(new Date(Date.parse(alist2[i].dtime.replace(/\s/g,'T').replace(/\//g,'-'))+bb));
          let cc1year = cc1.getFullYear();
          let cc1mouth =
            cc1.getMonth() + 1 < 10
              ? "0" + (cc1.getMonth() + 1)
              : cc1.getMonth() + 1;
          let cc1day = cc1.getDate() < 10 ? "0" + cc1.getDate() : cc1.getDate();
          let cc1hour =
            cc1.getHours() < 10 ? "0" + cc1.getHours() : cc1.getHours();
          let cc1min =
            cc1.getMinutes() < 10 ? "0" + cc1.getMinutes() : cc1.getMinutes();
          let cc1sec =
            cc1.getSeconds() < 10 ? "0" + cc1.getSeconds() : cc1.getSeconds();
          alist2[i].dtime = `${cc1year}-${cc1mouth}-${cc1day} ${cc1hour}:${cc1min}:${cc1sec}`;
        }
        // console.log("pppp" + JSON.stringify(alist2));
        return this.$axios({
          method: "post",
          url: "http://localhost:8866/test-flight/update",
          data: alist2,
          headers: {
            token: window.sessionStorage.token,
            "Content-type": "x-www-form-urlencoded;charset=UTF-8",
            "Content-type": "application/json",
          },
        }).then((data) => {});
      });
    },
    //动态模拟仿真的确定按钮
    suretime() {
      // this.selectAtimeAddRandom();
      this.selectAtimeAddRandom2();
      this.dialogVisible = false;
    },
    //显示表格数据
    async getUniondata() {
      let uniondata = {
        filename: this.$store.state.testDataNameVuex,
        //1109晚
        // filename:"LJG",
        userId: window.sessionStorage.usernamen,
        // model:0
      };

      await selectTestData(uniondata).then((data) => {
        // 将数据保存到本地database中
        this.flightData = data.data;
        // console.log('请求的测试数据'+JSON.stringify(this.flightData));
        //------------------------航班属性-------------------------------------------------//
        //存放flight_priority表的数据
        let alist = [];
        //机场名和用户名传给后端
        let airportname = {
          airportname: this.$store.state.airportNameVuex,
          userId: window.sessionStorage.usernamen,
        };
        //请求flight_priority的表数据
        selectFlightPriorityData(airportname).then((data) => {
          alist = data.data;
          this.prioritylist = JSON.parse(JSON.stringify(alist));
          // console.log('////'+JSON.stringify(this.prioritylist));
          for (let i = 0; i < this.prioritylist.length; i++) {
            // console.log('okokok'+this.prioritylist);
            this.bb.push(this.prioritylist[i].flighttype);
          }
          // console.log("this.bb" + JSON.stringify(this.bb));
          //存放每条数据中最小的i
          this.typeList = [];
          for (let j = 0; j < this.flightData.length; j++) {
            let list = [];
            // console.log("第一个" + JSON.stringify(this.flightData[j]));
            // for(let i=0;i<this.bb.length;i++){
            //当为国际航班时
            if (this.flightData[j].nation == 1) {
              //计算bb（存放航班类型的列表）的index
              const index = this.bb.findIndex((item) => {
                if (item == "国际航班") {
                  return true;
                }
              });
              list.push(index);
            }
            //当为过站航班时
            if (this.flightData[j].pass == 1) {
              const index = this.bb.findIndex((item) => {
                if (item == "过站航班") {
                  return true;
                }
              });
              list.push(index);
            }
            //当为过夜航班时
            if (this.flightData[j].paras == 1) {
              const index = this.bb.findIndex((item) => {
                if (item == "过夜航班") {
                  return true;
                }
              });
              list.push(index);
            }
            //当为公务航班时
            if (this.flightData[j].business == 1) {
              const index = this.bb.findIndex((item) => {
                if (item == "公务航班") {
                  return true;
                }
              });
              list.push(index);
            }
            //当为VIP航班时
            if (this.flightData[j].isvip == 1) {
              const index = this.bb.findIndex((item) => {
                if (item == "VIP航班") {
                  return true;
                }
              });
              list.push(index);
            } else {
              const index = this.bb.findIndex((item) => {
                if (item == "普通航班") {
                  return true;
                }
              });
              list.push(index);
              // }
            }
            // console.log(list);
            //min为每条数据的航班索引最小值
            let min = Math.min.apply(null, list);
            //存放所有数据的最小值
            this.typeList.push(min);
          }
          //将每条数据索引最小的航班名字给表格的type属性
          for (let i = 0; i < this.flightData.length; i++) {
            this.flightData[i].type = this.bb[this.typeList[i]];
          }
          // console.log(this.flightData);
          this.tableData = JSON.parse(JSON.stringify(this.flightData));
          // console.log(this.tableData, "iiiiiiiiiiiiii");
          this.totalCount = this.tableData.length;
          if (this.tableData.length === 0) {
          this.go();
        }
        }).then(() => {
        let uniondata = {
          filename: this.$store.state.testDataNameVuex,
          userId: window.sessionStorage.usernamen,
        };
       this.getAirData(uniondata)
       
      }).then(()=>{
        // console.log('----------this.table000------',JSON.stringify(this.table))
      })
// console.log('----------this.manualData1------',JSON.stringify(this.tableData))
        //----------------------------------------------------航班属性结束-----------------------------//
      })

      
      // console.log("文件名+用户id" + JSON.stringify(uniondata));
      // this.getAirData(uniondata).then(() => {
      //   this.getparkingGate();
      //   this.conflictgate(this.tableData);
      //   /////改2
      //   this.allconflictflg(this.tableData);
      //   this.drawLine();
      // });
    },
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
    },
    //查看结果跳转
    checkresults() {
      //2.通过编程式导航跳转页面，地址
      this.$router.push("/resultDiagnios");
    },
    manhandle() {
      myChart.style.display = "none";
      table0.style.display = "block";
      mainFooter.style.display = "block";
      nav11.style.display = "block";
    },
    manhandle2() {
      myChart.style.display = "block";
      table0.style.display = "none";
      nav11.style.display = "block";
      mainFooter.style.display = "none";
    },
    //时间排序
    async asort() {
      let alist = [];
      // let flight0=[]
      if (this.sure == 0) {
        this.select();
        let index = this.testvaluelist.findIndex((item) => {
          if (item.value == this.testvalue) {
            return true;
          }
        });
        // console.log(index)

        // console.log(this.alltestflight[index])
        let flight0 = [];
        let arr = this.alltest[index];
        for (let i = 0; i < arr.length; i++) {
          flight0.push(arr[i]);
        }
        //alist化为时间戳
        for (let i = 0; i < flight0.length; i++) {
          alist.push(Date.parse(flight0[i].atime));
          // console.log(flight0.length)
        }
        //  console.log('oooo'+JSON.stringify(alist))
        for (let i = 0; i < alist.length - 1; i++) {
          for (let j = i + 1; j < alist.length; j++) {
            if (alist[i] > alist[j]) {
              let temp1 = alist[i];
              alist[i] = alist[j];
              alist[j] = temp1;
              // console.log('atime2222222222:'+JSON.stringify(this.tableData[]))
              let temp2 = flight0[i];
              flight0[i] = flight0[j];
              flight0[j] = temp2;
            }
          }
        }
        this.tableData = JSON.parse(JSON.stringify(flight0));
      }

      if (this.sure == 1) {
        this.select();
        let index = this.testairportlist.findIndex((item) => {
          if (item.value == this.airportvalue) {
            return true;
          }
        });
        let index2 = this.modellist.findIndex((item) => {
          if (item.value2 == this.modelvalue) {
            return true;
          }
        });
        // console.log(index)

        // console.log(this.alltestflight[index])
        let alist = [];
        let flight1 = [];
        let arr = this.alltestflight[index];
        for (let i = 0; i < arr.length; i++) {
          if (this.modellist[index2].label2 == arr[i].model) {
            flight1.push(arr[i]);
            // console.log(this.modellist[index2])
          }
        }

        for (let i = 0; i < flight1.length; i++) {
          alist.push(Date.parse(flight1[i].atime));
          // console.log(flight0.length)
        }
        //  console.log('oooo'+JSON.stringify(alist))
        for (let i = 0; i < alist.length - 1; i++) {
          for (let j = i + 1; j < alist.length; j++) {
            if (alist[i] > alist[j]) {
              let temp1 = alist[i];
              alist[i] = alist[j];
              alist[j] = temp1;
              // console.log('atime2222222222:'+JSON.stringify(this.tableData[]))
              let temp2 = flight1[i];
              flight1[i] = flight1[j];
              flight1[j] = temp2;
            }
          }
        }
        // for(let i=0;i<flight0.length;i++){
        //   console.log('atime2222222222:'+JSON.stringify(flight0[i].atime))
        //   this.tableData[i]=flight0[i]

        // }
        this.tableData = JSON.parse(JSON.stringify(flight1));
      }
    },
    async asortdown() {
      let alist = [];
      // let flight0=[]
      if (this.sure == 0) {
        this.select();
        let index = this.testvaluelist.findIndex((item) => {
          if (item.value == this.testvalue) {
            return true;
          }
        });
        // console.log(index)

        // console.log(this.alltestflight[index])
        let flight0 = [];
        let arr = this.alltest[index];
        for (let i = 0; i < arr.length; i++) {
          flight0.push(arr[i]);
        }

        for (let i = 0; i < flight0.length; i++) {
          alist.push(Date.parse(flight0[i].atime));
          // console.log(flight0.length)
        }
        //  console.log('oooo'+JSON.stringify(alist))
        for (let i = 0; i < alist.length - 1; i++) {
          for (let j = i + 1; j < alist.length; j++) {
            if (alist[i] < alist[j]) {
              let temp1 = alist[i];
              alist[i] = alist[j];
              alist[j] = temp1;
              // console.log('atime2222222222:'+JSON.stringify(this.tableData[]))
              let temp2 = flight0[i];
              flight0[i] = flight0[j];
              flight0[j] = temp2;
            }
          }
        }
        // for(let i=0;i<flight0.length;i++){
        //   console.log('atime2222222222:'+JSON.stringify(flight0[i].atime))
        //   this.tableData[i]=flight0[i]

        // }
        this.tableData = JSON.parse(JSON.stringify(flight0));
      }

      if (this.sure == 1) {
        this.select();
        let index = this.testairportlist.findIndex((item) => {
          if (item.value == this.airportvalue) {
            return true;
          }
        });
        let index2 = this.modellist.findIndex((item) => {
          if (item.value2 == this.modelvalue) {
            return true;
          }
        });
        // console.log(index)

        // console.log(this.alltestflight[index])
        let alist = [];
        let flight1 = [];
        let arr = this.alltestflight[index];
        for (let i = 0; i < arr.length; i++) {
          if (this.modellist[index2].label2 == arr[i].model) {
            flight1.push(arr[i]);
            // console.log(this.modellist[index2])
          }
        }

        for (let i = 0; i < flight1.length; i++) {
          alist.push(Date.parse(flight1[i].atime));
          // console.log(flight0.length)
        }
        //  console.log('oooo'+JSON.stringify(alist))
        for (let i = 0; i < alist.length - 1; i++) {
          for (let j = i + 1; j < alist.length; j++) {
            if (alist[i] > alist[j]) {
              let temp1 = alist[i];
              alist[i] = alist[j];
              alist[j] = temp1;
              // console.log('atime2222222222:'+JSON.stringify(this.tableData[]))
              let temp2 = flight1[i];
              flight1[i] = flight1[j];
              flight1[j] = temp2;
            }
          }
        }
        // for(let i=0;i<flight0.length;i++){
        //   console.log('atime2222222222:'+JSON.stringify(flight0[i].atime))
        //   this.tableData[i]=flight0[i]

        // }
        this.tableData = JSON.parse(JSON.stringify(flight1));
      }
    },
    async dsort() {
      let alist = [];
      // let flight0=[]
      if (this.sure == 0) {
        this.select();
        let index = this.testvaluelist.findIndex((item) => {
          if (item.value == this.testvalue) {
            return true;
          }
        });
        // console.log(index)

        // console.log(this.alltestflight[index])
        let flight0 = [];
        let arr = this.alltest[index];
        for (let i = 0; i < arr.length; i++) {
          flight0.push(arr[i]);
        }

        for (let i = 0; i < flight0.length; i++) {
          alist.push(Date.parse(flight0[i].dtime));
          // console.log(flight0.length)
        }
        //  console.log('oooo'+JSON.stringify(alist))
        for (let i = 0; i < alist.length - 1; i++) {
          for (let j = i + 1; j < alist.length; j++) {
            if (alist[i] > alist[j]) {
              let temp1 = alist[i];
              alist[i] = alist[j];
              alist[j] = temp1;
              // console.log('atime2222222222:'+JSON.stringify(this.tableData[]))
              let temp2 = flight0[i];
              flight0[i] = flight0[j];
              flight0[j] = temp2;
            }
          }
        }
        // for(let i=0;i<flight0.length;i++){
        //   console.log('atime2222222222:'+JSON.stringify(flight0[i].atime))
        //   this.tableData[i]=flight0[i]

        // }
        this.tableData = JSON.parse(JSON.stringify(flight0));
      }

      if (this.sure == 1) {
        this.select();
        let index = this.testairportlist.findIndex((item) => {
          if (item.value == this.airportvalue) {
            return true;
          }
        });
        let index2 = this.modellist.findIndex((item) => {
          if (item.value2 == this.modelvalue) {
            return true;
          }
        });
        // console.log(index)

        // console.log(this.alltestflight[index])
        let alist = [];
        let flight1 = [];
        let arr = this.alltestflight[index];
        for (let i = 0; i < arr.length; i++) {
          if (this.modellist[index2].label2 == arr[i].model) {
            flight1.push(arr[i]);
            // console.log(this.modellist[index2])
          }
        }

        for (let i = 0; i < flight1.length; i++) {
          alist.push(Date.parse(flight1[i].dtime));
          // console.log(flight0.length)
        }
        //  console.log('oooo'+JSON.stringify(alist))
        for (let i = 0; i < alist.length - 1; i++) {
          for (let j = i + 1; j < alist.length; j++) {
            if (alist[i] > alist[j]) {
              let temp1 = alist[i];
              alist[i] = alist[j];
              alist[j] = temp1;
              // console.log('atime2222222222:'+JSON.stringify(this.tableData[]))
              let temp2 = flight1[i];
              flight1[i] = flight1[j];
              flight1[j] = temp2;
            }
          }
        }
        // for(let i=0;i<flight0.length;i++){
        //   console.log('atime2222222222:'+JSON.stringify(flight0[i].atime))
        //   this.tableData[i]=flight0[i]

        // }
        this.tableData = JSON.parse(JSON.stringify(flight1));
      }
    },
    async dsortdown() {
      let alist = [];
      // let flight0=[]
      if (this.sure == 0) {
        this.select();
        let index = this.testvaluelist.findIndex((item) => {
          if (item.value == this.testvalue) {
            return true;
          }
        });
        // console.log(index)

        // console.log(this.alltestflight[index])
        let flight0 = [];
        let arr = this.alltest[index];
        for (let i = 0; i < arr.length; i++) {
          flight0.push(arr[i]);
        }

        for (let i = 0; i < flight0.length; i++) {
          alist.push(Date.parse(flight0[i].dtime));
          // console.log(flight0.length)
        }
        //  console.log('oooo'+JSON.stringify(alist))
        for (let i = 0; i < alist.length - 1; i++) {
          for (let j = i + 1; j < alist.length; j++) {
            if (alist[i] < alist[j]) {
              let temp1 = alist[i];
              alist[i] = alist[j];
              alist[j] = temp1;
              // console.log('atime2222222222:'+JSON.stringify(this.tableData[]))
              let temp2 = flight0[i];
              flight0[i] = flight0[j];
              flight0[j] = temp2;
            }
          }
        }
        // for(let i=0;i<flight0.length;i++){
        //   console.log('atime2222222222:'+JSON.stringify(flight0[i].atime))
        //   this.tableData[i]=flight0[i]

        // }
        this.tableData = JSON.parse(JSON.stringify(flight0));
      }

      if (this.sure == 1) {
        this.select();
        let index = this.testairportlist.findIndex((item) => {
          if (item.value == this.airportvalue) {
            return true;
          }
        });
        let index2 = this.modellist.findIndex((item) => {
          if (item.value2 == this.modelvalue) {
            return true;
          }
        });
        // console.log(index)

        // console.log(this.alltestflight[index])
        let alist = [];
        let flight1 = [];
        let arr = this.alltestflight[index];
        for (let i = 0; i < arr.length; i++) {
          if (this.modellist[index2].label2 == arr[i].model) {
            flight1.push(arr[i]);
            // console.log(this.modellist[index2])
          }
        }

        for (let i = 0; i < flight1.length; i++) {
          alist.push(Date.parse(flight1[i].dtime));
          // console.log(flight0.length)
        }
        //  console.log('oooo'+JSON.stringify(alist))
        for (let i = 0; i < alist.length - 1; i++) {
          for (let j = i + 1; j < alist.length; j++) {
            if (alist[i] > alist[j]) {
              let temp1 = alist[i];
              alist[i] = alist[j];
              alist[j] = temp1;
              // console.log('atime2222222222:'+JSON.stringify(this.tableData[]))
              let temp2 = flight1[i];
              flight1[i] = flight1[j];
              flight1[j] = temp2;
            }
          }
        }
        // for(let i=0;i<flight0.length;i++){
        //   console.log('atime2222222222:'+JSON.stringify(flight0[i].atime))
        //   this.tableData[i]=flight0[i]

        // }
        this.tableData = JSON.parse(JSON.stringify(flight1));
      }
    },
    open(row) {
      console.log("我是id" + row.id);
      // this.drawer = true;
      this.innerVisible = true;
      let flight = [];
      flight.push(row);
      //console.log(flight)
      this.flyData = flight;
      this.rowList = row;
    },
    go() {
      this.$message({
        message: "没有对应的数据，请重新选择",
        showClose: true,
        duration: 3000,
        offset: 200,
        type: "warning",
      });
    },

    select() {
      let aflightnumList = [];
      let dflightnumList = [];
      let flightnumList = [];
      for (let i = 0; i < this.flightData.length; i++) {
        aflightnumList.push(this.flightData[i].aflightnum);
        dflightnumList.push(this.flightData[i].dflightnum);
      }

      for (let i = 0; i < aflightnumList.length; i++) {
        let aflight_split = aflightnumList[i].split("");
        // console.log(aflight_split)
        let dflight_split = dflightnumList[i].split("");
        let index = 0;
        for (let j = 0; j < aflight_split.length; j++) {
          if (aflight_split[j] != dflight_split[j]) {
            index = j;
            break;
          }
        }
        let flightnum =
          aflightnumList[i] + "/" + dflightnumList[i].slice(index);
        flightnumList.push(flightnum);
      }

      // console.log(flightnumList)

      // console.log(aflightnumList)
      //在测试选择器中循环
      for (let j = 0; j < this.testvaluelist.length; j++) {
        let arr1 = [];
        //在数据库循环
        for (let i = 0; i < this.flightData.length; i++) {
          //数据库中de文件名字于选择器名字相等的
          if (
            this.flightData[i].model == null &&
            this.flightData[i].filename == this.testvaluelist[j].label
          ) {
            //将与数据库机场名相同的数据放在arr中
            arr1.push(this.flightData[i]);

            // let anum = this.flightData[i].flightnum.substring(0, 7);
            // let dnum = this.flightData[i].flightnum.substring(9, 13);
            // let adnum= anum+dnum
            // console.log(adnum)

            this.flightData[i].flightnum = flightnumList[i];
            //console.log(this.flightData)
          }
        }
        // console.log('2222'+arr)
        //将arr得数据放到allairport中
        this.alltest[j] = arr1;

        // this.getfileName()
        // console.log('------'+JSON.stringify(this.alltest))
      }

      //在航班选择器中循环
      for (let j = 0; j < this.testairportlist.length; j++) {
        let arr = [];
        //在数据库循环
        for (let i = 0; i < this.flightData.length; i++) {
          //数据库中de文件名字于选择器名字相等的
          if (this.flightData[i].filename == this.testairportlist[j].label) {
            //将与数据库机场名相同的数据放在arr中
            arr.push(this.flightData[i]);
            // console.log(arr)

            // let anum = this.flightData[i].flightnum.substring(0, 7);
            // let dnum = this.flightData[i].flightnum.substring(9, 13);
            // let adnum= anum+dnum
            // console.log(adnum)

            this.flightData[i].flightnum = flightnumList[i];
            //console.log(this.flightData)
          }
        }
        // console.log('2222'+arr)
        //将arr得数据放到allairport中
        this.alltestflight[j] = arr;
      }
      // console.log('0000'+this.alltestflight)
      // console.log(this.testairportlist)
      //在模型模型选择器中循环
      for (let n = 0; n < this.modellist.length; n++) {
        let arr1 = [];
        //在数据库循环
        for (let m = 0; m < this.flightData.length; m++) {
          //数据库中de文件名字于选择器名字相等的
          if (this.flightData[m].model == this.modellist[n].label2) {
            //将与数据库机场名相同的数据放在arr中
            arr1.push(this.flightData[m]);
            // console.log('我是模型arr'+arr)

            // let anum = this.flightData[i].flightnum.substring(0, 7);
            // let dnum = this.flightData[i].flightnum.substring(9, 13);
            // let adnum= anum+dnum
            // console.log(adnum)

            //console.log(this.flightData)
          }
        }
        //console.log('###'+arr1)
        //将arr得数据放到allairport中
        this.allmodel[n] = arr1;
        //console.log('111111111222'+this.allmodel)
      }
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
        // console.log("&&&&&" + JSON.stringify(this.table));
      }).then(() => {
        this.getparkingGate();
        // this.drawLine();
        this.conflictgate(this.tableData);
        /////改2
        this.allconflictflg(this.tableData);
        this.drawLine();
      }).then(()=>{
              // console.log('----------this.table------',JSON.stringify(this.table))

      });
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

    //分配机位
    // async assign() {
    //   //将改变的停机位与对应的id传给后端
    //   let a = this.gateList[this.gatevalue].label;
    //   let b = this.rowList.id;
    //   let k = {
    //     parkinggate: a,
    //     flightId: b,
    //     allostate: 1,
    //   };
    //   console.log("k" + JSON.stringify(k));
    //   await this.postData(k).then(() => {
    //     this.getUniondata()
    //       .then(() => {
    //         this.conflictgate(this.tableData);
    //         this.allconflictflg(this.tableData);
    //       })
    //       .then(() => {
    //         this.drawLine();
    //         this.innerVisible = false;
    //       });
    //   });
    //   // this.drawer = false;
    // },
    assign(){
      this.rowgate = this.gateList[this.gatevalue].label;
      // console.log('a:'+this.rowgate);
      // console.log(this.rowList);
        //  console.log(this.rowgate);
      this.rowList.parkinggate=this.rowgate
      this.conflictgate(this.tableData);
      this.allconflictflg(this.tableData);
      this.drawLine();
      this.innerVisible = false;
    },

    del(){
      this.rowList.parkinggate=""
      this.conflictgate(this.tableData);
      this.allconflictflg(this.tableData);
      this.drawLine();
      this.innerVisible = false;
    },

    //删除机位
    // async del() {
    //   let b = this.rowList.id;
    //   let k = {
    //     parkinggate: "",
    //     flightId: b,
    //     allostate: 0,
    //   };
    //   console.log("kkkk" + JSON.stringify(k));
    //   await this.postData(k).then(() => {
    //     this.getUniondata()
    //       .then(() => {
    //         this.conflictgate(this.tableData);
    //         this.allconflictflg(this.tableData);
    //       })
    //       .then(() => {
    //         this.drawLine();
    //         // this.innerVisible=false
    //       });
    //   });
    //   // 关闭对对话框
    //   // this.drawer = false;
    //   this.innerVisible = false;
    // },

    // 将更改机位传到后端
    async postData(finalList) {
      return this.$axios({
        method: "post",
        url: "http://localhost:8866/result/update",
        data: finalList,
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
      }).then((data) => {});
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
    //冲突提示
    //********************改***********冲突提示*************************************
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
        //所有冲突航班
        this.allconflictflgs = allflgs;
        this.clashData = this.allconflictflgs;
        this.clashDataList.push(this.clashData);
      }
      console.log("所有冲突的航班表alalalalall:" + JSON.stringify(this.allconflictflgs));
       console.log("我是冲突表格" + this.clashData);
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
      // console.log('----------this.manualData1------',JSON.stringify(this.tableData))
      //将航班数据覆盖存入_rawdata甘特图数据源
      this.$http.get("static/airport-schedule.json").then((res) => {
        this._rawData = res.body;
        let resbody = [];
        resbody = res.body;
        this._rawData22222 = res.body;
        resbody = res.body;
        // myChart.setOption(option = makeOption());
        // this.initDrag();
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
      this.manualData = this.tableData;
      // this.manualData = this.flightData;
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
      // console.log('----------this.manualData1------',JSON.stringify(this.manualData))
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
      // console.log('----------------',JSON.stringify(noassignflight))

      // console.log('排序之后的:'+JSON.stringify(this.manualData))
      let bufferrow = 0- gaterow;
      console.log("缓冲区行数为：" + bufferrow);

      //*********************2020/4/14(结束)******************************** */

      // console.log('manualDatalen:'+datalength)
      //  console.log("yyyyy" + this.manualData.length);

      //****************** */
      for (let i = 0; i <this.manualData1.length; i++) {
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

      //***********************改(结束)*******冲突时间段bar******************************** */
      gatecount = this.gateList.length + 1;
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
            end: 80,
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
            width: 20,
            right: 5,
            //*********** */
            width: 10,
            right: 10,
            top: 70,
            bottom: 20,
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
            moveOnMouseMove: false,
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
      this.initDrag();
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

    initDrag() {
      var clashlen = "";
      var _autoDataZoomAnimator = this._autoDataZoomAnimator;
      var _draggingEl = this._draggingEl;
      var _dropShadow = this._dropShadow;
      var _draggingRecord = this._draggingRecord;
      var _dropRecord = this._dropRecord;
      var _draggable = this._draggable;

      //这里 DIM_CATEGORY_INDEX 为 0
      var DIM_CATEGORY_INDEX = this.DIM_CATEGORY_INDEX;
      //这里 DIM_TIME_ARRIVAL 为 1
      var DIM_TIME_ARRIVAL = this.DIM_TIME_ARRIVAL;
      //这里 DIM_TIME_DEPARTURE 为 2
      var DIM_TIME_DEPARTURE = this.DIM_TIME_DEPARTURE;
      // console.log('DIM_CATEGORY_INDEX'+DIM_CATEGORY_INDEX)
      var myChart = this.myChart;
      var HEIGHT_RATIO = this.HEIGHT_RATIO * 1.5;
      var _draggingCursorOffset = this._draggingCursorOffset;
      var _draggingTimeLength = this._draggingTimeLength;
      var _cartesianXBounds = this._cartesianXBounds;
      var _cartesianYBounds = this._cartesianYBounds;
      var DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH = 30;
      var _rawData = this._rawData;

      //2020/05/01
      var _rawData3 = this._rawData3;
      var _rawData33 = this._rawData3;
      var _rawData222 = this._rawData2;
      var allconflicttable = this.allconflicttable;
      var http = this.$http;

      var manualData = this.manualData1;
      var removalgateList0 = this.removalgateList0;
      var arr = [];
      var clashData2 = this.clashData;
      var that=this
      var DATA_ZOOM_X_INSIDE_INDEX = 1;
      var DATA_ZOOM_Y_INSIDE_INDEX = 3;
      var DATA_ZOOM_AUTO_MOVE_SPEED = 0.2;

      // console.log('clashData2是多少'+JSON.stringify(clashData2));

      //   let temp={
      //     parkinggate:"13",
      //     flightnum1:"JD5536",
      //     flightnum2:"CZ3475"

      //   }
      //  clashData2.push(temp)
      //  console.log('clashData2是多少1:'+JSON.stringify(clashData2));

      _autoDataZoomAnimator = makeAnimator(dispatchDataZoom);

      myChart.on("mousedown", function (param) {
        //2020/05/01
        if (!(param.value[9].indexOf("G") != -1)) {
          return;
        }

        

        // console.log('param:'+(param.dataIndex))
        // if (!_draggable || !param || param.seriesIndex == null) {
        //     return;
        // }
        // console.log('onDragSwitchClick222:'+_draggable)
        // if (!_draggable) {
        //     console.log('onDragSwitchClick222:'+(_draggable))
        //     return;
        // }
        // console.log('onDragSwitchClick222:'+(!_draggable))
        // if(param.seriesIndex == null){
        //     return;
        // }

        // Drag start
        _draggingRecord = {
          dataIndex: param.dataIndex,
          categoryIndex: param.value[DIM_CATEGORY_INDEX],
          timeArrival: param.value[DIM_TIME_ARRIVAL],
          timeDeparture: param.value[DIM_TIME_DEPARTURE],
        };
        console.log("paramdataIndex:" + param.dataIndex);
        console.log("paramvalue:" + new Date(param.value[DIM_TIME_ARRIVAL]));
        console.log("paramparkinggate:" + param.value[0]);
        var style = {
          lineWidth: 2,
          fill: "rgba(255,0,0,0.1)",
          stroke: "rgba(255,0,0,0.8)",
          lineDash: [6, 3],
        };

        _draggingEl = addOrUpdateBar(_draggingEl, _draggingRecord, style, 100);
        _draggingCursorOffset = [
          _draggingEl.position[0] - param.event.offsetX,
          _draggingEl.position[1] - param.event.offsetY,
        ];
        _draggingTimeLength =
          _draggingRecord.timeDeparture - _draggingRecord.timeArrival;

        // //***********拖拽***********之后更新左侧表格数据************************
        //         //拖拽之后显示更新左侧表格
        //         manualData[param.dataIndex].parkinggate=param.value[0];
      });
      //     this.manualData=manualData;
      // //***********拖拽**********之后更新左侧表格数据(结束)*************************

      myChart.getZr().on("mousemove", function (event) {
        if (!_draggingEl) {
          return;
        }

        var cursorX = event.offsetX;
        var cursorY = event.offsetY;

        // Move _draggingEl.
        _draggingEl.attr("position", [
          _draggingCursorOffset[0] + cursorX,
          _draggingCursorOffset[1] + cursorY,
        ]);

        prepareDrop();

        autoDataZoomWhenDraggingOutside(cursorX, cursorY);
      });

      //2020/05/01
      myChart.getZr().on("mouseup", async function () {
        // Drop
        if (_draggingEl && _dropRecord) {
          // console.log("iiiiii:" + JSON.stringify(_rawData222));

          (await updateRawData()) &&
            myChart.setOption({
              series: [
                {
                  id: "flightData",
                  data: _rawData.flight.data,
                },
                {
                  id: "conflictData",
                  data: _rawData222.flight.data,
                },
              ],
            });
        }
        dragRelease();
      });
      myChart.getZr().on("globalout", dragRelease);

      function dragRelease() {
        _autoDataZoomAnimator.stop();

        if (_draggingEl) {
          myChart.getZr().remove(_draggingEl);
          _draggingEl = null;
        }
        if (_dropShadow) {
          myChart.getZr().remove(_dropShadow);
          _dropShadow = null;
        }
        _dropRecord = _draggingRecord = null;
      }

      //更新每个bar的位置
      function addOrUpdateBar(el, itemData, style, z) {
        // var myChart = this.$echarts.init(document.getElementById('myChart'));
        //convertToPixel这个API进行了从 data 到像素坐标的转换，以确定每个矩形所处的位置，然后进行矩形的绘制
        var pointArrival = myChart.convertToPixel("grid", [
          itemData.timeArrival,
          itemData.categoryIndex,
        ]);
        var pointDeparture = myChart.convertToPixel("grid", [
          itemData.timeDeparture,
          itemData.categoryIndex,
        ]);

        var barLength = pointDeparture[0] - pointArrival[0];
        var barHeight =
          Math.abs(
            myChart.convertToPixel("grid", [0, 0])[1] -
              myChart.convertToPixel("grid", [0, 1])[1]
          ) * HEIGHT_RATIO;

        if (!el) {
          el = new echarts.graphic.Rect({
            shape: { x: 0, y: 0, width: 0, height: 0 },
            style: style,
            z: z,
          });
          myChart.getZr().add(el);
        }
        el.attr({
          shape: { x: 0, y: 0, width: barLength, height: barHeight },
          position: [pointArrival[0], pointArrival[1] - barHeight],
        });
        return el;
      }

      function prepareDrop() {
        // Check droppable place.
        var xPixel = _draggingEl.shape.x + _draggingEl.position[0];
        var yPixel = _draggingEl.shape.y + _draggingEl.position[1];
        var cursorData = myChart.convertFromPixel("grid", [xPixel, yPixel]);
        if (cursorData) {
          // Make drop shadow and _dropRecord
          _dropRecord = {
            categoryIndex: Math.floor(cursorData[1]),
            timeArrival: cursorData[0],
            timeDeparture: cursorData[0] + _draggingTimeLength,
          };
          var style = { fill: "rgba(0,0,0,0.4)" };
          _dropShadow = addOrUpdateBar(_dropShadow, _dropRecord, style, 99);
        }
      }

      // var clashData2 = this.clashData;
      // This is some business logic, don't care about it.
      async function updateRawData() {
        var flightData = _rawData.flight.data;
        var movingItem = flightData[_draggingRecord.dataIndex];

        // Check conflict
        // for (var i = 0; i < flightData.length; i++) {
        //     var dataItem = flightData[i];
        //     //************************* */
        //     if (dataItem !== movingItem
        //         && _dropRecord.categoryIndex === dataItem[DIM_CATEGORY_INDEX]
        //         && _dropRecord.timeArrival < dataItem[DIM_TIME_DEPARTURE]
        //         && _dropRecord.timeDeparture > dataItem[DIM_TIME_ARRIVAL]
        //     ) {
        //         alert('Conflict! Find a free space to settle the bar!');
        //         // return;
        //     }

        // }

        // No conflict.
        movingItem[DIM_CATEGORY_INDEX] = _dropRecord.categoryIndex;
        // movingItem[DIM_TIME_ARRIVAL] = _dropRecord.timeArrival;
        // movingItem[DIM_TIME_DEPARTURE] = _dropRecord.timeDeparture;

        console.log("_INDEX:" + _draggingRecord.dataIndex);

        console.log(
          "moveingItem_DIM_CATEGORY_INDEX:" + _dropRecord.categoryIndex
        );
        //***********拖拽***********之后更新左侧表格数据************************
        // //拖拽之后显示更新左侧表格
        // manualData[_draggingRecord.dataIndex].parkinggate=_dropRecord.categoryIndex;

        // console.log('manualData为：'+JSON.stringify(manualData));
        // console.log('manualData为：'+(manualData[_draggingRecord.dataIndex].id));

        //更新数据库
        if (_dropRecord.categoryIndex > 0) {
          //拖拽之后显示更新左侧表格
          manualData[_draggingRecord.dataIndex].parkinggate =
            _dropRecord.categoryIndex;
          // let idandgate = {
          //   // flightId: manualData[_draggingRecord.dataIndex].id,
          //   // allostate: 1,
          //   parkinggate: _dropRecord.categoryIndex,
          // };
          let idandgate=""
          idandgate=_dropRecord.categoryIndex
          // console.log('你你你你你'+JSON.stringify(idandgate));
          // console.log('你你你你你'+updateTableData);
          // clashData2[0].parkinggate="13";
          await updateTableData(idandgate);
          let temp0 = allconflictflg2(manualData);
          // clashData = arr
          //2020/05/01
          that.clashData = conflictgate2(manualData);
          console.log("jjjjj" + JSON.stringify(allconflicttable));
          let table0=redpoint(manualData)
          // that.clashData=JSON.parse(JSON.stringify(allconflicttable))
          
          
          // console.log('yyyyy'+JSON.stringify(_rawData33))
          // _rawData222=_rawData3;
          _rawData222 = JSON.parse(JSON.stringify(_rawData33));

          let datalength2 = table0.length;
          for (let i = 0; i < table0.length; i++) {
            if (table0[i].parkinggate != null) {
              _rawData222.flight.data[i][0] = table0[i].parkinggate;
            } else {
              _rawData222.flight.data[i][0] = 1000;
            }
            _rawData222.flight.data[i][1] = table0[i].atime;
            _rawData222.flight.data[i][2] = table0[i].dtime;
          }

          //多余航班数据源删除
          _rawData222.flight.data.splice(
            datalength2,
            _rawData222.flight.data.length - datalength2
          );
        } else {
          //拖拽之后显示更新左侧表格
          manualData[_draggingRecord.dataIndex].parkinggate = "";
          // let idandgate = {
          //   id: manualData[_draggingRecord.dataIndex].id,
          //   allostate: 0,
          //   parkinggate: "",
          // };
          let idandgate=""
          console.log('我我我我我我'+manualData[_draggingRecord.dataIndex].id);
          // clashData2[0].parkinggate="13";
          await updateTableData(idandgate);
          let temp0 = allconflictflg2(manualData);
          //2020/05/01
           that.clashData = conflictgate2(manualData);
          let table0=redpoint(manualData)
          // that.clashData=JSON.parse(JSON.stringify(allconflicttable))
          // _rawData222=_rawData2;
          console.log("jjjjj" + JSON.stringify(allconflicttable));
          // console.log('yyyyy'+JSON.stringify(_rawData33))
          // var _rawData222=_rawData3;
          _rawData222 = JSON.parse(JSON.stringify(_rawData33));

          let datalength2 = table0.length;
          for (let i = 0; i < table0.length; i++) {
            if (table0[i].parkinggate != null) {
              _rawData222.flight.data[i][0] = table0[i].parkinggate;
            } else {
              _rawData222.flight.data[i][0] = 1000;
            }
            _rawData222.flight.data[i][1] = table0[i].atime;
            _rawData222.flight.data[i][2] = table0[i].dtime;
          }

          //多余航班数据源删除
          _rawData222.flight.data.splice(
            datalength2,
            _rawData222.flight.data.length - datalength2
          );
        }

        return true;
      }
      // console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkl:'+JSON.stringify(clashData2))
      //   let temp={
      //     parkinggate:"13",
      //     flightnum1:"JD5536",
      //     flightnum2:"CZ3475"

      //   }
      //  clashData2.push(temp)
      //  console.log('clashData2是多少1:'+JSON.stringify(clashData2));

      //******************************************************************************************** */
      // this._draggingRecord=_draggingRecord;
      //更新表格
      // console.log('hhhhhhhhhhhhhhh'+_dropRecord.categoryIndex)

      // this.manualData=manualData;
      // this.clashData=clashData
      // console.log('11111:'+JSON.stringify(manualData))
      // console.log("22222:" + JSON.stringify(this.clashData));

      // this.conflictgate(this.manualData);
      // console.log('this.conflictgate为：：：'+JSON.stringify(this.allconflicttable))
      // //画图
      // this.drawLine();

      var axios = this.$axios;
      var that=this
      async function updateTableData(da) {
        // await axios({
        //   method: "post",
        //   // url: "http://localhost:8088/manual-result/updatecopy",
        //   url: "http://localhost:8866/result/update",
        //   data: da,
        //   headers: {
        //     token: window.sessionStorage.token,
        //     "Content-type": "x-www-form-urlencoded;charst=UTF-8",
        //     "Content-type": "application/json",
        //   },
        // }).then((data) => {
        //   console.log('啦啦啦啦啦啦啦'+JSON.stringify(da));
        //   // console.log('ppp'+JSON.stringify(window.sessionStorage.token));
        //   that.getUniondata()
        // });
     
          that.tableData.parkinggate=da
       
        
      }
      // this.getUniondata()
      // async function deleteTableData(da) {
      //   await axios({
      //     method: "post",
      //     url: "http://localhost:8866/result/update2",
      //     data: da,
      //     headers: {
      //       token: window.sessionStorage.token,
      //       "Content-type": "x-www-form-urlencoded;charst=UTF-8",
      //       "Content-type": "application/json",
      //     },
      //   }).then((data) => {
      //     console.log(da);
      //   });
      // }
      //***********************2020/05/01************/
      // funtion conflictgate2(table) {
      // let allflgs = [];
      // let flg = [];
      // for (let i = 0; i < this.removalgateList0.length; i++) {
      //   //选出该机位对应的所有航班
      //   flg = this.selecttheseflg(table, this.removalgateList0[i]);
      //   for (let m = 0; m < flg.length - 1; m++) {
      //     for (let n = m + 1; n < flg.length; n++) {
      //       //冲突
      //       let condata = {
      //         parkinggate: "",
      //         flightnum1: "",
      //         flightnum2: "",
      //       };
      //       if (this.conflictwarning(flg[m], flg[n]) == 1) {
      //         condata.parkinggate = this.removalgateList0[i];
      //         condata.flightnum1 = flg[m].aflightnum;
      //         condata.flightnum2 = flg[n].aflightnum;
      //         allflgs.push(condata);
      //       }
      //     }
      //   }
      //   //所有冲突航班
      //   this.allconflictflgs = allflgs;
      //   this.clashData = this.allconflictflgs;
      //   this.clashDataList.push(this.clashData);
      // }
      // console.log("所有冲突的航班表alalalalall:" + JSON.stringify(this.allconflictflgs));
      //  console.log("我是冲突表格" + this.clashData);
    // }
    function conflictgate(table) {
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
    }
      function redpoint(table){
         //  console.log("lilili" + JSON.stringify(this.removalgateList0));
        //  console.log("wuwuwuwuwu" + JSON.stringify(table));
        let flg = [];
        allconflicttable = [];
        //冲突的时间数据条列表
        let conflicttable = [];
        let allcontable = [];
        for (let i = 0; i < removalgateList0.length; i++) {
          //定义该机位上的冲突航班冲突时间段列表
          let period = [];
          //选出该机位对应的所有航班
          flg = selecttheseflg2(table, removalgateList0[i]);
          // console.log("flghhhhhhhhhhhhhhhhhoooo:" + JSON.stringify(flg));
          conflicttable = isTimeCollision2(flg, removalgateList0[i]);
          // var newDate0 = new Date(conflicttable[0].atime);
          conflicttable = JSON.parse(JSON.stringify(conflicttable));
          allcontable = allcontable.concat(conflicttable);
          //  console.log("所有冲突的表12345678:" + JSON.stringify(allcontable));
        }
        allconflicttable = allcontable;
        // console.log("所有冲突的表12345678:" + JSON.stringify(allconflicttable));
        console.log(
          "rrrrrr:" + JSON.stringify(allconflicttable)
        );
        return allconflicttable;
      }
    
      function conflictgate2(table) {
        // //  console.log("lilili" + JSON.stringify(this.removalgateList0));
        // //  console.log("wuwuwuwuwu" + JSON.stringify(table));
        // let flg = [];
        // allconflicttable = [];
        // //冲突的时间数据条列表
        // let conflicttable = [];
        // let allcontable = [];
        // for (let i = 0; i < removalgateList0.length; i++) {
        //   //定义该机位上的冲突航班冲突时间段列表
        //   let period = [];
        //   //选出该机位对应的所有航班
        //   flg = selecttheseflg2(table, removalgateList0[i]);
        //   // console.log("flghhhhhhhhhhhhhhhhhoooo:" + JSON.stringify(flg));
        //   conflicttable = isTimeCollision2(flg, removalgateList0[i]);
        //   // var newDate0 = new Date(conflicttable[0].atime);
        //   conflicttable = JSON.parse(JSON.stringify(conflicttable));
        //   allcontable = allcontable.concat(conflicttable);
        //   //  console.log("所有冲突的表12345678:" + JSON.stringify(allcontable));
        // }
        // allconflicttable = allcontable;
        // // console.log("所有冲突的表12345678:" + JSON.stringify(allconflicttable));
        // console.log(
        //   "rrrrrr:" + JSON.stringify(allconflicttable)
        // );
        // return allconflicttable;
      let allflgs = [];
      let flg = [];
      let conflicttable = [];
      for (let i = 0; i < that.removalgateList0.length; i++) {
        //选出该机位对应的所有航班
        flg = that.selecttheseflg(table, that.removalgateList0[i]);
        conflicttable = isTimeCollision2(flg, that.removalgateList0[i]);
        conflicttable = JSON.parse(JSON.stringify(conflicttable));
        that._rawData2=conflicttable
        for (let m = 0; m < flg.length - 1; m++) {
          for (let n = m + 1; n < flg.length; n++) {
            //冲突
            let condata = {
              parkinggate: "",
              flightnum1: "",
              flightnum2: "",
            };
            if (that.conflictwarning(flg[m], flg[n]) == 1) {
              condata.parkinggate = that.removalgateList0[i];
              condata.flightnum1 = flg[m].aflightnum;
              condata.flightnum2 = flg[n].aflightnum;
              allflgs.push(condata);
            }
          }
        }
        //所有冲突航班
        // this.allconflictflgs = allflgs;
        // this.clashData = this.allconflictflgs;
        // this.clashDataList.push(this.clashData);
        that.clashData=allflgs;
        clashData2=allflgs;
      }
        console.log("我是冲突表格" + JSON.stringify(that.clashData));
      return that.clashData;
      // console.log("所有冲突的航班表alalalalall:" + JSON.stringify(this.allconflictflgs));
     
        
      }

      function isTimeCollision2(flg, gateno) {
        let alist = [];
        let dlist = [];
        //冲突的航班数据表格
        let confilght = [];
        for (let i = 0; i < flg.length; i++) {
          alist.push(Date.parse(flg[i].atime));
          dlist.push(Date.parse(flg[i].dtime));
          // console.log('fltimehoooo:'+JSON.stringify(alist))
        }
        let timesortresult = atimesort2(alist, dlist);
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
          } else {
            lastendtime = dlist[i];
          }
        }
        return confilght;
      }

      function atimesort2(alist, dlist) {
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
      }

      //****************************************结束*(2020/05/01) */

      function selecttheseflg2(table, gateno) {
        // console.log('传入的table:'+(JSON.stringify(table)));
        let theseflight = [];
        // console.log('shcuhu'+gateno)
        for (let i = 0; i < table.length; i++) {
          if (table[i].parkinggate == gateno) {
            theseflight.push(table[i]);
          }
        }
        return theseflight;
      }

      // console.log('.....'+JSON.stringify(clashData))
      function allconflictflg2(table) {
        let allflgs = [];
        let flg = [];
        for (let i = 0; i < removalgateList0.length; i++) {
          //选出该机位对应的所有航班
          flg = selecttheseflg2(table, removalgateList0[i]);
          for (let m = 0; m < flg.length - 1; m++) {
            for (let n = m + 1; n < flg.length; n++) {
              //冲突
              let condata = {
                parkinggate: "",
                flightnum1: "",
                flightnum2: "",
              };
              if (conflictwarning2(flg[m], flg[n]) == 1) {
                condata.parkinggate = removalgateList0[i];
                condata.flightnum1 = flg[m].aflightnum;
                condata.flightnum2 = flg[n].aflightnum;
                allflgs.push(condata);
              }
            }
          }
          console.log('allflgs'+allflgs);
          //clashData2=allflgs;
          //所有冲突航班
          // arr = allflgs;
          // console.log('44555555555555555'+JSON.stringify(clashData2))
          // clashData2 = arr
          // console.log('44'+JSON.stringify(clashData2))
        }
          let temp1 = {
            parkinggate: "",
            flightnum1: "",
            flightnum2: "",
          };
        clashData2.length = 0;
        if (allflgs.length > 0) {
          for (let i = 0; i < allflgs.length; i++) {
            clashData2.push(allflgs[i]);
          }
          let len1 = clashData2.length;
          let len2 = clashlen.length;
          if (len1 > len2) {
            alert("机位冲突!详情见表格");
          } else if (len1 == len2) {
            len1--;
            len2--; // console.log('conflict机位为：'+clashlen[len2].parkinggate)
            if (len1 >= 0 && len2 >= 0) {
              if (clashData2[len1].flightnum1 != clashlen[len2].flightnum1) {
                alert("机位冲突!详情见表格");
              } else if (
                clashData2[len1].flightnum2 != clashlen[len2].flightnum2
              ) {
                alert("机位冲突!详情见表格");
              } else if (
                clashData2[len1].parkinggate != clashlen[len2].parkinggate
              ) {
                alert("机位冲突!详情见表格");
              }
            }
          } 
          clashlen = JSON.parse(JSON.stringify(clashData2));
        }
        else {
          console.log('temp1'+JSON.stringify(temp1));
          console.log('temp1.parkinggate'+JSON.stringify(temp1.parkinggate));
          that.clashData=clashData2;
          clashData2.push(temp1);
          clashlen = JSON.parse(JSON.stringify(clashData2));
          console.log("kkkkkkkk"+JSON.stringify(that.clashData));
          console.log("kkkkkkkk:" + clashData2.length);
        }

        console.log('冲突提示表格:'+JSON.stringify(clashData2));

        return allflgs;
      }

      //判断两个航班是否冲突
      function conflictwarning2(flg1, flg2) {
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
      }
      //***********拖拽**********之后更新左侧表格数据(结束)*************************

      function autoDataZoomWhenDraggingOutside(cursorX, cursorY) {
        // When cursor is outside the cartesian and being dragging,
        // auto move the dataZooms.
        var cursorDistX = getCursorCartesianDist(cursorX, _cartesianXBounds);
        var cursorDistY = getCursorCartesianDist(cursorY, _cartesianYBounds);

        if (cursorDistX !== 0 || cursorDistY !== 0) {
          _autoDataZoomAnimator.start({
            cursorDistX: cursorDistX,
            cursorDistY: cursorDistY,
          });
        } else {
          _autoDataZoomAnimator.stop();
        }
      }

      function dispatchDataZoom(params) {
        console.log("dispatchDataZoom");
        var option = myChart.getOption();
        var optionInsideX = option.dataZoom[DATA_ZOOM_X_INSIDE_INDEX];
        var optionInsideY = option.dataZoom[DATA_ZOOM_Y_INSIDE_INDEX];
        var batch = [];

        prepareBatch(
          batch,
          "insideX",
          optionInsideX.start,
          optionInsideX.end,
          params.cursorDistX
        );
        prepareBatch(
          batch,
          "insideY",
          optionInsideY.start,
          optionInsideY.end,
          -params.cursorDistY
        );

        batch.length &&
          myChart.dispatchAction({
            type: "dataZoom",
            batch: batch,
          });

        function prepareBatch(batch, id, start, end, cursorDist) {
          if (cursorDist === 0) {
            return;
          }
          var sign = cursorDist / Math.abs(cursorDist);
          var size = end - start;
          var delta = DATA_ZOOM_AUTO_MOVE_SPEED * sign;

          start += delta;
          end += delta;

          if (end > 100) {
            end = 100;
            start = end - size;
          }
          if (start < 0) {
            start = 0;
            end = start + size;
          }
          batch.push({
            dataZoomId: id,
            start: start,
            end: end,
          });
        }
      }

      function getCursorCartesianDist(cursorXY, bounds) {
        var dist0 =
          cursorXY - (bounds[0] + DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH);
        var dist1 =
          cursorXY - (bounds[1] - DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH);
        return dist0 * dist1 <= 0
          ? 0 // cursor is in cartesian
          : dist0 < 0
          ? dist0 // cursor is at left/top of cartesian
          : dist1; // cursor is at right/bottom of cartesian
      }

      function makeAnimator(callback) {
        var requestId;
        var callbackParams;
        // Use throttle to prevent from calling dispatchAction frequently.
        var DATA_ZOOM_AUTO_MOVE_THROTTLE = 30;
        //设置触发视图刷新的频率，单位为毫秒
        callback = echarts.throttle(callback, DATA_ZOOM_AUTO_MOVE_THROTTLE);
        // console.log('callback:::'+callback)

        function onFrame() {
          callback(callbackParams);
          requestId = requestAnimationFrame(onFrame);
          console.log("onFrame");
        }
        return {
          start: function (params) {
            callbackParams = params;
            if (requestId == null) {
              onFrame();
            }
            // console.log("makeAnimator1");
          },
          stop: function () {
            if (requestId != null) {
              cancelAnimationFrame(requestId);
            }
            // console.log("makeAnimator2");
            requestId = callbackParams = null;
          },
        };
      }
    },
  },

  //甘特图end************************************
};
</script>

<style lang="scss" scoped>
//提交结果按钮下的提交成功
// .demonstration2{
//  text-align: center;
// }
.gates {
  height: 100%;
  //  display: flex;
  //   justify-content: left;
}
.alert {
  text-align: left;
  font-size: 25px;
}
#myChart {
  // width: 80%;
  display: none;
  //   position: absolute;
  z-index: 2;
  margin-top: 3%;
}
.butt1 {
  width: 100px;
}
.okkk {
  // width: 91%;
  height: 50px;
  background-color: rgb(230, 247, 255);
}
.newData {
  width: 900px;
  list-style: none;
  margin: 5px 0px 0px 11px;
  // padding: 6px;
  //设置单元格之间的间距
  border-collapse: separate;
  border-spacing: 0px 5px;
  .tr {
    .td1 {
      font-size: 13px;
      color: #005bac;
      border: 1px solid #005bac;
      // width: 150px;
      width: 100px;
      height: 16px;
      text-align: center;
      padding: 5px;
    }
    .td1:hover,
    .td1:active {
      background-color: #005bac;
      color: white;
    }
  }
}

.el-link {
  color: rgb(0, 91, 172);
  margin-top: 16px;
}
.el-icon-close {
  color: red;
  margin-left: 822px;
  margin-top: 20px;
  font-size: 32px;
}
.word {
  font-size: 16px;
}
#nav11 {
  // margin-left: 71%;
  overflow: auto;
  margin-top: 0;
  // width: 95%;
  height: 200px;
  font-size: 15px;
  border: 1px rgb(192, 196, 204) solid;
  display: block;
  //   position: absolute;
  z-index: 2;
  margin-left: -1px;
}
#table0 {
  display: block;
  //   position: absolute;
  z-index: 2;
  margin-top: 1%;
  margin-left: -1px;
  // margin-top: 20px;
  // width: %;
}
.el-table .cell {
  line-height: 32px;
}
#mainFooter {
  margin-left: -4px;
  margin-top: 0.5%;
  display: block;
  //   position: absolute;
  z-index: 2;
}
.container{
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
}
.pagination{
   margin-top: 20px;
  //  margin-right:10px;

}
// .main{
//   width: 100%;
// }
</style>
