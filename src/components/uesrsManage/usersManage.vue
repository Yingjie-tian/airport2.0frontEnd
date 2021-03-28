<template>
  <div style="height:100px;width:100%">
     <!-- 面包屑---显示当前页面的路径，快速返回之前的任意页面-->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-user-solid"></i> 用户管理
        </el-breadcrumb-item>
        <!-- <el-breadcrumb-item>航班数据</el-breadcrumb-item> -->
      </el-breadcrumb>
    </div>
  <div class="container">	
    <!-- 添加用户按钮和查找功能 -->
    <el-header>
      <el-button class="opt2" @click="addFormDialog = true" type="primary" icon="el-icon-set">+新建</el-button>
      <el-button class="opt3" @click="delectFormDialog = true" type="danger" icon="el-icon-delete">批量删除</el-button>

     <!-- <div> 用户名:<el-input
        placeholder="请输入用户名"
        v-model="findUserInput"
        clearable
      ></el-input>
    </div> -->
    <div> 
     <span class="username">用户名 :</span>
    <el-input v-model="findUserInput" placeholder="请输入用户名" clearable size="small" /> </div>
     <div> 
    <span class="userrole">用户角色 :</span>
    <el-input v-model="roleValue" placeholder="请输入角色" clearable size="small" /> </div>
      <!-- <div> 用户角色: <el-input
        placeholder="请输入角色"
        v-model="roleValue"
        clearable
      ></el-input> 
      </div> -->
      
      <!-- <el-select placeholder="请选择角色" v-model="roleValue" clearable></el-select>
      <el-form-item label="角色">
          <el-select v-model="roleValue" placeholder="请选择">
            <el-option
              v-for="item in rolesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->

    </el-header>
    <el-main>
      <!-- 分割线 -->
      <!-- <el-divider></el-divider> -->
      <!-- 表格数据 -->
      <el-table
      
        :data="
          usersTable.slice((currentPage - 1) * PageSize, currentPage * PageSize)
        "
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column prop="id" label="id" align="center">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          align="center"
        ></el-table-column>
        <!-- <el-table-column prop="username"  label="用户名" align="center" width="200"> </el-table-column> -->
        <el-table-column
          prop="password"
          label="密码"
          align="center"
        >
          <!-- 不显示密码 -->
          <template slot-scope="scope">{{
            scope.row.password | noShowPassword
          }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openEditFrom(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="openDelDialog(scope.row)"
            ></el-button>
          </template>
          <!-- 修改按钮 -->
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
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
    </el-main>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addFormDialog"
      width="50%"
      @close="resetAddForm"
    >
      <!-- 内容主体 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addForm.role" placeholder="请选择">
            <el-option
              v-for="item in rolesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户密码"
      :visible.sync="editDialog"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="name">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除某个用户的对话框 -->
    <el-dialog :visible.sync="delUserDialog" width="40%">
      <h2>确认删除吗？</h2>
      <span slot="footer">
        <el-button @click="delUserDialog = false">取消</el-button>
        <el-button type="primary" @click="delUser">确定</el-button>
      </span>
    </el-dialog>
    <!-- 批量删除的对话框 -->
    <el-dialog :visible.sync="delectFormDialog" width="40%">
      <h2>确认删除吗？</h2>
      <span slot="footer">
        <el-button @click="delectFormDialog = false">取消</el-button>
        <el-button type="primary" @click="delectname">确定</el-button>
      </span>
    </el-dialog>  
    </div> 
</div> 
 
</template>

<script>
export default {
  data() {
    // var validatePass = (rule, value, callback) => {
    //   // console.log('value:'+value)
    //   this.getUsers()
    //   // let ulist=[]
    //   for(let i=0;i<this.usersTable.length;i++){
    //     this.ulist.push(this.usersTable[i].username)
    //   }
    //   // console.log('ulist:'+this.ulist)
    //   for(let j=0;j<this.ulist.length;j++){
    //     if(value === this.ulist[j]){
    //       callback(new Error('该用户名已存在，请添加其他用户名'));
    //     }
    //   }
    //   };
      var validateUsername = (rule, value, callback) => {
      this.checkUserExist();
      if(this.userCheck.code != 0){
          callback(new Error(this.userCheck.msg));
        }else{
          if(this.userCheck.data == true){
             callback(new Error("用户名已存在"));
          }
        }
      };
    return {
      // 查询用户名的输入框绑定值
      findUserInput: "",
      roleValue: "",
       usersTable:"",
      // 用户列表的绑定数据
      usersTable: [
        // {
        //   username: "Alen1",
        //   password: "123456",
        //   role: "admin"
        // },
        // {
        //   username: "Mike1",
        //   password: "123456",
        //   role: "admin"
        // },
        // {
        //   username: "admin",
        //   password: "123456",
        //   role: "admin"
        // },
        // {
        //   username: "admin",
        //   password: "123456",
        //   role: "admin"
        // },
        // {
        //   username: "admin",
        //   password: "123456",
        //   role: "admin"
        // },
        // {
        //   username: "admin",
        //   password: "123456",
        //   role: "admin"
        // },
        // {
        //   username: "admin",
        //   password: "123456",
        //   role: "admin"
        // }
      ],
      //多选框
      multipleSelection: [],
      // 备用数据
      subUsersTable: [],

      // 前端分页功能
      // 当前页，默认显示第1页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [3, 5, 8],
      // 默认每页显示的条数（可修改）
      PageSize: 8,
      userCheck:{
        msg: '用户名长度应在2-16'
      },
      // 添加用户
      // 控制添加用户对话框-默认不显示
      addFormDialog: false,
      // 添加用户表单的绑定值
      addForm: {
        username: "",
        password: "",
        role: "",
      },
      //添加用户表单验证规则
      addFormRules: {
        //  usernames: [
        //   { required: true, message: "请输入用户名", trigger: "blur" },
        //   { min: 0, max: 10, message: "长度为0~10个字符", trigger: "blur" },
        //   {validator: validatePass,trigger: ['blur','change'] }
        // ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 16, message: "长度为2~16个字符", trigger: ['blur','change'] },
          { validator: validateUsername,trigger: ['blur','change'] }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度为6~10个字符", trigger: "blur" },
        ],
        role: [{ required: true, message: "请输入角色", trigger: "blur" }],
      },

      // 控制修改用户对话框的显示与隐藏
      editDialog: false,
      // 修改表单绑定值
      editForm: {},
      // 点击的是哪一个用户
      currentUser: {},
      // 修改表单的验证规则对象
      editFormRules: {
        // username: [
        //   { required: true, message: "请输入用户名", trigger: "blur" },
        //   { min: 3, max: 5, message: "长度为3~5个字符", trigger: "blur" }
        // ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度为6~10个字符", trigger: "blur" },
        ],
        // role: [{ required: true, message: "请输入权限", trigger: "blur" }]
      },

      // 删除某个用户的对话框
      delUserDialog: false,
      delectFormDialog: false,

      // 角色选择器
      rolesOptions: [
        {
          value: "admin",
          label: "admin",
        },
        {
          value: "ordinary",
          label: "ordinary",
        },
      ],
      // 角色选择器绑定值
      roleValue: "",
      //result:[],
    };
  },
  created() {
    //  this.getUsers()
    // 页面加载，显示用户管理数据
    this.getUsers().then(() => {
      // 分页功能
      this.totalCount = this.usersTable.length;
      // 备用数据-重复使用查询关键字
      this.subUsersTable = JSON.parse(JSON.stringify(this.usersTable));
    });
    // this.totalCount = this.usersTable.length;
  },
  filters: {
    noShowPassword(password) {
      let num = password.length;
      let showpassword = "";
      for (let i = 0; i < num; i++) {
        showpassword += "*";
      }
      return showpassword;
    },
  },
  watch: {
    // 监听输入表单的数据，返回筛选后的数据
    findUserInput: function () {
      this.usersTable = JSON.parse(JSON.stringify(this.subUsersTable));
      let input = this.findUserInput;
      let table = [];
      for (let i = 0; i < this.usersTable.length; i++) {
        if (this.usersTable[i].username.indexOf(input) != -1) {
          table.push(this.usersTable[i]);
        }
      }
      this.usersTable = table;
      this.totalCount = this.usersTable.length;
    },
    //监听输入表单的角色数据，返回筛选后的数据
    roleValue: function () {
      this.usersTable = JSON.parse(JSON.stringify(this.subUsersTable));
      let input = this.roleValue;
      let table = [];
      for (let i = 0; i < this.usersTable.length; i++) {
        if (this.usersTable[i].name.indexOf(input) != -1) {
          table.push(this.usersTable[i]);
        }
      }
      this.usersTable = table;
      this.totalCount = this.usersTable.length;
    },
  },

  methods: {
    //  async getUsers() {
    //   await this.$axios({
    //     method: "get",
    //     // 跨域调用
    //     url: "http://localhost:8866/user/selectAllUsers",
    //     headers: {
    //       token: window.sessionStorage.token,
    //       "Content-type": "x-www-form-urlencoded;charset=UTF-8",
    //       "Content-type": "application/json"
    //     }
    //   }).then(data => {
    //     // 将数据保存到本地中
    //     this.usersTable = data.data;
    //     // console.log('//'+JSON.stringify(this.usersTable));
    //   });
    // },
  checkUserExist(){
     this.$axios({
        method: "get",
        url: "http://localhost:8866/user/checkUserExist?username="+this.addForm.username,
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
      }).then((res) => {
        this.userCheck =  res.data
      })
    },
    //多选框
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

    // 添加用户
    //关闭对话框，重置添加用户表单
    resetAddForm() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 发送请求-获取用户数据
    async getUsers() {
      await this.$axios({
        method: "get",
        // 跨域调用
        url: "http://localhost:8866/user/selectAllUsers",
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
      }).then((data) => {
        // 将数据保存到本地中
        this.usersTable = data.data;
        console.log(this.usersTable);
      });
    },

    //添加用户
    async addUser() {

      // 获取表单输入的内容
      let oneuser = {
        username: this.addForm.username,
        password: this.addForm.password,
        name: this.addForm.role
      };
      // console.log(oneuser);
      await this.$axios({
        method: "post",
        url: "http://localhost:8866/user/insertUser",
        data: oneuser,
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
      }).then(() => {
        //   // 关闭对话框
        this.addFormDialog = false;
        // 清空选择器
        this.roleValue = "";
        // 重新请求数据
        this.getUsers().then(() => {
          this.totalCount = this.usersTable.length;
          // this.currentPage = 1
        });
      });
    },

    // 编辑用户-修改密码
    openEditFrom(row) {
      this.currentUser = row;
      this.editForm.username = row.username;
      this.editForm.name = row.name;
      this.editDialog = true;
    },
    async editUser() {
      let newpassword = {
        id: this.currentUser.id,
        password: this.editForm.password,
      };
      await this.$axios({
        method: "post",
        url: "http://localhost:8866/user/updatePS",
        data: newpassword,
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
      })
        .then(() => {
          //   // 关闭对话框
          this.editDialog = false;
          // 重新请求数据
          this.getUsers();
        })
        .then(() => {
          this.$message({
            message: "密码修改成功！",
            type: "success",
            offset: 0,
            center: true,
            duration: 3000,
          });
        });
    }, //批量删除用户
    async delectname() {
      console.log(this.multipleSelection)
      let namelist = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        let name = {
          id: this.multipleSelection[i].id,
        };
        namelist.push(name)
      }
        console.log(namelist);
        await this.$axios({
        method: "post",
        url: "http://localhost:8866/user/condeleteUser",
        data: namelist,
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
      })
        .then(() => {
          // 关闭对话框
          this.delectFormDialog = false;

          // 重新请求数据
          this.getUsers().then(() => {
            this.totalCount = this.usersTable.length;
            this.currentPage = 1;
          });
        })
        .then(() => {
          this.$message({
            message: "删除用户成功！",
            type: "success",
            offset: 0,
            center: true,
            duration: 3000,
          });
        });


    },

    // 删除用户
    openDelDialog(row) {
      this.currentUser = row;
      this.delUserDialog = true;
    },
    async delUser() {
      let deluser = {
        id: this.currentUser.id,
      };
      await this.$axios({
        method: "post",
        url: "http://localhost:8866/user/deleteUser",
        data: deluser,
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
      })
        .then(() => {
          // 关闭对话框
          this.delUserDialog = false;

          // 重新请求数据
          this.getUsers().then(() => {
            this.totalCount = this.usersTable.length;
            this.currentPage = 1;
          });
        })
        .then(() => {
          this.$message({
            message: "删除用户成功！",
            type: "success",
            offset: 0,
            center: true,
            duration: 3000,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>

.pagination {
  margin-top: 20px;
}
.el-header {
  display: flex;
  justify-content: left;
  padding-top: 20px;
  padding-left: 40px;
  .opt2 {
    height: 32px;
    width: 100px;
    font-size: 15px;
    color: white;
    // background-color: red;
    // border: red 1px solid;
  }
  .opt3 {
    height: 32px;
    width: 110px;
    font-size: 15px;
    margin-left:34px;
   
    

    // color: white;
    //  background-color:red;
    // border: red 1px solid;
  }
  
  .opt2:hover,
  opt2:active {
    //添加数据按钮鼠标移入和激活样式
    opacity: 0.6;
    background-color: white;
    color: red;
    border: red 1px solid;
  }
  .el-input {
    // margin-left: 3px;
    // height: 43px;
    width: 250px;
  }
  // .el-input--small .el-input__inner {
  //   height: 43px;
  // }
}
.username{
   font-size: inherit;
   margin-left: 34px;
}
.userrole{
   font-size: inherit;
   margin-left: 34px;
}
.el-main {
  padding-left: 40px;
  .el-divider {
    padding: 0px;
    margin: 0px;
  }
  .el-pagination {
    margin-top: 20px;
  }

}
// .aaa{
//   width: 100%;
//   height: 100%;
// }
</style>
