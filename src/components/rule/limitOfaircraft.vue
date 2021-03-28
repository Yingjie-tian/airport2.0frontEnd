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
        <el-breadcrumb-item>机位机型限制</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <span>机型:</span>
        <el-input
          v-model="select_aircraft_type"
          placeholder="请输入"
          class="handle-input mr10"
        ></el-input>

        <span>机位编号:</span>
        <el-input
          v-model="select_stand"
          placeholder="请输入"
          class="handle-input mr10"
        ></el-input>
        <span>限制关系:</span>
        <!-- <el-input
          v-model="select_restriction"
          placeholder="请输入"
          class="handle-input mr10"
        ></el-input> -->
        <el-select v-model="select_restriction" placeholder="请选择限制关系">
          <el-option label="机型仅停机位" value="0"></el-option>
          <el-option label="机型限停机位" value="1"></el-option>
          <el-option label="机位仅停机型" value="2"></el-option>
          <el-option label="机位限停机型" value="3"></el-option>
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
        <el-table-column prop="mdl" label="机型" width="150" align="center">
        </el-table-column>
        <el-table-column
          prop="parkinggate"
          label="机位编号"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="restriction"
          label="限制关系"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.restriction === 0">机型仅停机位</span>
            <span v-if="scope.row.restriction === 1">机型限停机位</span>
            <span v-if="scope.row.restriction === 2">机位仅停机型</span>
            <span v-if="scope.row.restriction === 3">机位限停机型</span>
          </template>
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
      <!-- 修改机位机型限制表单 -->
      <el-dialog
        ref="updateForm"
        :visible.sync="updateStandAirTypeDialog"
        width="40%"
        title="修改机位机型限制"
      >
        <el-form
          ref="updateStandAirTypeFormref"
          :inline="true"
          :model="updateStandAirTypeForm"
          :rules="updateStandAirTypeFormRules"
          class="form-inline"
        >
          <el-form-item label="机型" prop="airType">
            <el-input
              v-model="updateStandAirTypeForm.airType"
              placeholder="机型"
            ></el-input>
          </el-form-item>
          <el-form-item label="机位编号" prop="Num_of_stand">
            <!-- <el-input
              v-model.number="updateStandAirTypeForm.Num_of_stand"
              placeholder="机位编号"
            ></el-input> -->
            <el-select
              v-model.number="updateStandAirTypeForm.Num_of_stand"
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
          <el-form-item label="限制关系" prop="limitOptions">
            <el-select
              v-model="updateStandAirTypeForm.limitOptions"
              placeholder="请选择限制关系"
            >
              <el-option label="机型仅停机位" value="0"></el-option>
              <el-option label="机型限停机位" value="1"></el-option>
              <el-option label="机位仅停机型" value="2"></el-option>
              <el-option label="机位限停机型" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Confirm_update"
              >确认修改</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 新建机位机型限制表单 -->
      <el-dialog
        ref="newForm"
        :visible.sync="newStandAirTypeDialog"
        width="40%"
        title="新建机位机型限制"
      >
        <el-form
          ref="newStandAirTypeFormref"
          :inline="true"
          :model="newStandAirTypeForm"
          :rules="newStandAirTypeFormRules"
          class="form-inlinareae"
        >
          <el-form-item label="机型" prop="airType">
            <el-input
              v-model="newStandAirTypeForm.airType"
              placeholder="请输入机型"
            ></el-input>
          </el-form-item>
          <el-form-item label="机位编号" prop="Num_of_stand">
            <!-- <el-input
              v-model.number="newStandAirTypeForm.Num_of_stand"
              placeholder="请输入机位编号"
            ></el-input> -->
            <el-select
              v-model.number="newStandAirTypeForm.Num_of_stand"
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
          <el-form-item label="限制关系" prop="limitType">
            <el-select
              v-model="newStandAirTypeForm.limitType"
              placeholder="请选择限制关系"
            >
              <el-option label="机位仅停机型" value="1"></el-option>
              <el-option label="机型仅停机位" value="0"></el-option>
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
  getStandAirTypeByAN,
  batchDeleteStandAirType,
  insterStandAirType,
  updateStandAirType,
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
      // 机场中的机位
      airportParkinggates: [],
      // 目前获取数据的id
      current_id: -1,
      // 修改机位和限停机位表单数据update
      updateStandAirTypeForm: {
        airType: "",
        Num_of_stand: "",
        limitOptions: "",
      },
      // 修改机位和限停机位表单验证规则
      updateStandAirTypeFormRules: {
        airType: [
          { required: true, message: "机型不能为空！", trigger: "blur" },
        ],
        Num_of_stand: [
          {
            required: true,
            message: "机位编号不能为空！",
            trigger: "blur",
          },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        limitOptions: [
          {
            required: true,
            message: "请选择限制关系！",
            trigger: "blur",
          },
        ],
      },
      // 新建限停机位数据
      newStandAirTypeForm: {
        airType: "",
        Num_of_stand: "",
        limitType: "",
      },
      // 新建机位机型表单验证规则
      newStandAirTypeFormRules: {
        airType: [
          { required: true, message: "机型不能为空！", trigger: "blur" },
        ],
        Num_of_stand: [
          {
            required: true,
            message: "机位编号不能为空！",
            trigger: "blur",
          },
          { type: "number", message: "必须为数字值！", trigger: "blur" },
        ],
        limitType: [
          {
            required: true,
            message: "请选择限制关系！",
            trigger: "blur",
          },
        ],
      },

      // 查询输入机位
      select_stand: [],
      // 查询输入机型
      select_aircraft_type: [],
      // 查询输入限制关系
      select_restriction: [],
      // 多选中用于删除的数据
      bathcesForDelete: [],
      // 修改同区域限停机位编号对话框
      updateStandAirTypeDialog: false,
      newStandAirTypeDialog: false,
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
      console.log("CHECK-CHECK##", this.tableData);
    },
    // 获取数据
    getData() {
      let airportname = {
        airportname: this.$store.state.airportNameVuex,
        userId: window.sessionStorage.usernamen,
      };
      getStandAirTypeByAN(airportname).then((res) => {
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
    // 根据区域编号和机位编号查询
    SelectAll() {
      this.tableData = this.backupData;
      this.totalCount = this.tableData.length;

      let input1 = this.select_aircraft_type;
      let input2 = this.select_stand;
      let input3 = this.select_restriction;
      let table = [];

      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].mdl.toString().indexOf(input1) != -1) {
          if (this.tableData[i].parkinggate.toString().indexOf(input2) != -1) {
            if (
              this.tableData[i].restriction.toString().indexOf(input3) != -1
            ) {
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
      this.select_stand = [];
      this.select_aircraft_type = [];
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
            batchDeleteStandAirType(this.bathcesForDelete).then(() => {
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
          batchDeleteStandAirType(data)
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
    // 打开新建区域限停机位表单
    New() {
      this.newStandAirTypeDialog = true;
      // 重置表单
      this.newStandAirTypeForm.airType = "";
      this.newStandAirTypeForm.Num_of_stand = "";
      this.newStandAirTypeForm.limitType = "";
      this.resetNewForm();
    },
    // 打开修改区域限停机位表单
    change(id) {
      this.updateStandAirTypeDialog = true;
      console.log("这行数据的id是：" + id);
      this.current_id = id;

      let index = this.tableData.findIndex((item) => {
        if (item.id == id) {
          return true;
        }
      });

      let table = this.tableData[index];
      console.log(table);
      this.updateStandAirTypeForm.limitOptions = table.restriction.toString();
      this.updateStandAirTypeForm.Num_of_stand = parseInt(table.parkinggate);
      this.updateStandAirTypeForm.airType = table.mdl;
    },
    // 修改区域限停机位-提交
    Confirm_update() {
      let data = {
        parkinggate: this.updateStandAirTypeForm.Num_of_stand,
        mdl: this.updateStandAirTypeForm.airType,
        id: this.current_id,
        restriction: this.updateStandAirTypeForm.limitOptions,
        userId: window.sessionStorage.usernamen,
        updateTime: getNowtime(),
      };
      console.log(data);
      this.$refs.updateStandAirTypeFormref.validate((valid) => {
        if (valid) {
          updateStandAirType(data)
            .then((res) => {
              this.$message({
                message: "修改信息成功",
                type: "success",
                center: true,
              });
              // 关闭对话框
              this.updateStandAirTypeDialog = false;
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
        parkinggate: this.newStandAirTypeForm.Num_of_stand,
        mdl: this.newStandAirTypeForm.airType,
        restriction: this.newStandAirTypeForm.limitType,
        airportname: this.$store.state.airportNameVuex,
        userId: window.sessionStorage.usernamen,
        updateTime: getNowtime(),
      };
      this.$refs.newStandAirTypeFormref.validate((valid) => {
        if (valid) {
          console.log(data);
          insterStandAirType(data)
            .then(() => {
              this.$message({
                message: "插入信息成功",
                type: "success",
                center: true,
              });
              // 关闭对话框
              this.newStandAirTypeDialog = false;
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