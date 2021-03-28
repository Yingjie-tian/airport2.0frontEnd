<template>
  <div>
    <!-- 面包屑---显示当前页面的路径，快速返回之前的任意页面-->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-setting"></i> 规则库
        </el-breadcrumb-item>
        <el-breadcrumb-item>航班任务优先级配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <!-- 查询按钮 -->
        <el-button
          type="primary"
          class="handle-del"
          icon="el-icon-s-tools"
          @click="openPrioritySettingDialog"
          >航班优先级配置</el-button
        >
      </div>
      <!-- 表格数据 -->
      <el-table
        :data="tableData"
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        style="width: 80%"
      >
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
        <el-table-column prop="sortrule" label="排序规则" align="center">
          <template slot-scope="scope">
            <span style="color: #67c23a" v-if="scope.row.sortrule === 0"
              >按出港时间递增</span
            >
            <span style="color: #e6a23c" v-if="scope.row.sortrule === 1"
              >按出港时间递减</span
            >
            <span style="color: #f56c6c" v-if="scope.row.sortrule === 2"
              >按进港时间递增</span
            >
            <span style="color: #409eff" v-if="scope.row.sortrule === 3"
              >按进港时间递减</span
            >
          </template>
        </el-table-column>
        <el-table-column label="修改" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              @click="getRule(scope.row)"
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <div class="pagination">
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
      </div> -->
    </div>

    <!--修改排序规则的对话框 -->
    <el-dialog :visible.sync="changeRuleDialog" width="50%" top="30vh">
      <el-radio-group v-model="radioRule">
        <el-radio :label="0">按出港时间递增</el-radio>
        <el-radio :label="1">按出港时间递减</el-radio>
        <el-radio :label="2">按进港时间递增</el-radio>
        <el-radio :label="3">按进港时间递减</el-radio>
      </el-radio-group>
      <span slot="footer">
        <el-button @click="changeRuleDialog = false">取消</el-button>
        <el-button type="primary" @click="changeRule">确定</el-button>
      </span>
    </el-dialog>

    <!-- 航班优先级配置的对话框 -->
    <el-dialog :visible.sync="prioritySettingDialog" width="30%">
      <div class="drag-box-item">
        <div class="item-title">航班分配顺序配置</div>
        <draggable v-model="dragTableData" :options="dragOptions">
          <transition-group tag="div" id="dragTableData" class="item-ul">
            <div
              v-for="item in dragTableData"
              class="drag-list"
              :key="item.prioritynum"
            >
              {{ item.flighttype }}
            </div>
          </transition-group>
        </draggable>
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
import draggable from "vuedraggable";
// 导入请求数据方法
import {
  selectFlightPriorityData,
  updateRuleById,
  deleteFlightPriorityData,
  insertFlightPriorityData,
} from "../common/axios/index";
// 导入js方法
import { getNewtime } from "../common/js/index";
export default {
  data() {
    return {
      //航班优先级配置数据表
      tableData: [],
      //备用数据
      subTableData: [],

      // // 前端分页功能
      // // 当前页，默认显示第1页
      // currentPage: 1,
      // // 总条数，根据接口获取数据长度(注意：这里不能为空)
      // totalCount: 0,
      // // 个数选择器（可修改）
      // pageSizes: [6, 10, 20],
      // // 默认每页显示的条数（可修改）
      // PageSize: 6,

      // 保存点击的类型
      clickRule: {},
      // 修改排序规则的对话框
      changeRuleDialog: false,
      //排序规则选择器的绑定值
      radioRule: 0,

      //航班优先级配置对话框
      prioritySettingDialog: false,

      // 拖拽
      dragOptions: {
        animation: 120,
        scroll: true,
        group: "sortlist",
        ghostClass: "ghost-style",
      },
      //拖拽渲染数据
      dragTableData: [],
      //默认拖拽绑定数据
      dragData: [
        {
          prioritynum: 1,
          flighttype: "公务航班",
          flightkey: "GW",
        },
        {
          prioritynum: 2,
          flighttype: "国际航班",
          flightkey: "GJ",
        },
        {
          prioritynum: 3,
          flighttype: "VIP航班",
          flightkey: "VIP",
        },
        {
          prioritynum: 4,
          flighttype: "过站航班",
          flightkey: "GZ",
        },
        {
          prioritynum: 5,
          flighttype: "普通航班",
          flightkey: "PT",
        },
        {
          prioritynum: 6,
          flighttype: "过夜航班",
          flightkey: "GY",
        },
      ],
    };
  },
  components: {
    draggable,
  },
  methods: {
    // // 前端分页功能
    // // 每页显示的条数
    // handleSizeChange(val) {
    //   // 改变每页显示的条数
    //   this.PageSize = val;
    //   // 注意：在改变每页显示的条数时，要将页码显示到第一页
    //   this.currentPage = 1;
    // },
    // // 显示第几页
    // handleCurrentChange(val) {
    //   // 改变默认的页数
    //   this.currentPage = val;
    // },

    //修改排序规则
    getRule(row) {
      this.clickRule = row;
      // console.log(this.clickRule);
      this.radioRule = this.clickRule.sortrule;
      //打开对话框
      this.changeRuleDialog = true;
    },
    changeRule() {
      //封装数据
      let data = {
        id: this.clickRule.id,
        sortrule: this.radioRule,
      };
      //更新数据
      updateRuleById(data).then(() => {
        //更新后请求数据
        this.getData();
        this.$message({
          message: "更新成功！",
          type: "success",
          offset: 300,
          center: true,
          duration: 2000,
        });
      });
      // 关闭对话框
      this.changeRuleDialog = false;
    },

    //点击航班任务优先级配置
    openPrioritySettingDialog() {
      this.dragTableData = [];
      //判断用哪个数据渲染
      if (this.tableData.length == 0) {
        this.dragTableData = JSON.parse(JSON.stringify(this.dragData));
      } else {
        //如果配置就显示数据库的数据
        this.dragTableData = JSON.parse(JSON.stringify(this.tableData));
      }
      this.prioritySettingDialog = true;
    },
    // 取消拖拽选择
    prioritySettingCancel() {
      // 关闭对话框
      this.prioritySettingDialog = false;
    },
    // 确认拖拽选择
    prioritySettingConfirm() {
      //如果tableData为空，保存默认数据
      if (this.tableData.length == 0) {
        //修改prioritynum值-并封装数据-用于保存数据
        let data = [];
        for (let i = 0; i < this.dragTableData.length; i++) {
          let onedata = {
            airportname: this.$store.state.airportNameVuex,
            flighttype: this.dragTableData[i].flighttype,
            flightkey: this.dragTableData[i].flightkey,
            prioritynum: i+1,
            sortrule: 0,
            userId: window.sessionStorage.usernamen,
            updateTime: getNewtime(),
          };
          data.push(onedata);
        }
        //保存数据
        insertFlightPriorityData(data).then(() => {
          //请求数据
          this.getData();
        });
      } else {
        // 如果不为空则判断一下是否修改了数据
        let ischage = false;
        for (let i = 0; i < this.tableData.length; i++) {
          //判断优先级有没有改变
          if (
            this.tableData[i].prioritynum != this.dragTableData[i].prioritynum
          ) {
            ischage = true;
            break;
          }
        }
        //如果改变则请求保存数据
        if (ischage) {
          //首先删除之前的数据
          let airportname = {
            airportname: this.$store.state.airportNameVuex,
            userId: window.sessionStorage.usernamen,
          };
          deleteFlightPriorityData(airportname).then(() => {
            //插入数据
            let data = [];
            for (let i = 0; i < this.dragTableData.length; i++) {
              let onedata = {
                airportname: this.$store.state.airportNameVuex,
                flighttype: this.dragTableData[i].flighttype,
                flightkey: this.dragTableData[i].flightkey,
                prioritynum: i+1,
                sortrule: this.dragTableData[i].sortrule,
                userId: window.sessionStorage.usernamen,
                updateTime: getNewtime(),
              };
              data.push(onedata);
            }
            //保存数据
            insertFlightPriorityData(data).then(() => {
              //请求数据
              this.getData();
            });
          });
        }
      }
      // 关闭对话框
      this.prioritySettingDialog = false;
    },

    //请求数据
    getData() {
      //请求数据
      let airportname = {
        airportname: this.$store.state.airportNameVuex,
        userId: window.sessionStorage.usernamen,
      };
      selectFlightPriorityData(airportname).then((res) => {
        //如果该用户没有配置，则显示默认数据
        if (res.data.length == 0) {
          this.dragTableData = JSON.parse(JSON.stringify(this.dragData));
        } else {
          //如果配置就显示数据库的数据
          this.dragTableData = JSON.parse(JSON.stringify(res.data));
          this.tableData = JSON.parse(JSON.stringify(res.data));
          this.totalCount = this.tableData.length;
          this.subTableData = JSON.parse(JSON.stringify(this.tableData));
        }
      });
    },
  },
  created() {
    if (this.$store.state.airportNameVuex === ''){
      this.$message({
            message: "请在航班数据页面选择测试数据！",
            type: "warning",
            offset: 300,
            center: true,
            duration: 3000,
          });
    }
    //请求数据
    let airportname = {
      airportname: this.$store.state.airportNameVuex,
      userId: window.sessionStorage.usernamen,
    };
    selectFlightPriorityData(airportname).then((res) => {
      //如果该用户没有配置，则显示默认数据
      if (res.data.length == 0) {
        this.dragTableData = JSON.parse(JSON.stringify(this.dragData));
        // console.log(this.dragTableData);
      } else {
        //如果配置就显示数据库的数据
        this.dragTableData = JSON.parse(JSON.stringify(res.data));
        this.tableData = JSON.parse(JSON.stringify(res.data));
        this.totalCount = this.tableData.length;
        this.subTableData = JSON.parse(JSON.stringify(this.tableData));
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.handle-box {
  margin-bottom: 20px;
}
// .pagination {
//   display: flex;
//   justify-content: left;
//   margin-top: 30px;
// }
.drag-box-item {
  flex: 1;
  max-width: 100%;
  min-width: 300px;
  max-height: 400px;
  min-height: 400px;
  background-color: #eff1f5;
  margin-right: 16px;
  border-radius: 6px;
  border: 1px #e1e4e8 solid;
}
.item-title {
  display: flex;
  justify-content: center;
  padding: 10px 10px 15px 15px;
  font-size: 20px;
  line-height: 1.5;
  color: #24292e;
  font-weight: 600;
}
.item-ul {
  padding: 0 8px 8px;
  height: 500px;
  overflow-y: scroll;
}
.item-ul::-webkit-scrollbar {
  width: 0;
}
.drag-list {
  display: flex;
  justify-content: center;
  border: 1px #e1e4e8 solid;
  padding: 10px;
  margin: 5px 0 10px;
  list-style: none;
  background-color: #409eff;
  font-size: 20px;
  color: white;
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  border-radius: 6px;
  cursor: pointer;
  -webkit-transition: border 0.3s ease-in;
  transition: border 0.3s ease-in;
}
.drag-list:hover {
  border: 1px solid #20a0ff;
}
.ghost-style {
  display: block;
  color: transparent;
  border-style: dashed;
}
</style>
