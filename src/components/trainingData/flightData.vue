<template>
  <div>
    <!-- 面包屑---显示当前页面的路径，快速返回之前的任意页面-->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item> <i class="el-icon-s-data"></i> 训练数据 </el-breadcrumb-item>
        <el-breadcrumb-item>航班数据</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <!-- 训练数据选择器 -->
        <span class="selectData">航班测试数据:</span>
        <el-select
          class="handle-select mr10"
          v-model="selectTestData"
          placeholder="请选择航班数据"
        >
          <el-option
            v-for="item in testDataNameList"
            :key="item.id"
            :label="item.filename"
            :value="item.id"
          ></el-option>
        </el-select>
        <!-- 查询数据 -->
        <span class="selectData2">航班号:</span>
        <el-input
          placeholder="请输入航班号"
          v-model="selectAirportNum"
          clearable
          style="width: 150px"
        ></el-input>
        <!-- 查询按钮 -->
        <el-button
          type="primary"
          icon="el-icon-search"
          class="handle-del btu-left-right"
          @click="selectAirNum"
          >查询</el-button
        >
        <el-button
          type="primary"
          class="handle-del btu-left-right"
          @click="selectAirDialog = true"
          >高级查询</el-button
        >
        <el-button class="handle-del btu-left-right" @click="selectAirNumCancel"
          >重置</el-button
        >
      </div>
      <div class="handle-box">
        <!-- 添加测试按钮 -->
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          class="handle-del mr10"
          @click="addTestDatadialogOpen"
          >添加测试数据</el-button
        >
        <!-- 上传数据按钮 -->
        <el-button
          v-if="this.rolen === 'admin'"
          type="primary"
          class="handle-del mr10"
          @click="addDataDialog = true"
        >
          <i class="el-icon-upload"></i>
          导入数据
        </el-button>
        <!-- 删除测试数据按钮 -->
        <el-button
          type="danger"
          icon="el-icon-delete"
          class="handle-del mr10"
          @click="delTestDataDialog = true"
          >删除测试数据</el-button
        >
      </div>

      <!-- 表格数据 -->
      <el-table
        :data="tableData.slice((currentPage - 1) * PageSize, currentPage * PageSize)"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        row-key="id"
      >
        <el-table-column label="日期" width="150px" align="center">
          <template slot-scope="scope">{{ scope.row.atime | dateFormat }}</template>
        </el-table-column>
        <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
        <!-- <el-table-column
          prop="parkinggate"
          label="停机位"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="boardinggate"
          label="登机口"
          align="center"
        ></el-table-column> -->
        <el-table-column prop="planenum" label="机号" align="center"></el-table-column>
        <el-table-column prop="mdl" label="机型" align="center"></el-table-column>
        <el-table-column
          prop="aflightnum"
          label="进港航班号"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="dflightnum"
          label="出港航班号"
          align="center"
        ></el-table-column>
        <el-table-column label="航线" align="center" show-overflow-tooltip>
          <template slot-scope="scope"
            >{{ scope.row.origin }} - {{ scope.row.destination }}</template
          >
        </el-table-column>
        <el-table-column prop="nation" label="国际/国内" align="center">
          <template slot-scope="scope">
            <!-- 1-国内 0-国际 -->
            <span v-if="scope.row.nation === 1">国内</span>
            <span v-if="scope.row.nation === 0">国际</span>
          </template>
        </el-table-column>
        <el-table-column prop="pass" label="是否过站" align="center">
          <template slot-scope="scope">
            <!--1表示过站，0表示未过站 -->
            <span v-if="scope.row.pass === 1">过站</span>
            <span v-if="scope.row.pass === 0">未过站</span>
          </template>
        </el-table-column>
        <el-table-column prop="paras" label="是否过夜" align="center">
          <template slot-scope="scope">
            <!--1表示过夜，0表示不过夜 -->
            <span v-if="scope.row.paras === 1">过夜</span>
            <span v-if="scope.row.paras === 0">不过夜</span>
          </template>
        </el-table-column>
        <el-table-column prop="business" label="是否公务" align="center">
          <template slot-scope="scope">
            <!--1表示公务，0表示非公务 -->
            <span v-if="scope.row.business === 1">公务</span>
            <span v-if="scope.row.business === 0">非公务</span>
          </template>
        </el-table-column>
        <el-table-column prop="isvip" label="是否vip" align="center">
          <template slot-scope="scope">
            <!--1表示vip航班，0表示非vip -->
            <span v-if="scope.row.isvip === 1">vip</span>
            <span v-if="scope.row.isvip === 0">非vip</span>
          </template>
        </el-table-column>
        <el-table-column label="进港时间" align="center">
          <template slot-scope="scope">{{ scope.row.atime | atimeFormat }}</template>
        </el-table-column>
        <el-table-column label="出港时间" align="center">
          <template slot-scope="scope">{{ scope.row.dtime | atimeFormat }}</template>
        </el-table-column>
      </el-table>
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
    </div>

    <!-- 添加仿真测试数据的对话框 -->
    <el-dialog
      title="添加仿真测试数据"
      :visible.sync="addTestDatadialog"
      width="40%"
      class="dialog"
    >
      <el-form
        :model="addTestDataForm"
        :rules="addTestDataRules"
        ref="addTestDataFormRef"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-form-item label="请输入测试数据的名称" prop="name">
          <el-input
            placeholder="请输入名称"
            v-model="addTestDataForm.name"
            clearable
            style="width: 220px"
          ></el-input>
        </el-form-item>
        <el-form-item label="请选择机场">
          <el-select v-model="addAirportname" placeholder="请选择机场">
            <el-option
              v-for="item in airportNameList"
              :key="item.id"
              :label="item.airportname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择日期">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="airDate"
            type="date"
            style="width: 220px"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="请选择时间">
          <el-time-select
            placeholder="起始时间"
            v-model="addTestDataForm.startTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '24:00',
            }"
            style="width: 200px"
          >
          </el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="addTestDataForm.endTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '24:00',
            }"
            style="width: 200px"
          >
          </el-time-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addTestDatadialogCancal">取消</el-button>
        <el-button type="primary" @click="addTestData">确认</el-button>
      </span>
    </el-dialog>

    <!-- 高级查询的对话框 -->
    <el-dialog title="高级查询" :visible.sync="selectAirDialog" width="40%">
      <el-form
        ref="selectAirFormRef"
        :inline="true"
        :model="selectAirForm"
        class="demo-form-inline"
      >
        <el-form-item label="航班号">
          <el-input
            v-model="selectAirForm.aflightnum"
            style="width: 200px"
            placeholder="请输入航班号"
          ></el-input>
        </el-form-item>
        <el-form-item label="机号">
          <el-input
            v-model="selectAirForm.planenum"
            placeholder="请输入机号"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="航班属性">
          <el-select v-model="selectAirForm.flightAttributes" placeholder="请选择">
            <el-option label="公务航班" value="GW"></el-option>
            <el-option label="国际航班" value="GJ"></el-option>
            <el-option label="VIP航班" value="VIP"></el-option>
            <el-option label="过站航班" value="GZ"></el-option>
            <el-option label="普通航班" value="PT"></el-option>
            <el-option label="过夜航班" value="GY"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国际/国内">
          <el-select v-model="selectAirForm.nation" placeholder="请选择">
            <el-option label="国际" value="0"></el-option>
            <el-option label="国内" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进港时间">
          <el-time-select
            placeholder="起始时间"
            v-model="selectAirForm.aStartTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '24:00',
            }"
            style="width: 200px"
          >
          </el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="selectAirForm.aEndTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '24:00',
            }"
            style="width: 200px"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="出港时间">
          <el-time-select
            placeholder="起始时间"
            v-model="selectAirForm.dStartTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '24:00',
            }"
            style="width: 200px"
          >
          </el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="selectAirForm.dEndTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '24:00',
            }"
            style="width: 200px"
          >
          </el-time-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="selectAir">查询</el-button>
        <el-button @click="selectAirCancel">重置</el-button>
      </span>
    </el-dialog>

    <!-- 删除某个测试数据的对话框 -->
    <el-dialog :visible.sync="delTestDataDialog" width="40%">
      <h2>确认删除吗？</h2>
      <span slot="footer">
        <el-button @click="delTestDataDialog = false">取消</el-button>
        <el-button type="primary" @click="delTestData">确定</el-button>
      </span>
    </el-dialog>

    <!-- 导入航班数据的对话框 -->
    <el-dialog title="请选择需要导入的文件" :visible.sync="addDataDialog" width="40%">
      <el-upload
        drag
        :file-list="uploadFiles"
        action="alert"
        :auto-upload="false"
        :on-change="loadJsonFromFile"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击导入</em>
        </div>
        <div class="el-upload__tip" slot="tip">请上传以.txt为后缀的json数据文件</div>
      </el-upload>
      <span slot="footer">
        <el-button @click="addDataDialog = false">取消</el-button>
        <el-button type="primary" @click="loadJsonFromFileConfirmed">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//导入请求数据方法
