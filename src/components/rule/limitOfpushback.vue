<template>
  <div>
    <!-- 面包屑---显示当前页面的路径，快速返回之前的任意页面-->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <!-- <el-breadcrumb-item :to="{ path: '/dashboard' }" v-if="rolen !== 'admin'">
          <i class="el-icon-lx-text"></i> 申报入口
        </el-breadcrumb-item> -->
        <el-breadcrumb-item :to="{ path: '/Dashboard' }">
          <i class="el-icon-lx-text"></i> 规则配置
        </el-breadcrumb-item>
        <!-- <el-breadcrumb-item v-if="rolen !== 'admin'">运输车辆申报</el-breadcrumb-item> -->
        <el-breadcrumb-item>推出滑入限制</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <span>区域编号:</span>
        <el-input
          v-model="select_area"
          placeholder="请输入"
          class="handle-input mr10"
        ></el-input>

        <span>机位编号:</span>
        <el-input
          v-model="select_stand"
          placeholder="请输入"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" class="handle-select mr10" @click="SelectAll"
          >查询</el-button
        >
        <el-button class="handle-reset mr10" @click="reset">重置</el-button>
      </div>
      <div class="handle-box1">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          class="handle-select mr10"
          @click="New"
          >新建</el-button
        >

        <el-button
          type="danger"
          icon="el-icon-delete"
          class="handle-reset mr10"
          @click="delete_in_bathces"
          >批量删除</el-button
        >
        <!-- <el-button class="handle-reset mr10" @click="rule_detail"
          >...</el-button
        > -->
      </div>
      <el-table
        ref="multipleTable"
        :data="
          tableData.slice((currentPage - 1) * PageSize, currentPage * PageSize)
        "
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          prop="select_box"
          type="selection"
          width="55"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="airportname"
          label="机场名称"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="areaid"
          label="区域编号"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="parkinggate"
          label="限制机位编号"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="最后更新时间"
          width="350"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="methods" label="操作" align="center">
          <template slot-scope="scope">
            <!-- v-if="rolen == 'admin'" -->
            <el-button
              
              type="text"
              icon="el-icon-edit"
              @click="change(scope.row.id)"
              >修改</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="Delete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改同区域限停机位表单 -->
      <el-dialog
        ref="updateForm"
        :visible.sync="NumOfStandDialog"
        width="50%"
        title="修改区域内限停机位"
      >
        <el-form
          ref="updateStandOfLimitFormref"
          :inline="true"
          :model="updateStandOfLimitForm"
          :rules="updateStandOfLimitFormRules"
          class="form-inline"
        >
          <el-form-item label="区域编号" prop="Num_of_area">
            <el-input
              v-model.number="updateStandOfLimitForm.Num_of_area"
              placeholder="区域编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="限制机位编号" prop="Num_of_stand">
            <!-- <el-input
              v-model.number="updateStandOfLimitForm.Num_of_stand"
              placeholder="限制机位编号"
            ></el-input> -->
            <el-select
              v-model.number="updateStandOfLimitForm.Num_of_stand"
              placeholder="请选择限制机位编号"
            >
              <el-option
                v-for="item in airportParkinggates"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Confirm_update"
              >确认修改</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 新建区域限停机位表单 -->
      <el-dialog
        ref="newForm"
        :visible.sync="NewNumOfStandDialog"
        width="50%"
        title="新建区域内限停机位"
      >
        <el-form
          ref="newStandOfLimitFormref"
          :inline="true"
          :model="newStandOfLimitForm"
          :rules="newStandOfLimitFormRules"
          class="form-inlinareae"
        >
          <el-form-item label="区域编号" prop="Num_of_area">
            <el-input
              v-model.number="newStandOfLimitForm.Num_of_area"
              placeholder="请输入区域编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="机位编号" prop="Num_of_stand">
            <el-select
              v-model.number="newStandOfLimitForm.Num_of_stand"
              placeholder="请选择限制机位编号"
            >
              <el-option
                v-for="item in airportParkinggates"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Confirm_new">确认添加</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 分页功能 -->
      <div class="pagination" style="float: right">
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
      <div class="handle-box2">
        <el-button @click="toggleSelection()">取消选择</el-button>
        <!-- <el-button type="success" @click="check_check()">测试-check</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  getByInputName,
  deleteArea,
  insertinfo,
  updateLimitInfoById,
  batchDelete,
  selectGateData,
} from "../common/axios/index";
import getNowtime from "../common/js/index";
export default {
  data() {
    return {
      // 用户角色
      rolen: window.sessionStorage.rolen,
      // 获取的数据
      allData: [],
      // 渲染表格数据
      tableData: [],
      // 备用表格数据
      backupData: [],
      // 机场中的机位数据表格
      parkinggateTableDate: [],
      // 机场中的机位
      airportParkinggates: [],
      // 目前获取数据的id
      current_id: -1,
      // 修改机位和限停机位表单数据update
      updateStandOfLimitForm: {
        Num_of_area: "",
        Num_of_stand: "",
      },
      // 修改机位和限停机位表单验证规则
      updateStandOfLimitFormRules: {
        Num_of_area: [
          { required: true, message: "区域编号不能为空！", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        Num_of_stand: [
          {
            required: true,
            message: "限停机位编号不能为空！",
            trigger: "blur",
          },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
      },
      // 新建限停机位数据
      newStandOfLimitForm: {
        Num_of_area: "",
        Num_of_stand: "",
      },
      // 新增机位和限停机位表单验证规则
      newStandOfLimitFormRules: {
        Num_of_area: [
          { required: true, message: "区域编号不能为空！", trigger: "blur" },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        Num_of_stand: [
          {
            required: true,
            message: "限停机位编号不能为空！",
            trigger: "blur",
          },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
      },

      // 查询输入机位编号
      select_stand: [],
      // 查询输入区域编号
      select_area: [],
      // 多选中用于删除的数据
      bathcesForDelete: [],
      // 修改同区域限停机位编号对话框
      NumOfStandDialog: false,
      NewNumOfStandDialog: false,
      multipleSelection: [],
      // 前端分页功能
      // 当前页，默认显示第1页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [5, 10, 20],
      // 默认每页显示的条数（可修改）
      PageSize: 10,
    };
  },
  created() {
    this.getData();
    if (this.$store.state.airportNameVuex === "") {
      this.$message({
        message: "请在航班数据页面选择测试数据！",
        type: "warning",
        offset: 300,
        center: true,
        duration: 3000,
      });
    }
    // this.totalCount = this.tableData.length;

    // 请求机场机位表格数据
    let data = {
      airportname: this.$store.state.airportNameVuex,
    };
    selectGateData(data).then((res) => {
      // 保存机场机位数据
      let tmptable = JSON.parse(JSON.stringify(res.data));
      console.log(tmptable);
      for (let i = 0; i < tmptable.length; i++) {
        this.airportParkinggates.push(tmptable[i].parkinggate);
        // tmptable[i].airportname=this.airportname;
        // this.gatestatelist[i]=tmptable[i].state;
      }
      // this.parkinggateTableDate = JSON.parse(JSON.stringify(tmptable));
      console.log(this.airportParkinggates);
    });
  },
  mounted() {},
  methods: {
    // 测试用，检验后端的数据
    check_check() {
      console.log(this.tableData);
    },
    // 获取数据
    getData() {
      // this.backupData = this.tableData
      // this.totalCount = this.backupData.length
      let airportname = {
        airportname: this.$store.state.airportNameVuex,
        userId: window.sessionStorage.usernamen,
      };
      getByInputName(airportname).then((res) => {
        if (res.data.length == 0) {
        } else {
          this.allData = JSON.parse(JSON.stringify(res.data));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          this.totalCount = this.tableData.length;
          // if (this.allData = this.tableData){
          //   console.log("true");
          // }
          // 备份表格数据
          this.backupData = JSON.parse(JSON.stringify(this.tableData));
          // console.log(this.backupData);
          // console.log(this.tableData);
        }
      });
    },
    // 根据区域编号和机位编号查询
    SelectAll() {
      this.tableData = this.backupData;
      this.totalCount = this.tableData.length;

      let input1 = this.select_area;
      let input2 = this.select_stand;
      let table = [];

      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].areaid.toString().indexOf(input1) != -1) {
          if (this.tableData[i].parkinggate.toString().indexOf(input2) != -1) {
            table.push(this.tableData[i]);
          }
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    // 重置查询条件
    reset() {
      this.select_stand = [];
      this.select_area = [];
      this.tableData = this.backupData;
      this.totalCount = this.tableData.length;
    },
    // 批量删除
    delete_in_bathces() {
      for (var i = 0; i < this.multipleSelection.length; i++) {
        var Item = this.multipleSelection[i];
        this.bathcesForDelete.push(Item);
      }
      if (this.bathcesForDelete.length == 0) {
        this.$confirm("请选择需要删除的数据", "提示", { type: "warning" });
      } else {
        // console.log(this.bathcesForDelete);
        this.$confirm("确认删除所选数据吗", "提示", { type: "warning" }).then(
          () => {
            batchDelete(this.bathcesForDelete).then(() => {
              // 重新请求表格数据
              this.getData();
              this.multipleSelection = [];
              this.bathcesForDelete = [];
              this.$message({
                message: "delete successly",
              });
            });
          }
        );
      }
    },
    // 删除一条数据
    Delete(id) {
      // console.log(id);
      this.$confirm("确认删除所选数据吗", "提示", { type: "warning" }).then(
        () => {
          // this.tableData.splice(id, 1);
          let data = {
            id: id,
          };
          // console.log(id);
          deleteArea(data)
            .then((res) => {
              console.log(res);
            })
            .then(() => {
              this.getData();
              this.$message({
                message: "delete successly",
              });
            });
        }
      );
    },
    // 打开新建区域限停机位表单
    New() {
      this.NewNumOfStandDialog = true;
      // 重置表单
      this.newStandOfLimitForm.Num_of_area = "";
      this.newStandOfLimitForm.Num_of_stand = "";
      this.resetNewForm();
    },
    // 打开修改区域限停机位表单
    change(id) {
      this.NumOfStandDialog = true;
      console.log("这行数据的id是：" + id);
      this.current_id = id;
      let index = this.tableData.findIndex((item) => {
        if (item.id == id) {
          return true;
        }
      });
      let table = this.tableData[index];
      console.log(table);
      // this.resetUpdateForm;
      this.updateStandOfLimitForm.Num_of_area = parseInt(table.areaid);
      this.updateStandOfLimitForm.Num_of_stand = parseInt(table.parkinggate);
    },
    // 修改区域限停机位-提交
    Confirm_update() {
      let data = {
        areaid: this.updateStandOfLimitForm.Num_of_area,
        parkinggate: this.updateStandOfLimitForm.Num_of_stand,
        id: this.current_id,
        userId: window.sessionStorage.usernamen,
        updateTime: getNowtime(),
      };
      this.$refs.updateStandOfLimitFormref.validate((valid) => {
        if (valid) {
          updateLimitInfoById(data).then((res) => {
            this.$message({
              message: "修改信息成功",
              type: "success",
              center: true,
            });
            // 关闭对话框
            this.NumOfStandDialog = false;
            // 重新渲染表格
            this.getData();
          });
        } else {
          alert("请输入相关信息");
          return false;
        }
      });
    },
    // 新增机场区域限停机位
    Confirm_new() {
      let data = {
        areaid: this.newStandOfLimitForm.Num_of_area,
        parkinggate: this.newStandOfLimitForm.Num_of_stand,
        airportname: this.$store.state.airportNameVuex,
        userId: window.sessionStorage.usernamen,
        updateTime: getNowtime(),
      };
      // console.log(data);
      this.$refs.newStandOfLimitFormref.validate((valid) => {
        if (valid) {
          insertinfo(data)
            .then(() => {
              this.$message({
                message: "插入信息成功",
                type: "success",
                center: true,
              });
              // 关闭对话框
              this.NewNumOfStandDialog = false;
            })
            .then(() => {
              // 重新渲染表格
              this.getData();
            });
        } else {
          alert("请输入相关信息");
          return false;
        }
      });
    },
    resetNewForm() {
      this.$refs.newForm.resetFields();
    },
    resetUpdateForm() {
      this.$refs.updateForm.resetFields();
    },
    rule_detail() {},
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
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
  },
};
</script>

<style scoped>
.handle-input {
  width: 150px;
  display: inline-block;
}
.handle-box {
  margin-bottom: 20px;
}
.handle-box1 {
  margin-bottom: 20px;
}
.el-table {
  margin-bottom: 20px;
}
.red {
  color: #ff0000;
}
</style>