<template>
  <div>
    <!-- 面包屑---显示当前页面的路径，快速返回之前的任意页面-->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Dashboard' }">
          <i class="el-icon-lx-text"></i> 规则配置
        </el-breadcrumb-item>
        <el-breadcrumb-item>时间参数配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <span>参数配置名称:</span>
        <el-input
          v-model="select_paraname"
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
          prop="paraname"
          label="参数配置名称"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="warningtime1"
          label="同机位时间间隔"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="warningtime2"
          label="同区域时间间隔"
          width="200"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>

        <!-- <el-table-column
          prop="warningtime3"
          label="同目的航班时长间隔"
          width="150"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
         -->
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
      <!-- 修改时间参数配置表单 -->
      <el-dialog
        ref="updateForm"
        :visible.sync="updateTimeParameterDialog"
        width="40%"
        title="修改时间参数配置"
      >
        <el-form
          ref="updateTimeParameterFormref"
          :inline="true"
          :model="updateTimeParameterForm"
          :rules="updateTimeParameterFormRules"
          class="form-inline"
        >
          <el-form-item label="参数名称" prop="paraname">
            <el-input
              v-model="updateTimeParameterForm.paraname"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="同机位时间间隔" prop="warningtime1">
            <el-input
              v-model.number="updateTimeParameterForm.warningtime1"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="同区域时间间隔" prop="warningtime2">
            <el-input
              v-model.number="updateTimeParameterForm.warningtime2"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Confirm_update"
              >确认修改</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 新建时间参数配置表单 -->
      <el-dialog
        ref="newForm"
        :visible.sync="newTimeParameterDialog"
        width="40%"
        title="新建机位机型限制"
      >
        <el-form
          ref="newTimeParameterFormref"
          :inline="true"
          :model="newTimeParameterForm"
          :rules="newTimeParameterFormRules"
          class="form-inlinareae"
        >
          <el-form-item label="参数名称" prop="paraname">
            <el-input
              v-model="newTimeParameterForm.paraname"
              placeholder="请输入参数名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="同机位时间间隔" prop="warningtime1">
            <el-input
              v-model.number="newTimeParameterForm.warningtime1"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="同区域时间间隔" prop="warningtime2">
            <el-input
              v-model.number="newTimeParameterForm.warningtime2"
              placeholder="请输入"
            ></el-input>
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
  getTimeParameter,
  deleteTimeParameter,
  insertTimeParameter,
  updateTimeParameter,
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
      // 目前获取数据的id
      current_id: -1,
      // 修改机位和限停机位表单数据update
      updateTimeParameterForm: {
        // 参数名称
        paraname: "",
        // 同机位时间间隔
        warningtime1: "",
        // 同区域滑入推出时间间隔
        warningtime2: "",
      },
      // 修改时间参数配置表单验证规则
      updateTimeParameterFormRules: {
        paraname: [
          { required: true, message: "参数名称不能为空！", trigger: "blur" },
        ],
        warningtime1: [
          {
            required: true,
            message: "同机位时间间隔不能为空！",
            trigger: "blur",
          },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        warningtime2: [
          {
            required: true,
            message: "同区域滑入推出时间间隔不能为空！",
            trigger: "blur",
          },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
      },
      // 新建限停机位数据
      newTimeParameterForm: {
        // 参数名称
        paraname: "",
        // 同机位时间间隔
        warningtime1: "",
        // 同区域滑入推出时间间隔
        warningtime2: "",
      },
      // 新建机位机型表单验证规则
      newTimeParameterFormRules: {
        paraname: [
          { required: true, message: "参数名称不能为空！", trigger: "blur" },
        ],
        warningtime1: [
          {
            required: true,
            message: "同机位时间间隔不能为空！",
            trigger: "blur",
          },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        warningtime2: [
          {
            required: true,
            message: "同区域时间间隔不能为空！",
            trigger: "blur",
          },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
      },

      // 查询输入机位
      select_airline_code: [],
      // 查询输入时间参数名称
      select_paraname: [],
      // 多选中用于删除的数据
      bathcesForDelete: [],
      // 修改同区域限停机位编号对话框
      updateTimeParameterDialog: false,
      newTimeParameterDialog: false,
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
  },
  mounted() {},
  methods: {
    // 测试用，检验后端的数据
    check_check() {
      console.log("CHECK-CHECK##", this.tableData);
    },
    // 获取数据
    getData() {
      let airportname = {
        airportname: this.$store.state.airportNameVuex,
        userId: window.sessionStorage.usernamen,
      };
      getTimeParameter(airportname).then((res) => {
        if (res.data.length == 0) {
          console.log(res.data);
        } else {
          this.allData = JSON.parse(JSON.stringify(res.data));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          console.log(res);
          this.totalCount = this.tableData.length;
          // 备份表格数据
          this.backupData = JSON.parse(JSON.stringify(this.tableData));
        }
      });
    },
    // 根据区域编号和机位编号查询
    SelectAll() {
      this.tableData = this.backupData;
      this.totalCount = this.tableData.length;

      let input1 = this.select_paraname;
      let input2 = this.select_airline_code;
      let table = [];

      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].paraname.toString().indexOf(input1) != -1) {
          table.push(this.tableData[i]);
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    // 重置查询条件
    reset() {
      this.select_airline_code = [];
      this.select_paraname = [];
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
        console.log(this.bathcesForDelete);
        this.$confirm("确认删除所选数据吗", "提示", { type: "warning" }).then(
          () => {
            deleteTimeParameter(this.bathcesForDelete).then(() => {
              // 重新请求数据
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
          console.log(data);
          deleteTimeParameter(data)
            .then((res) => {
              console.log(res);
            })
            .then(() => {
              this.$message({
                message: "delete successly",
              });
              // 重新获取数据
              this.getData();
            });
        }
      );
    },
    // 打开新建区域限停机位表单
    New() {
      this.newTimeParameterDialog = true;
      // 重置表单
      this.newTimeParameterForm.paraname = "";
      this.newTimeParameterForm.warningtime1 = "";
      this.newTimeParameterForm.warningtime2 = "";
      this.resetNewForm();
    },
    // 打开修改区域限停机位表单
    change(id) {
      this.updateTimeParameterDialog = true;
      // console.log("这行数据的id是：");
      // console.log(id);
      this.current_id = id;
      let index = this.tableData.findIndex((item) => {
        if (item.id == id) {
          return true;
        }
      });
      let table = this.tableData[index];
      // console.log(table);
      this.updateTimeParameterForm.paraname = table.paraname;
      this.updateTimeParameterForm.warningtime1 = table.warningtime1;
      this.updateTimeParameterForm.warningtime2 = table.warningtime2;
    },
    // 修改区域限停机位-提交
    Confirm_update() {
      let data = {
        id: this.current_id,
        paraname: this.updateTimeParameterForm.paraname,
        warningtime1: this.updateTimeParameterForm.warningtime1,
        warningtime2: this.updateTimeParameterForm.warningtime2,
        airportname: this.$store.state.airportNameVuex,
        userId: window.sessionStorage.usernamen,
        // airportname: "LJG",
        // userId: "admin",
        updateTime: getNowtime(),
      };
      this.$refs.updateTimeParameterFormref.validate((valid) => {
        if (valid) {
          updateTimeParameter(data)
            .then((res) => {
              this.$message({
                message: "修改信息成功",
                type: "success",
                center: true,
              });
              // 关闭对话框
              this.updateTimeParameterDialog = false;
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
    // 新增机场区域限停机位
    Confirm_new() {
      let data = {
        paraname: this.newTimeParameterForm.paraname,
        warningtime1: this.newTimeParameterForm.warningtime1,
        warningtime2: this.newTimeParameterForm.warningtime2,
        airportname: this.$store.state.airportNameVuex,
        userId: window.sessionStorage.usernamen,
        // airportname: "LJG",
        // userId: "admin",
        updateTime: getNowtime(),
      };
      this.$refs.newTimeParameterFormref.validate((valid) => {
        if (valid) {
          console.log(data);
          insertTimeParameter(data)
            .then(() => {
              this.$message({
                message: "插入信息成功",
                type: "success",
                center: true,
              });
              // 关闭对话框
              this.newTimeParameterDialog = false;
            })
            .then(() => {
              // 重新渲染表格
              this.getData();
            });
        } else {
          alert("请填写相关信息");
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