import {
  selectAirportName,
  selectTestDataName,
  selectTestData,
  selectAirportData,
  insertAirportData,
  // insertManualData,
  deleteTestData,
  // deleteManualData,
  saveAirportData,
  saveResultData,
} from "../common/axios/index";
// 导入js方法
import { selectTime, getNewtime, getMinMaxDate } from "../common/js/index";

export default {
  data() {
    return {
      // 角色和用户名---登录后获取
      rolen: window.sessionStorage.rolen,
      username: window.sessionStorage.usernamen,
      // vuex-中保存测试数据名称和机场名称
      // vuex_testDataName: "",
      // vuex_airportName: "",

      //测试数据选择器
      selectTestData: "",
      //测试数据文件名列表
      testDataNameList: [],
      //测试数据
      tableData: [],
      //备用测试数据
      subTableData: [],

      // 前端分页功能
      // 当前页，默认显示第1页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [10, 15, 20],
      // 默认每页显示的条数（可修改）
      PageSize: 10,

      //航班号筛选
      selectAirportNum: "",
      //高级筛选的对话框
      selectAirDialog: false,
      //高级查询的绑定表单
      selectAirForm: {
        aflightnum: "",
        planenum: "",
        flightAttributes: "",
        nation: "",
        aStartTime: "",
        aEndTime: "",
        dStartTime: "",
        dEndTime: "",
      },

      // 保存机场名称的列表
      airportNameList: [],
      // 控制添加测试数据对话框的显示，默认不显示
      addTestDatadialog: false,
      // 添加测试数据表单的绑定值
      addTestDataForm: {
        name: "",
        airportname: "",
        date: "",
        startTime: "",
        endTime: "",
      },
      //添加测试数据的机场
      addAirportname: "",
      // 以机场名称保存机场数据
      airportData: [],
      // 保存日期选择器的列表-即该机场有多少日期
      airDateList: [],
      //保存日期的绑定值
      airDate: "",
      // 时间可选范围
      pickerOptions: {},
      // 表单校验规则
      addTestDataRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },

      //删除测试数据对话框
      delTestDataDialog: false,

      //导入数据的对话框
      addDataDialog: false,
      // 上传的文件名
      uploadFilename: null,
      // 上传的文件列表
      uploadFiles: [],
    };
  },
  methods: {
    // 取消复选框选择的方法
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 获取复选框打勾的筛选数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 前端分页功能
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

    // 根据航班号筛选
    selectAirNum() {
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      let table = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].aflightnum.indexOf(this.selectAirportNum) != -1) {
          table.push(this.tableData[i]);
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    //重置筛选
    selectAirNumCancel() {
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
      this.selectAirportNum = "";
    },
    //高级筛选
    selectAir() {
      // console.log(this.selectAirForm);
      // console.log(this.tableData[2]);
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      //根据航班号、机位号、航班属性、国际国内查询
      let table = [];
      let table1 = [];
      let table2 = [];
      let table3 = [];
      let table4 = [];
      let table5 = [];
      let table6 = [];
      //根据航班号查询
      if (this.selectAirForm.aflightnum !== "") {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].aflightnum.indexOf(this.selectAirForm.aflightnum) != -1) {
            // console.log("llllll");
            table1.push(this.tableData[i]);
          }
        }
      } else {
        table1 = JSON.parse(JSON.stringify(this.tableData));
      }

      //根据机位号查询
      if (this.selectAirForm.planenum !== "") {
        for (let i = 0; i < table1.length; i++) {
          if (this.tableData[i].planenum.indexOf(this.selectAirForm.planenum) != -1) {
            // console.log("sss");
            table2.push(this.tableData[i]);
          }
        }
      } else {
        table2 = JSON.parse(JSON.stringify(table1));
      }

      //根据国际国内查询
      if (this.selectAirForm.nation !== "") {
        for (let i = 0; i < table2.length; i++) {
          if (
            this.tableData[i].nation.toString().indexOf(this.selectAirForm.nation) != -1
          ) {
            // console.log("kkk");
            table3.push(this.tableData[i]);
          }
        }
      } else {
        table3 = JSON.parse(JSON.stringify(table2));
      }

      // 根据进港时间筛选
      if ((this.selectAirForm.aStartTime !== "") & (this.selectAirForm.aEndTime !== "")) {
        // console.log("2222222222");
        for (let i = 0; i < table3.length; i++) {
          if (
            selectTime(
              this.tableData[i].atime,
              this.selectAirForm.aStartTime,
              this.selectAirForm.aEndTime
            )
          ) {
            table4.push(this.tableData[i]);
          }
        }
      } else if (
        (this.selectAirForm.aStartTime == "") &
        (this.selectAirForm.aEndTime !== "")
      ) {
        // console.log("2222222222");
        this.selectAirForm.aStartTime = "00:00";
        // console.log(this.selectAirForm.aStartTime);
        for (let i = 0; i < table3.length; i++) {
          if (
            selectTime(
              this.tableData[i].atime,
              this.selectAirForm.aStartTime,
              this.selectAirForm.aEndTime
            )
          ) {
            // console.log("kkkkk");
            table4.push(this.tableData[i]);
          }
        }
      } else if (
        (this.selectAirForm.aStartTime !== "") &
        (this.selectAirForm.aEndTime == "")
      ) {
        // console.log("2222222222");
        this.selectAirForm.aEndTime = "24:00";
        for (let i = 0; i < table3.length; i++) {
          if (
            selectTime(
              this.tableData[i].atime,
              this.selectAirForm.aStartTime,
              this.selectAirForm.aEndTime
            )
          ) {
            table4.push(this.tableData[i]);
          }
        }
      } else {
        table4 = JSON.parse(JSON.stringify(table3));
      }

      // 根据出港时间筛选
      if ((this.selectAirForm.dStartTime !== "") & (this.selectAirForm.dEndTime !== "")) {
        for (let i = 0; i < table4.length; i++) {
          if (
            selectTime(
              this.tableData[i].dtime,
              this.selectAirForm.dStartTime,
              this.selectAirForm.dEndTime
            )
          ) {
            table5.push(this.tableData[i]);
          }
        }
      } else if (
        (this.selectAirForm.dStartTime == "") &
        (this.selectAirForm.dEndTime !== "")
      ) {
        for (let i = 0; i < table4.length; i++) {
          if (selectTime(this.tableData[i].dtime, "00:00", this.selectAirForm.dEndTime)) {
            table5.push(this.tableData[i]);
          }
        }
      } else if (
        (this.selectAirForm.dStartTime !== "") &
        (this.selectAirForm.dEndTime == "")
      ) {
        for (let i = 0; i < table4.length; i++) {
          if (
            selectTime(this.tableData[i].dtime, this.selectAirForm.dStartTime, "24:00")
          ) {
            table5.push(this.tableData[i]);
          }
        }
      } else {
        table5 = JSON.parse(JSON.stringify(table4));
      }

      table = JSON.parse(JSON.stringify(table5));
      // console.log(table);
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
      //关闭对话框
      this.selectAirDialog = false;
      // 重置表单
      this.selectAirForm = {
        aflightnum: "",
        planenum: "",
        flightAttributes: "",
        nation: "",
        aStartTime: "",
        aEndTime: "",
        dStartTime: "",
        dEndTime: "",
      };
    },
    //高级筛选重置
    selectAirCancel() {
      this.selectAirForm = {
        aflightnum: "",
        planenum: "",
        flightAttributes: "",
        nation: "",
        aStartTime: "",
        aEndTime: "",
        dStartTime: "",
        dEndTime: "",
      };
      this.tableData = JSON.parse(JSON.stringify(this.subTableData));
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },

    // 添加测试数据
    addTestData() {
      // 重新给数据
      //判断各字段是否为空
      if (this.addTestDataForm.name === "") {
        this.$message({
          message: "请输入测试数据名称",
          type: "warning",
          offset: 300,
        });
      } else {
        if (this.addAirportname === "") {
          this.$message({
            message: "请选择机场",
            type: "warning",
            offset: 300,
          });
        } else {
          if (this.airDate === "") {
            this.$message({
              message: "请选择日期",
              type: "warning",
              offset: 300,
            });
          } else {
            if (
              (this.addTestDataForm.startTime === "") |
              (this.addTestDataForm.endTime === "")
            ) {
              this.$message({
                message: "请选择时间",
                type: "warning",
                offset: 300,
              });
            } else {
              // 判断文件名是否重复
              let checknamelist = [];
              if (this.testDataNameList.length != 0) {
                for (let i = 0; i < this.testDataNameList.length; i++) {
                  checknamelist.push(this.testDataNameList[i].filename);
                }
              }
              // 验证名称是否重复
              if (checknamelist.indexOf(this.addTestDataForm.name) != -1) {
                this.$message({
                  message: "数据名称重复！请更换！",
                  type: "error",
                  offset: 300,
                  center: true,
                });
              } else {
                // 表单验证通过以及文件名通过后保存数据
                //首先根据日期筛选数据
                let date = this.airDate.toString();
                let table = [];
                for (let i = 0; i < this.airportData.length; i++) {
                  if (this.airportData[i].atime.substring(0, 11).indexOf(date) != -1) {
                    if (
                      selectTime(
                        this.airportData[i].atime,
                        this.addTestDataForm.startTime,
                        this.addTestDataForm.endTime
                      )
                    ) {
                      // console.log('lll');
                      table.push(this.airportData[i]);
                    }
                  }
                }
                console.log(table);
                // 保存数据
                let newTestData = [];
                for (let i = 0; i < table.length; i++) {
                  let newdata = {
                    filename: this.addTestDataForm.name,
                    flightId: table[i].id,
                    userId: window.sessionStorage.usernamen,
                    updateTime: getNewtime(),
                  };
                  newTestData.push(newdata);
                }
                if (newTestData.length === 0) {
                  alert("该时间范围内没有数据！请重新选择!");
                } else {
                  insertAirportData(newTestData).then(() => {
                    //插入数据后更新列表
                    this.testDataNameList = [];
                    this.selectTestData = "";
                    let username = {
                      userId: this.username,
                    };
                    selectTestDataName(username)
                      .then((res) => {
                        // console.log(res.data);
                        for (let i = 0; i < res.data.length; i++) {
                          let onedata = {
                            id: i,
                            filename: res.data[i].filename,
                          };
                          this.testDataNameList.push(onedata);
                        }
                        const index = this.testDataNameList.findIndex((item) => {
                          if (item.filename == this.addTestDataForm.name) {
                            return true;
                          }
                        });
                        this.selectTestData = this.testDataNameList[index].id;
                      })
                      .then(() => {
                        //显示数据
                        let data = {
                          filename: this.addTestDataForm.name,
                          userId: this.username,
                        };
                        // console.log(data);
                        selectTestData(data)
                          .then((res) => {
                            this.tableData = JSON.parse(JSON.stringify(res.data));
                            this.subTableData = JSON.parse(
                              JSON.stringify(this.tableData)
                            );
                            this.totalCount = this.tableData.length;
                          })
                          .then(() => {
                            // 保存数据到结果表
                            let data = [];
                            for (let i = 0; i < this.tableData.length; i++) {
                              let newdata = {
                                filename: this.tableData[i].filename,
                                model: 0,
                                flightId: this.tableData[i].id,
                                allostate: 0,
                                parkinggate: "",
                                runnums: 0,
                                testtime: "",
                                userId: window.sessionStorage.usernamen,
                                updateTime: getNewtime(),
                              };
                              data.push(newdata);
                            }
                            console.log(data);
                            saveResultData(data);
                          })
                          .then(() => {
                            this.$message({
                              message: "测试数据保存成功！",
                              type: "success",
                              offset: 300,
                              center: true,
                              duration: 2000,
                            });
                          })
                          .then(() => {
                            //关闭对话框
                            this.addTestDatadialogCancal();
                          });
                      });
                  });
                }
              }
            }
          }
        }
      }
    },
    addTestDatadialogOpen() {
      this.airDate = "";
      this.addTestDatadialog = true;
    },
    // 添加测试数据表单的取消按钮
    addTestDatadialogCancal() {
      this.addTestDatadialog = false;
      // this.$refs.addTestDataFormRef.resetFields();
      //重置表单
      this.addTestDataForm = {
        name: "",
        airportname: "",
        date: "",
        startTime: "",
        endTime: "",
      };
      this.addAirportname = "";
    },

    // 删除测试数据
    delTestData() {
      // 删除数据
      const index = this.testDataNameList.findIndex((item) => {
        if (item.id == this.selectTestData) {
          return true;
        }
      });
      let data = {
        filename: this.testDataNameList[index].filename,
        userId: this.username,
      };
      deleteTestData(data)
        .then(() => {
          this.$message({
            message: "删除数据成功！",
            type: "success",
            offset: 0,
            center: true,
            duration: 3000,
          });
        })
        .then(() => {
          //删除数据后更新列表
          this.testDataNameList = [];
          this.selectTestData = "";
          let username = {
            userId: this.username,
          };
          selectTestDataName(username)
            .then((res) => {
              //console.log(res.data);
              for (let i = 0; i < res.data.length; i++) {
                let onedata = {
                  id: i,
                  filename: res.data[i].filename,
                };
                this.testDataNameList.push(onedata);
              }
            })
            .then(() => {
              //显示数据
              let data = {
                filename: this.addTestDataForm.name,
                userId: this.username,
              };
              // console.log(data);
              selectTestData(data)
                .then((res) => {
                  this.tableData = JSON.parse(JSON.stringify(res.data));
                  this.subTableData = JSON.parse(JSON.stringify(this.tableData));
                  this.totalCount = this.tableData.length;
                })
                .then(() => {
                  //关闭对话框
                  this.addTestDatadialogCancal();
                });
            });
        })
        .then(() => {
          this.delTestDataDialog = false;
          // 清除绑定的vuex的值
          this.$store.commit("del_testDataNameVuex");
          this.$store.commit("del_airportNameVuex");
          // console.log(this.$store.state.testDataNameVuex);
        });
    },
    // 监听文件列表
    loadJsonFromFile(file, fileList) {
      this.uploadFilename = file.name;
      this.uploadFiles = fileList;
    },
    //导入数据
    loadJsonFromFileConfirmed() {
      // 若选择了文件则继续
      if (this.uploadFiles) {
        // 循环读取每个文件
        for (let i = 0; i < this.uploadFiles.length; i++) {
          const file = this.uploadFiles[i];
          //   console.log(file.raw)
          // 若文件不为空则继续，否则跳出本次循环
          if (!file) continue;
          const reader = new FileReader();
          // onload-文件读取成功完成时触发
          reader.onload = async (f) => {
            try {
              // JSON.parse() 用于从一个 字符串 中解析出 json对象
              // 数据保存在f.target.result中
              // console.log(f)
              const document = JSON.parse(f.target.result);
              // 将读取的文件数据保存到uploadData中
              // console.log(document)
              // //将读取的数据添加到数据库表格中
              // this.database = this.database.concat(document);
              saveAirportData(document);
              // console.log(this.database);
              this.$message({
                message: "导入数据成功！",
                type: "success",
                offset: 300,
                center: true,
                duration: 3000,
              });
            } catch (err) {
              this.$message({
                message: "导入数据失败！",
                type: "error",
                offset: 300,
                center: true,
                duration: 3000,
              });
              //console.log(`load JSON document from file error: ${err.message}`);
            }
          };
          // 将文件读取为文本
          reader.readAsText(file.raw);
        }
      }
      // 上传成功后关闭对话框
      this.addDataDialog = false;
    },
  },
  watch: {
    selectTestData: function () {
      if (this.testDataNameList.length !== 0) {
        const index = this.testDataNameList.findIndex((item) => {
          if (item.id == this.selectTestData) {
            return true;
          }
        });
        let data = {
          filename: this.testDataNameList[index].filename,
          userId: this.username,
        };
        // console.log(data);
        selectTestData(data)
          .then((res) => {
            this.tableData = JSON.parse(JSON.stringify(res.data));
            this.subTableData = JSON.parse(JSON.stringify(this.tableData));
            this.totalCount = this.tableData.length;
          })
          .then(() => {
            //将监听到的测试数据名称保存在vuex中
            // console.log(this.testDataNameList[index].filename);
            this.$store.commit(
              "set_testDataNameVuex",
              this.testDataNameList[index].filename
            );
            //将监听到的机场名称保存在vuex中
            this.$store.commit("set_airportNameVuex", this.tableData[0].airportname);
            // console.log(this.$store.state.airportNameVuex);
          });
      }
    },
    // 监听选择器中的机场名称-然后渲染日期选择器
    addAirportname: function () {
      this.airDate = "";
      this.airportData = [];
      const index = this.airportNameList.findIndex((item) => {
        if (item.id == this.addAirportname) {
          return true;
        }
      });
      let data = {
        airportname: this.airportNameList[index].airportname,
      };
      selectAirportData(data)
        .then((res) => {
          // 保存机场数据
          this.airportData = JSON.parse(JSON.stringify(res.data));
        })
        .then(() => {
          // 渲染日期选择器
          let dateList = [];
          //封装日期的列表-显示在选择器中
          for (let i = 0; i < this.airportData.length; i++) {
            let date = this.airportData[i].atime.substring(0, 11);
            // 转为日期
            dateList.push(new Date(date));
          }
          //minMaxDate保存了最小最大日期
          let minMaxDate = getMinMaxDate(dateList);
          let min = minMaxDate[0];
          this.airDate = min;
          this.pickerOptions = {
            disabledDate(time) {
              return time.getTime() < minMaxDate[0] || time.getTime() > minMaxDate[1];
            },
          };
        });
    },
  },
  created() {
    //登录后请求数据
    // 请求机场名称列表
    selectAirportName().then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        let onedata = {
          id: i,
          airportname: res.data[i].airportname,
        };
        this.airportNameList.push(onedata);
      }
    });
    // 请求该用户的机场数据-并封装测试航班数据选择器
    let username = {
      userId: this.username,
    };
    selectTestDataName(username)
      .then((res) => {
        // console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          let onedata = {
            id: i,
            filename: res.data[i].filename,
          };
          this.testDataNameList.push(onedata);
        }
      })
      .then(() => {
        // 进入页面后，vuex中判断是否有测试数据名称--有的话，赋值
        if (this.$store.state.testDataNameVuex !== "") {
          let name = this.$store.state.testDataNameVuex;
          //查找索引
          const index = this.testDataNameList.findIndex((item) => {
            if (item.filename == name) {
              return true;
            }
          });
          // 赋值给测试数据选择器-这样就可以显示数据来
          this.selectTestData = this.testDataNameList[index].id;
        }
      });
  },
};
</script>

<style lang="scss" scoped>
.handle-box {
  margin-bottom: 20px;
  .selectData {
    font-size: inherit;
    // color: gray;
  }
  .selectData2 {
    font-size: inherit;
    margin-left: 20px;
    // color: gray;
  }
  .handle-select {
    width: 150px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .btu-left-right {
    margin-left: 10px;
  }
}
.pagination {
  margin-top: 20px;
}
.el-form {
  .el-input {
    width: 50%;
  }
}
</style>

<style scoped>
 .dialog .el-dialog__body {
  padding: 10px 20px;
}

</style>
