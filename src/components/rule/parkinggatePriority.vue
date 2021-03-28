<template>
  <div>
    <!-- 面包屑---显示当前页面的路径，快速返回之前的任意页面-->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-setting"></i> 规则库
        </el-breadcrumb-item>
        <el-breadcrumb-item>机位资源优先级配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <!-- 训练数据选择器 -->
        <span class="selectData">航班类型:</span>
        <el-select
          class="handle-select"
          v-model="selectType"
          placeholder="请选择航班类型"
        >
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.flighttype"
            :value="item.id"
          >
          </el-option>
        </el-select>

        <!-- 查询按钮 -->
        <el-button
          type="primary"
          class="handle-del mr10"
          icon="el-icon-s-tools"
          @click="openPrioritySettingDialog"
          >配置机位优先级</el-button
        >
      </div>
      <!-- 表格数据 -->
      <el-table
        :data="
          tableData.slice((currentPage - 1) * PageSize, currentPage * PageSize)
        "
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        row-key="id"
      >
        <el-table-column
          prop="airportname"
          label="机场名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="flighttype"
          label="航班类型名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="flightkey"
          label="航班类型Key"
          align="center"
        ></el-table-column>
        <el-table-column
          v-if="this.temp == 1"
          prop="stoptimeless"
          label="停靠时间小于"
          align="center"
        ></el-table-column>
        <el-table-column
          v-if="this.temp == 1"
          prop="stoptimemore"
          label="停靠时间大于"
          align="center"
        ></el-table-column>
        <el-table-column
          v-if="this.temp == 2"
          prop="atimeless"
          label="进港时间小于"
          align="center"
        ></el-table-column>
        <el-table-column
          v-if="this.temp == 2"
          prop="atimemore"
          label="进港时间大于"
          align="center"
        ></el-table-column
        ><el-table-column
          v-if="this.temp == 2"
          prop="dtimeless"
          label="出港时间小于"
          align="center"
        ></el-table-column>
        <el-table-column
          v-if="this.temp == 2"
          prop="dtimemore"
          label="出港时间大于"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="parkinggate"
          label="机位"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="priority"
          label="优先级"
          align="center"
        ></el-table-column>
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

    <!-- 修改配置信息的对话框 -->
    <el-dialog
      :visible.sync="prioritySettingDialog"
      width="70%"
      title="航班分配顺序配置"
      class="dialog"
    >
      <span class="selectData">航班类型:</span>
      <el-select
        class="handle-select"
        v-model="selectTypeSetting"
        placeholder="请选择航班类型"
      >
        <el-option
          v-for="item in typeListSetting"
          :key="item.id"
          :label="item.flighttype"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span class="selectData">模板类型:</span>
      <el-select v-model="temp" placeholder="请选择">
        <el-option
          v-for="item in tempList"
          :key="item.id"
          :label="item.tempName"
          :value="item.id"
        ></el-option>
      </el-select>
      <!-- 添加按钮 -->
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        class="handle-del mr10"
        @click="addSettintData"
        >新增</el-button
      >
      <div class="tempContent">
        <div class="tempTable">
          <transition-group appear tag="div">
            <div class="tr1" v-for="items in settingTableData" :key="items.id">
              <span>机位:</span>
              <el-select
                style="width: 100px"
                v-model="items.parkinggate"
                placeholder="请选择机位"
              >
                <el-option
                  v-for="item in parkingGateList"
                  :key="item.id"
                  :label="item.parkinggate"
                  :value="item.id"
                ></el-option>
              </el-select>
              <span>优先级:</span>
              <el-select
                style="width: 100px"
                v-model="items.priority"
                placeholder="请选择优先级"
              >
                <el-option
                  v-for="item in priorityList"
                  :key="item.id"
                  :label="item.priority"
                  :value="item.id"
                ></el-option>
              </el-select>
              <span v-if="temp == 1">停靠时间小于:</span>
              <el-input
                v-if="temp == 1"
                v-model="items.stoptimeless"
                clearable
                style="width: 100px"
              ></el-input>
              <span v-if="temp == 1">停靠时间大于:</span>
              <el-input
                v-if="temp == 1"
                v-model="items.stoptimemore"
                clearable
                style="width: 100px"
              ></el-input>
              <span v-if="temp == 2">进港时间小于:</span>
              <el-input
                v-if="temp == 2"
                v-model="items.atimeless"
                clearable
                style="width: 100px"
              ></el-input>
              <span v-if="temp == 2">进港时间大于:</span>
              <el-input
                v-if="temp == 2"
                v-model="items.atimemore"
                clearable
                style="width: 100px"
              ></el-input>
              <span v-if="temp == 2">出港时间小于:</span>
              <el-input
                v-if="temp == 2"
                v-model="items.dtimeless"
                clearable
                style="width: 100px"
              ></el-input>
              <span v-if="temp == 2">出港时间大于:</span>
              <el-input
                v-if="temp == 2"
                v-model="items.dtimemore"
                clearable
                style="width: 100px"
              ></el-input>
              <el-button
                type="danger"
                icon="el-icon-delete"
                class="handle-del mr10"
                @click="delSettintData(items.id)"
                >删除</el-button
              >
            </div>
          </transition-group>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="prioritySettingCancel">取消</el-button>
        <el-button type="primary" @click="prioritySettingConfirm"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
