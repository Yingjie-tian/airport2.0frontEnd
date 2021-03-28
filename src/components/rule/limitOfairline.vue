<template>
  <div>
    <!-- 面包屑---显示当前页面的路径，快速返回之前的任意页面-->
    <!-- 随便写点，vscode提交测试 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/Dashboard' }">
          <i class="el-icon-lx-text"></i> 规则配置
        </el-breadcrumb-item>
        <el-breadcrumb-item>航司机位限制</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <span>航司名称:</span>
        <el-input
          v-model="select_airlinename"
          placeholder="请输入"
          class="handle-input mr10"
        ></el-input>

        <span>航司代码:</span>
        <el-input
          v-model="select_airlineCd"
          placeholder="请输入"
          class="handle-input mr10"
        ></el-input>
        <span>限制关系:</span>
        <el-select v-model="select_restriction" placeholder="请选择限制关系">
          <el-option label="航司仅停机型" value="0"></el-option>
              <el-option label="航司限停机型" value="1"></el-option>
              <el-option label="机位仅停航司" value="2"></el-option>
              <el-option label="机位限停航司" value="3"></el-option>
        </el-select>
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
          prop="airlineCd"
          label="航司代码"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="airlinename"
          label="航司名称"
          width="350"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="parkinggate"
          label="机位"
          width="150"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="state"
          label="限制关系"
          width="250"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.state === 0">航司仅停机型</span>
            <span v-if="scope.row.state === 1">航司限停机型</span>
            <span v-if="scope.row.state === 2">机位仅停航司</span>
            <span v-if="scope.row.state === 3">机位限停航司</span>
          </template>
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
      <!-- 修改航司机位限制表单 -->
      <el-dialog
        ref="updateForm"
        :visible.sync="updateAirlineStandDialog"
        width="60%"
        title="修改航司机位限制"
      >
        <el-form
          ref="updateAirlineStandFormref"
          :inline="true"
          :model="updateAirlineStandForm"
          :rules="updateAirlineStandFormRules"
          class="form-inline"
        >
          <el-form-item label="航司代码" prop="airlineCd">
            <el-input
              v-model="updateAirlineStandForm.airlineCd"
              placeholder="请输入航司代码"
            ></el-input>
          </el-form-item>
          <el-form-item label="航司名称" prop="airlinename">
            <el-input
              v-model="updateAirlineStandForm.airlinename"
              placeholder="请输入航司名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="机位编号" prop="parkinggate">
            <!-- <el-input
              v-model.number="updateAirlineStandForm.parkinggate"
              placeholder="机位编号"
            ></el-input> -->
            <el-select
              v-model.number="updateAirlineStandForm.parkinggate"
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
          <el-form-item label="限制关系" prop="state">
            <el-select
              v-model="updateAirlineStandForm.state"
              placeholder="请选择限制关系"
            >
              <el-option label="航司仅停机型" value="0"></el-option>
              <el-option label="航司限停机型" value="1"></el-option>
              <el-option label="机位仅停航司" value="2"></el-option>
              <el-option label="机位限停航司" value="3"></el-option>
              
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Confirm_update"
              >确认修改</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 新建航司机位限制表单 -->
      <el-dialog
        ref="newForm"
        :visible.sync="newAirlineStandDialog"
        width="60%"
        title="新建航司机位限制"
      >
        <el-form
          ref="newAirlineStandDialog"
          :inline="true"
          :model="newAirlineStandForm"
          :rules="newAirlineStandFormRules"
          class="form-inlinareae"
        >
          <el-form-item label="航司代码" prop="airlineCd">
            <el-input
              v-model="newAirlineStandForm.airlineCd"
              placeholder="请输入航司代码"
            ></el-input>
          </el-form-item>
          <el-form-item label="航司名称" prop="airlinename">
            <el-input
              v-model="newAirlineStandForm.airlinename"
              placeholder="请输入航司名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="机位编号" prop="parkinggate">
            <!-- <el-input
              v-model.number="newAirlineStandForm.parkinggate"
              placeholder="请输入机位编号"
            ></el-input> -->
            <el-select
              v-model.number="newAirlineStandForm.parkinggate"
              placeholder="请选择机位编号"
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
          <el-form-item label="限制关系" prop="state">
            <el-select
              v-model="newAirlineStandForm.state"
              placeholder="请选择限制关系"
            >
              
              <el-option label="航司仅停机型" value="0"></el-option>
              <el-option label="航司限停机型" value="1"></el-option>
              <el-option label="机位仅停航司" value="2"></el-option>
              <el-option label="机位限停航司" value="3"></el-option>
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
  getairlineLimit,
  deleteAirlineLimit,
  insertAirlineLimit,
  updateAirlineLimit,
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
      // 目前获取数据的id
      current_id: -1,
      // 机场中的机位
      airportParkinggates: [],
      // 修改机位和限停机位表单数据update
      updateAirlineStandForm: {
        airlineCd: "",
        airlinename: "",
        parkinggate: "",
        state: "",
      },
      // 修改机位和限停机位表单验证规则
      updateAirlineStandFormRules: {
        airlineCd: [
          { required: true, message: "航司编号不能为空！", trigger: "blur" },
        ],
        airlinename: [
          { required: true, message: "航司名称不能为空！", trigger: "blur" },
        ],
        parkinggate: [
          {
            required: true,
            message: "机位编号不能为空！",
            trigger: "blur",
          },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        state: [
          {
            required: true,
            message: "请选择限制关系！",
            trigger: "blur",
          },
        ],
      },
      // 新建限停机位数据
      newAirlineStandForm: {
        airlineCd: "",
        airlinename: "",
        parkinggate: "",
        state: "",
      },
      // 新建机位机型表单验证规则
      newAirlineStandFormRules: {
        airlineCd: [
          { required: true, message: "航司代码不能为空！", trigger: "blur" },
        ],
        airlinename: [
          { required: true, message: "航司名称不能为空！", trigger: "blur" },
        ],
        parkinggate: [
          {
            required: true,
            message: "机位编号不能为空！",
            trigger: "blur",
          },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        state: [
          {
            required: true,
            message: "限制关系不能为空！",
            trigger: "blur",
          },
        ],
      },

      // 查询输入机位
      select_airlineCd: [],
      // 查询输入机型
      select_airlinename: [],
      // 查询输入限制关系
      select_restriction: [],
      // 多选中用于删除的数据
      bathcesForDelete: [],
      // 修改同区域限停机位编号对话框
      updateAirlineStandDialog: false,
      newAirlineStandDialog: false,
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
      }
      console.log(this.airportParkinggates);
    });
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
      getairlineLimit(airportname).then((res) => {
        if (res.data.length == 0) {
        } else {
          this.allData = JSON.parse(JSON.stringify(res.data));
          this.tableData = JSON.parse(JSON.stringify(this.allData));
          this.totalCount = this.tableData.length;
          // 备份表格数据
          this.backupData = JSON.parse(JSON.stringify(this.tableData));
        }
      });
    },
    // 根据航司名称和航司代码查询
    SelectAll() {
      this.tableData = this.backupData;
      this.totalCount = this.tableData.length;
      // console.log(this.tableData);

      let input1 = this.select_airlinename;
      let input2 = this.select_airlineCd;
      let input3 = this.select_restriction;
      let table = [];

      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].airlinename.toString().indexOf(input1) != -1) {
          if (this.tableData[i].airlineCd.toString().indexOf(input2) != -1) {
            if (this.tableData[i].state.toString().indexOf(input3) != -1) {
              table.push(this.tableData[i]);
            }            
          }
        }
      }
      this.tableData = table;
      this.totalCount = this.tableData.length;
      this.currentPage = 1;
    },
    // 重置查询条件
    reset() {
      this.select_airlineCd = [];
      this.select_airlinename = [];
      this.select_restriction = [];
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
            deleteAirlineLimit(this.bathcesForDelete).then(() => {
              // 重新请求数据
              this.getData();
              console.log("重新请求数据成功");
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
          deleteAirlineLimit(data)
            .then((res) => {
              console.log(res);
            })
            .then(() => {
              // 重新获取数据
              this.getData();
              this.$message({
                message: "delete successly",
              });
            });
        }
      );
    },
    // 打开新建航司机位限制表单
    New() {
      this.newAirlineStandDialog = true;
      // 重置表单
      this.newAirlineStandForm.airlineCd = "";
      this.newAirlineStandForm.airlinename = "";
      this.newAirlineStandForm.state = "";
      this.newAirlineStandForm.parkinggate = "";
      this.resetNewForm();
    },
    // 打开修改航司机位限制表单
    change(id) {
      this.updateAirlineStandDialog = true;
      console.log("这行数据的id是：");
      console.log(id);
      this.current_id = id;

      let index = this.tableData.findIndex((item) => {
        if (item.id == id) {
          return true;
        }
      });
      let table = this.tableData[index];
      console.log(table);
      this.updateAirlineStandForm.state = table.state.toString();
      this.updateAirlineStandForm.parkinggate = parseInt(table.parkinggate);
      this.updateAirlineStandForm.airlineCd = table.airlineCd;
      this.updateAirlineStandForm.airlinename = table.airlinename;
    },
    // 修改航司机位限制-提交
    Confirm_update() {
      let data = {
        airlinename: this.updateAirlineStandForm.airlinename,
        airlineCd: this.updateAirlineStandForm.airlineCd,
        parkinggate: this.updateAirlineStandForm.parkinggate,
        id: this.current_id,
        state: this.updateAirlineStandForm.state,
        airportname: this.$store.state.airportNameVuex,
        userId: window.sessionStorage.usernamen,
        // userId: "admin",
        // airportname: "LJG",
        updateTime: getNowtime(),
      };
      console.log(data);
      this.$refs.updateAirlineStandFormref.validate((valid) => {
        if (valid) {
          updateAirlineLimit(data)
            .then((res) => {
              this.$message({
                message: "修改信息成功",
                type: "success",
                center: true,
              });
              // 关闭对话框
              this.updateAirlineStandDialog = false;
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
        airlinename: this.newAirlineStandForm.airlinename,
        airlineCd: this.newAirlineStandForm.airlineCd,
        state: this.newAirlineStandForm.state,
        parkinggate: this.newAirlineStandForm.parkinggate,
        airportname: this.$store.state.airportNameVuex,
        userId: window.sessionStorage.usernamen,
        // airportname: "LJG",
        // userId: "admin",
        updateTime: getNowtime(),
      };
      this.$refs.newAirlineStandDialog.validate((valid) => {
        if (valid) {
          console.log(data);
          insertAirlineLimit(data)
            .then(() => {
              this.$message({
                message: "插入信息成功",
                type: "success",
                center: true,
              });
              // 关闭对话框
              this.newAirlineStandDialog = false;
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