//导入请求数据的方法
import {
  selectTypes,
  selectByAirportnameAndUserIdAndType,
  selectParkinggate,
  deleteByType,
  insertData,
} from "../common/axios/index";
// 导入js方法
import { getNewtime } from "../common/js/index";
export default {
  data() {
    return {
      //航班类型
      selectType: "",
      //航班类型列表
      typeList: [
        // {
        //   id: 0,
        //   flighttype: "公务航班",
        //   flightkey: "GW",
        // },
        // {
        //   id: 1,
        //   flighttype: "国际航班",
        //   flightkey: "GJ",
        // },
        // {
        //   id: 2,
        //   flighttype: "VIP航班",
        //   flightkey: "VIP",
        // },
        // {
        //   id: 3,
        //   flighttype: "过站航班",
        //   flightkey: "GZ",
        // },
        // {
        //   id: 4,
        //   flighttype: "普通航班",
        //   flightkey: "PT",
        // },
        // {
        //   id: 5,
        //   flighttype: "过夜航班",
        //   flightkey: "GY",
        // },
      ],
      //配置数据
      tableData: [],
      //备用配置数据
      subTableData: [],
      //模板号
      temp: 0,

      // 前端分页功能
      // 当前页，默认显示第1页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [10, 15, 20],
      // 默认每页显示的条数（可修改）
      PageSize: 10,

      //控制配置信息的对话框
      prioritySettingDialog: false,
      //模板选择器
      tempList: [
        {
          id: 0,
          tempName: "不划分",
        },
        {
          id: 1,
          tempName: "根据停靠时间划分",
        },
        {
          id: 2,
          tempName: "根据进出港时间划分",
        },
      ],

      //配置表的选择器
      selectTypeSetting: 0,
      typeListSetting: [
        {
          id: 0,
          flighttype: "公务航班",
          flightkey: "GW",
        },
        {
          id: 1,
          flighttype: "国际航班",
          flightkey: "GJ",
        },
        {
          id: 2,
          flighttype: "VIP航班",
          flightkey: "VIP",
        },
        {
          id: 3,
          flighttype: "过站航班",
          flightkey: "GZ",
        },
        {
          id: 4,
          flighttype: "普通航班",
          flightkey: "PT",
        },
        {
          id: 5,
          flighttype: "过夜航班",
          flightkey: "GY",
        },
      ],
      //配置的table数据
      settingTableData: [],
      //配置的table数据备用数据
      subSettingTableData: [],
      //监听机位选择器的值
      parkingGate: 0,
      // 机位选择器渲染列表
      parkingGateList: [],
      //优先级列表
      priorityList: [],
      //保存删除的数据
      delSettingData: [],
      //保存新增的数据
      addSettingData: [],
      //保存更新的数据
      UpdateSettingData: [],
    };
  },
  methods: {
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

    //打开配置对话框
    openPrioritySettingDialog() {
      this.settingTableData = JSON.parse(JSON.stringify(this.tableData));
      this.prioritySettingDialog = true;
    },
    //取消配置按钮
    prioritySettingCancel() {
      this.prioritySettingDialog = false;
      // 重新赋值一下
      this.tableData = JSON.parse(JSON.stringify(this.subTableData))
    },
    //确认配置
    prioritySettingConfirm() {
      //首先删除需要删除的数据
      //根据groupid、航班类型、机场名称、用户名删除数据
      // console.log(this.delSettingData);
      // 如果进行了删除数据操作
      // if (this.delSettingData.length != 0) {
      //   //封装数据
      //   let delDataList = [];
      //   for (let i = 0; i < this.delSettingData.length; i++) {
      //     let deldata = {
      //       airportname: this.$store.state.airportNameVuex,
      //       groupid: this.delSettingData[i].groupid,
      //       flighttype: this.delSettingData[0].flighttype,
      //       userId: window.sessionStorage.usernamen,
      //     };
      //     delDataList.push(deldata);
      //   }
      //   // console.log(delDataList);
      //   //删除数据
      //   deleteParkinggate(delDataList);
      // }
      //新增和更新数据
      // for (let i = 0; i < this.subSettingTableData.length; i++) {
      //   let id = this.subSettingTableData[i].id;
      //   for (let j = 0; j < this.tableData.length; j++) {
      //     //更新的id
      //     if (this.tableData[j].id == id) {
      //       //判断是否更细了数据
      //       if (this.temp == 0) {
      //         //如果是不划分模板
      //         if (
      //           (this.subSettingTableData[i].parkinggate !=
      //             this.tableData[j].parkinggate) |
      //           (this.subSettingTableData[i].priority !=
      //             this.tableData[j].priority)
      //         ) {
      //           //封装数据

      //         }
      //       }
      //     }
      //   }
      // }

      //首先删除数据
      //根据航班类型、机场名称、用户名删除数据
      //查找索引
      const index = this.typeListSetting.findIndex((item) => {
        if (item.id == this.selectTypeSetting) {
          return true;
        }
      });
      //封装请求数据
      let data = {
        airportname: this.$store.state.airportNameVuex,
        flighttype: this.typeListSetting[index].flighttype,
        userId: window.sessionStorage.usernamen,
      };

      // 1删除数据时，判断一下是否删除掉了所有数据
      // 1-1 删除完了
      if (this.subSettingTableData.length === 0) {
        // 删除数据
        deleteByType(data).then(() => {
          // 首先重新请求航班类型选择器--渲染航班类型选择器
          let airportname = {
            airportname: this.$store.state.airportNameVuex,
            userId: window.sessionStorage.usernamen,
          };
          selectTypes(airportname).then((res) => {
            this.typeList = [];
            //渲染选择器
            for (let i = 0; i < res.data.length; i++) {
              let onedata = {
                id: i,
                flighttype: res.data[i].flighttype,
              };
              this.typeList.push(onedata);
            }
            // console.log(this.typeList);
            // 清空选择器和列表
            this.selectType = "";
            this.tableData = [];
            this.totalCount = 0
            this.prioritySettingDialog = false;
          });
        });
      } else {
        // 1-2 数据没有删除完
        //删除数据
        deleteByType(data).then(() => {
          //插入数据
          let dataList = [];
          // 封装数据
          if (this.subSettingTableData[0].template == 0) {
            //模板-不划分
            for (let i = 0; i < this.subSettingTableData.length; i++) {
              let data1 = {
                airportname: this.subSettingTableData[i].airportname,
                groupid: i,
                flighttype: this.subSettingTableData[i].flighttype,
                flightkey: this.subSettingTableData[i].flightkey,
                template: this.subSettingTableData[i].template,
                businesskey: 0,
                businessvalue: this.subSettingTableData[i].parkinggate,
                userId: window.sessionStorage.usernamen,
                updateTime: getNewtime(),
              };
              let data2 = {
                airportname: this.subSettingTableData[i].airportname,
                groupid: i,
                flighttype: this.subSettingTableData[i].flighttype,
                flightkey: this.subSettingTableData[i].flightkey,
                template: this.subSettingTableData[i].template,
                businesskey: 1,
                businessvalue: this.subSettingTableData[i].priority,
                userId: window.sessionStorage.usernamen,
                updateTime: getNewtime(),
              };
              dataList.push(data1);
              dataList.push(data2);
            }
            // console.log(dataList);
          }
          if (this.subSettingTableData[0].template == 1) {
            //模板 - 停靠时间
            for (let i = 0; i < this.subSettingTableData.length; i++) {
              let data1 = {
                airportname: this.subSettingTableData[i].airportname,
                groupid: i,
                flighttype: this.subSettingTableData[i].flighttype,
                flightkey: this.subSettingTableData[i].flightkey,
                template: this.subSettingTableData[i].template,
                businesskey: 0,
                businessvalue: this.subSettingTableData[i].parkinggate,
                userId: window.sessionStorage.usernamen,
                updateTime: getNewtime(),
              };
              let data2 = {
                airportname: this.subSettingTableData[i].airportname,
                groupid: i,
                flighttype: this.subSettingTableData[i].flighttype,
                flightkey: this.subSettingTableData[i].flightkey,
                template: this.subSettingTableData[i].template,
                businesskey: 1,
                businessvalue: this.subSettingTableData[i].priority,
                userId: window.sessionStorage.usernamen,
                updateTime: getNewtime(),
              };
              let data3 = {
                airportname: this.subSettingTableData[i].airportname,
                groupid: i,
                flighttype: this.subSettingTableData[i].flighttype,
                flightkey: this.subSettingTableData[i].flightkey,
                template: this.subSettingTableData[i].template,
                businesskey: 6,
                businessvalue: this.subSettingTableData[i].stoptimeless,
                userId: window.sessionStorage.usernamen,
                updateTime: getNewtime(),
              };
              let data4 = {
                airportname: this.subSettingTableData[i].airportname,
                groupid: i,
                flighttype: this.subSettingTableData[i].flighttype,
                flightkey: this.subSettingTableData[i].flightkey,
                template: this.subSettingTableData[i].template,
                businesskey: 7,
                businessvalue: this.subSettingTableData[i].stoptimemore,
                userId: window.sessionStorage.usernamen,
                updateTime: getNewtime(),
              };
              dataList.push(data1);
              dataList.push(data2);
              dataList.push(data3);
              dataList.push(data4);
            }
          }
          if (this.subSettingTableData[0].template == 2) {
            //模板-进港时间
            for (let i = 0; i < this.subSettingTableData.length; i++) {
              let data1 = {
                airportname: this.subSettingTableData[i].airportname,
                groupid: i,
                flighttype: this.subSettingTableData[i].flighttype,
                flightkey: this.subSettingTableData[i].flightkey,
                template: this.subSettingTableData[i].template,
                businesskey: 0,
                businessvalue: this.subSettingTableData[i].parkinggate,
                userId: window.sessionStorage.usernamen,
                updateTime: getNewtime(),
              };
              let data2 = {
                airportname: this.subSettingTableData[i].airportname,
                groupid: i,
                flighttype: this.subSettingTableData[i].flighttype,
                flightkey: this.subSettingTableData[i].flightkey,
                template: this.subSettingTableData[i].template,
                businesskey: 1,
                businessvalue: this.subSettingTableData[i].priority,
                userId: window.sessionStorage.usernamen,
                updateTime: getNewtime(),
              };
              let data3 = {
                airportname: this.subSettingTableData[i].airportname,
                groupid: i,
                flighttype: this.subSettingTableData[i].flighttype,
                flightkey: this.subSettingTableData[i].flightkey,
                template: this.subSettingTableData[i].template,
                businesskey: 2,
                businessvalue: this.subSettingTableData[i].atimeless,
                userId: window.sessionStorage.usernamen,
                updateTime: getNewtime(),
              };
              let data4 = {
                airportname: this.subSettingTableData[i].airportname,
                groupid: i,
                flighttype: this.subSettingTableData[i].flighttype,
                flightkey: this.subSettingTableData[i].flightkey,
                template: this.subSettingTableData[i].template,
                businesskey: 3,
                businessvalue: this.subSettingTableData[i].atimemore,
                userId: window.sessionStorage.usernamen,
                updateTime: getNewtime(),
              };
              let data5 = {
                airportname: this.subSettingTableData[i].airportname,
                groupid: i,
                flighttype: this.subSettingTableData[i].flighttype,
                flightkey: this.subSettingTableData[i].flightkey,
                template: this.subSettingTableData[i].template,
                businesskey: 4,
                businessvalue: this.subSettingTableData[i].dtimeless,
                userId: window.sessionStorage.usernamen,
                updateTime: getNewtime(),
              };
              let data6 = {
                airportname: this.subSettingTableData[i].airportname,
                groupid: i,
                flighttype: this.subSettingTableData[i].flighttype,
                flightkey: this.subSettingTableData[i].flightkey,
                template: this.subSettingTableData[i].template,
                businesskey: 5,
                businessvalue: this.subSettingTableData[i].dtimemore,
                userId: window.sessionStorage.usernamen,
                updateTime: getNewtime(),
              };
              dataList.push(data1);
              dataList.push(data2);
              dataList.push(data3);
              dataList.push(data4);
              dataList.push(data5);
              dataList.push(data6);
            }
          }
          // console.log(dataList);
          //插入数据
          insertData(dataList).then(() => {
            // 更新数据
            // 首先重新请求航班类型选择器--渲染航班类型选择器
            let airportname = {
              airportname: this.$store.state.airportNameVuex,
              userId: window.sessionStorage.usernamen,
            };
            selectTypes(airportname).then((res) => {
              this.typeList = [];
              //渲染选择器
              for (let i = 0; i < res.data.length; i++) {
                let onedata = {
                  id: i,
                  flighttype: res.data[i].flighttype,
                };
                this.typeList.push(onedata);
              }
              // console.log(this.typeList);
              //查找索引
              const index = this.typeList.findIndex((item) => {
                if (
                  item.flighttype ==
                  this.typeListSetting[this.selectTypeSetting].flighttype
                ) {
                  return true;
                }
              });
              this.selectType = this.typeList[index].id;
              //重新封装请求数据
              let data = {
                airportname: this.$store.state.airportNameVuex,
                flighttype: this.typeList[index].flighttype,
                userId: window.sessionStorage.usernamen,
              };
              // console.log(data);
              //重新请求数据
              selectByAirportnameAndUserIdAndType(data).then((res) => {
                this.subSettingTableData = [];
                this.tableData = JSON.parse(JSON.stringify(res.data));
                this.totalCount = this.tableData.length;
                this.subTableData = JSON.parse(JSON.stringify(this.tableData));
                this.settingTableData = JSON.parse(
                  JSON.stringify(this.tableData)
                );
                // console.log(this.settingTableData);
                this.temp = this.subTableData[0].template;
                // 关闭对话框
                this.prioritySettingDialog = false;
              });
            });
          });
        });
      }
    },
    //删除一条配置数据
    delSettintData(id) {
      this.delSettingData = [];
      const index = this.settingTableData.findIndex((item) => {
        if (item.id == id) {
          return true;
        }
      });
      this.delSettingData.push(this.settingTableData[index]);
      this.settingTableData.splice(index, 1);
      // console.log(this.delSettingData);
      // console.log(this.settingTableData);
    },
    //新增一条配置数据
    addSettintData() {
      //先判断有没有数据
      if (this.tableData.length === 0) {
        // this.settingTableData = [];
        //先算出最大的id
        let idList = [];
        let maxId = 0;
        if (this.settingTableData.length != 0) {
          for (let i = 0; i < this.settingTableData.length; i++) {
            idList.push(this.settingTableData[i].id);
          }
          maxId = Math.max.apply(null, idList) + 1;
        }
        //查找索引
        const index = this.typeListSetting.findIndex((item) => {
          if (item.id == this.selectTypeSetting) {
            return true;
          }
        });
        let newData = {
          id: maxId,
          airportname: this.$store.state.airportNameVuex,
          flighttype: this.typeListSetting[index].flighttype,
          flightkey: this.typeListSetting[index].flightkey,
          template: this.temp,
          parkinggate: 0,
          priority: 0,
          stoptimeless: "",
          stoptimemore: "",
          atimeless: "",
          atimemore: "",
          dtimeless: "",
          dtimemore: "",
        };
        // console.log(newData);
        this.settingTableData.push(newData);
      }
      if (this.tableData.length !== 0) {
        //先算出最大的id
        let idList = [];
        let maxId = 0;
        if (this.settingTableData.length != 0) {
          for (let i = 0; i < this.settingTableData.length; i++) {
            idList.push(this.settingTableData[i].id);
          }
          maxId = Math.max.apply(null, idList) + 1;
        }
        // console.log(maxId);
        let newData = {
          id: maxId,
          airportname: this.tableData[0].airportname,
          flighttype: this.tableData[0].flighttype,
          flightkey: this.tableData[0].flightkey,
          template: this.tableData[0].template,
          parkinggate: 0,
          priority: 0,
          stoptimeless: "",
          stoptimemore: "",
          atimeless: "",
          atimemore: "",
          dtimeless: "",
          dtimemore: "",
        };
        this.settingTableData.push(newData);
      }
    },
  },
  watch: {
    //监听航班类型选择器的值-更改后请求数据
    selectType: function () {
      if (this.selectType !== "") {
        //查找索引
        const index = this.typeList.findIndex((item) => {
          if (item.id == this.selectType) {
            return true;
          }
        });
        //查找配置内的索引
        const indexSetting = this.typeListSetting.findIndex((item) => {
          if (item.flighttype == this.typeList[index].flighttype) {
            return true;
          }
        });
        this.selectTypeSetting = indexSetting;

        //封装请求数据
        let data = {
          airportname: this.$store.state.airportNameVuex,
          flighttype: this.typeList[index].flighttype,
          userId: window.sessionStorage.usernamen,
        };
        // console.log(data);
        //请求数据
        selectByAirportnameAndUserIdAndType(data).then((res) => {
          // console.log(res.data);
          this.tableData = JSON.parse(JSON.stringify(res.data));
          this.totalCount = this.tableData.length;
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
          this.settingTableData = JSON.parse(JSON.stringify(this.tableData));
          this.subSettingTableData = JSON.parse(
            JSON.stringify(this.settingTableData)
          );
          // console.log(this.settingTableData);
          this.temp = this.subTableData[0].template;
        });
      }
    },
    //监听航班类型配置选择器的值-更改后请求数据
    selectTypeSetting: function () {
      //查找索引
      const index = this.typeListSetting.findIndex((item) => {
        if (item.id == this.selectTypeSetting) {
          return true;
        }
      });

      //查找航班类型的索引
      const indexType = this.typeList.findIndex((item) => {
        if (item.flighttype == this.typeListSetting[index].flighttype) {
          return true;
        }
      });
      //如果数据库有该类型的数据
      if (indexType !== -1) {
        this.selectType = this.typeList[indexType].id;
        //封装请求数据
        let data = {
          airportname: this.$store.state.airportNameVuex,
          flighttype: this.typeListSetting[index].flighttype,
          userId: window.sessionStorage.usernamen,
        };
        // console.log(data);
        // 请求数据
        selectByAirportnameAndUserIdAndType(data).then((res) => {
          // console.log(res.data);
          this.tableData = JSON.parse(JSON.stringify(res.data));
          this.totalCount = this.tableData.length;
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
          this.settingTableData = JSON.parse(JSON.stringify(res.data));
          this.temp = res.data[0].template;
        });
      } else {
        // 如果没有，清空列表
        this.tableData = []
        // this.subTableData = []
        this.totalCount = 0
        this.settingTableData = [];
        this.subSettingTableData = []
        this.temp = 0;
      }
    },
    settingTableData: {
      //监听新旧值
      handler(newVal, oldVal) {
        this.subSettingTableData = JSON.parse(JSON.stringify(newVal));
        // console.log("lllllllllllllll");
        // console.log(this.subSettingTableData);
      },
      deep: true,
    },
    // 监听模板类型--改变时数据也改变
    temp: function () {
      let dataList = [];
      for (let i = 0; i < this.settingTableData.length; i++) {
        let oneData = {
          airportname: this.settingTableData[i].airportname,
          atimeless: "",
          atimemore: "",
          dtimeless: "",
          dtimemore: "",
          flightkey: this.settingTableData[i].flightkey,
          flighttype: this.settingTableData[i].flighttype,
          id: this.settingTableData[i].id,
          parkinggate: this.settingTableData[i].parkinggate,
          priority: this.settingTableData[i].priority,
          stoptimeless: "",
          stoptimemore: "",
          template: this.temp,
        };
        dataList.push(oneData);
      }
      this.settingTableData = JSON.parse(JSON.stringify(dataList));
      // console.log(this.settingTableData);
    },
  },
  created() {
    //请求航班类型-渲染航班类型选择器
    let airportname = {
      airportname: this.$store.state.airportNameVuex,
      userId: window.sessionStorage.usernamen,
    };
    selectTypes(airportname).then((res) => {
      this.typeList = [];
      //渲染选择器
      for (let i = 0; i < res.data.length; i++) {
        let onedata = {
          id: i,
          flighttype: res.data[i].flighttype,
        };
        this.typeList.push(onedata);
      }
      // console.log(this.typeList);
    });

    //请求机位号数据
    let air = {
      airportname: this.$store.state.airportNameVuex,
    };
    selectParkinggate(air).then((res) => {
      this.parkingGateList = [];
      //  console.log(res);
      this.parkingGateList = JSON.parse(JSON.stringify(res.data));
      let num = this.parkingGateList.length;
      for (let i = 0; i < num; i++) {
        let one = {
          id: i + 1,
          priority: i + 1,
        };
        this.priorityList.push(one);
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
  .handle-select {
    width: 150px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .btu-left-right {
    margin-left: 10px;
  }
  .pagination {
    margin-top: 20px;
  }
}
.mr10 {
  margin-left: 20px;
}
.tempContent {
  display: flex;
  margin-top: 10px;
  width: 100%;
  max-height: 400px;
  border: gray solid 1px;
  overflow: auto;
  box-shadow: 1px 1px 1px 1px gray inset;
  .tempTable {
    width: 100%;
    .tr1 {
      margin: 10px 10px 10px 10px;
      border: lightgray solid 1px;
      min-height: 40px;
      display: flex;
      justify-content: left;
      align-items: center;
      margin-bottom: 10px;
      box-shadow: 1px 1px 1px 1px gray;
      span {
        margin-left: 15px;
      }
    }
  }
}
.el-form {
  .el-input {
    width: 50%;
  }
}
</style>

<style>
.dialog .el-dialog__body {
  padding: 10px 20px;
}
</style>
