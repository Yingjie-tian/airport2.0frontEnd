<template>
  <div class="loginContainer" :style="'width:' + fullwidth + 'px;'">
    <!-- 标题栏 -->
    <div class="header-top">
      <div class="header-flex">
        <div class="header-logo">
          <img src="../../assets/img/bjtu-logo.png" alt="图片" />
        </div>
        <div class="header-text">
          <span class="top-c">机位分配人员辅助训练系统</span>
          <br />
          <span class="top-e"
            >Auxiliary Training System for Aircraft Allocation Personnel</span
          >
        </div>
        <div class="top-login">
          <span
            @click="
              showlogin = !showlogin;
              showregister = false;
            "
            >登录</span
          >
          <span
            @click="
              showregister = !showregister;
              showlogin = false;
            "
            >注册</span
          >
        </div>
      </div>
    </div>
    <!-- 走马灯 -->
    <div class="bottom">
      <div class="carousel">
        <el-carousel :interval="3000" arrow="always" height="100vh">
          <el-carousel-item v-for="(item, index) in pictrues" :key="index">
            <img :src="item.url" alt="图片未加载" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="loginBox" v-if="showlogin">
        <!-- 退出登录按钮 -->
        <div class="loginx" @click="showlogin = false">
          <i class="el-icon-close"></i>
        </div>
        <!-- 标题 -->
        <div class="loginTitle">
          <!-- <h2>机场资源调度仿真平台</h2> -->
          <h2>请输入账号和密码</h2>
        </div>
        <!-- 表单 -->
        <!-- rules数据验证 ref返回实例对象 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          class="loginForm"
          :rules="loginFormRules"
        >
          <!-- 用户名 -->
          <el-form-item class="loginUP" prop="username">
            <el-input
              v-model="loginForm.username"
              prefix-icon="iconfont icon-user"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item class="loginUP" prop="password">
            <el-input
              v-model="loginForm.password"
              prefix-icon="iconfont icon-3702mima"
              type="password"
              @keyup.enter.native="login"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <!-- 登录和重置 -->
          <el-form-item class="loginBtu">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- ----------------------------------------------------------------------------------------------- -->
      <!-- 注册注册10/26 -->
      <div class="registerBox" v-if="showregister">
        <!-- 退出登录按钮 -->
        <div class="loginx" @click="showregister = false">
          <i class="el-icon-close"></i>
        </div>
        <!-- 标题 -->
        <div class="registerTitle">
          <!-- <h2>机场资源调度仿真平台</h2> -->
          <h2>用户注册</h2>
        </div>
        <!-- 表单 -->
        <!-- rules数据验证 ref返回实例对象 -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          class="registerForm"
          :rules="registerFormRules"
        >
          <!-- 用户名 -->
          <el-form-item class="registerUP" prop="usernames">
            <el-input
              v-model="registerForm.usernames"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item class="registerUP" prop="passwords">
            <el-input
              v-model="registerForm.passwords"
              prefix-icon="iconfont icon-3702mima"
              type="password"
              @keyup.enter.native="login"
              placeholder="密码"
              class="registerinput"
            ></el-input>
          </el-form-item>
          <!-- 重复密码 -->
          <el-form-item class="registerUP" prop="checkpasswords">
            <el-input
              v-model="registerForm.checkpasswords"
              prefix-icon="iconfont icon-3702mima"
              type="password"
              @keyup.enter.native="login"
              placeholder="重复密码"
            ></el-input>
          </el-form-item>
          <!-- 登录和重置 -->
          <el-form-item class="loginBtu">
            <el-button type="primary" @click="register">注册</el-button>
            <el-button type="info" @click="resetregisterForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      // console.log('value:'+value)
      this.getUsers();
      // let ulist=[]
      for (let i = 0; i < this.usersTable.length; i++) {
        this.ulist.push(this.usersTable[i].username);
      }
      // console.log('ulist:'+this.ulist)
      for (let j = 0; j < this.ulist.length; j++) {
        if (value === this.ulist[j]) {
          callback(new Error("该用户名已被注册，请重新输入"));
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      // console.log('!!'+value)
      // console.log('??'+JSON.stringify(this.registerForm.passwords))
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.passwords) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        //登录表单的数据绑定对象
        username: "", //用户名
        password: "", //密码
      },
      // 10/26
      registerForm: {
        //注册表单的数据绑定对象
        usernames: "",
        passwords: "",
        checkpasswords: "",
      },
      //存用户数据
      usersTable: "",
      //存数据库读取到的用户名
      ulist: [],
      ordinary: "ordinary",
      //表达数据验证对象
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 0, max: 10, message: "长度为0~10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度为6~10个字符", trigger: "blur" },
        ],
      },
      //注册表单数据验证对象10/26
      registerFormRules: {
        usernames: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 0, max: 10, message: "长度为0~10个字符", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
        passwords: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度为6~10个字符", trigger: "blur" },
        ],
        checkpasswords: [
          // { required: true, message: "请输入重复登录密码", trigger: "blur"},
          { min: 6, max: 10, message: "长度为6~10个字符", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
      // 控制登录表单是否显示
      showlogin: false,
      // 控制注册表单是否显示10/26
      showregister: false,
      // 图片的地址
      pictrues: [
        {
          url: require("../../assets/img/0001.png"),
        },
        {
          url: require("../../assets/img/0002.png"),
        },
        {
          url: require("../../assets/img/0003.png"),
        },
      ],
      // 动态设置图片宽度
      imgHeight: "",

      // 屏幕宽度
      fullwidth: document.documentElement.clientWidth,
    };
  },
  created() {
    this.getUsers();
  },
  watch: {
    fullwidth: function (val) {
      if (!this.timer) {
        this.fullwidth = val;
        this.timer = true;
        setTimeout(function () {
          this.timer = false;
        }, 400);
      }
    },
  },
  methods: {
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
        // console.log('//'+JSON.stringify(this.usersTable));
      });
    },
    resetLoginForm() {
      //点击按钮，重置表单
      //this.$refs.loginFormRef调用实例对象
      this.$refs.loginFormRef.resetFields();
    },
    resetregisterForm() {
      this.$refs.registerFormRef.resetFields();
    },
    login() {
      let username = this.loginForm.username;
      let password = this.loginForm.password;
      //登录校验
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return; //如果false不发送请求
        //如果校验通过，则发送请求
        await this.$axios({
          method: "post",
          url: `http://localhost:8866/user/login?username=${username}&password=${password}`,
          headers: {
            "Content-type": "x-www-form-urlencoded;charset=UTF-8",
            "Content-type": "application/json",
          },
        })
          .then((res) => {
            //使用res接受返回数据
            //判断是否登录成功
            // 使用返回的code判断
            // console.log(res);
            if (res.data.code !== 10000) {
              return this.$message({
                message: "用户名或密码错误，登录失败！",
                type: "error",
                offset: 100,
                center: true,
                duration: 2000,
                // zIndex:5,
                // position:absolute,
              });
            } else {
              // 登录成功
              this.$message({
                message: "登录成功！",
                type: "success",
                offset: 300,
                center: true,
                duration: 1000,
              });
              // 1.保存token 角色和用户名
              let token = res.data.data.token;
              this.$store.commit("set_token", token);
              let rolen = res.data.data.role;
              this.$store.commit("set_role", rolen);
              let usernamen = res.data.data.userName;
              this.$store.commit("set_username", usernamen);
              //2.通过编程式导航跳转页面，地址/home
              this.$router.push("/flightData");
              this.showregister = false;
            }
          })
          .catch((err) => {
            // 出现异常，打印错误
            console.log(err);
          });
      });
    },

    // 10/26注册按钮
    register() {
      let re = {
        username: this.registerForm.usernames,
        password: this.registerForm.passwords,
        // checkpasswords:this.registerForm.checkpasswords,
        name: this.ordinary,
      };
      if (this.registerForm.checkpasswords === this.registerForm.passwords) {
        // console.log('密码：'+this.registerForm.passwords+'chongdu:'+this.registerForm.checkpasswords)
        this.$axios({
          method: "post",
          url: "http://localhost:8866/user/insertUser",
          data: re,
          headers: {
            token: window.sessionStorage.token,
            "Content-type": "x-www-form-urlencoded;charset=UTF-8",
            "Content-type": "application/json",
          },
        }).then(() => {
          //   // 关闭对话框
          this.showregister = false;
          this.showlogin = true;
        });
      }
    },
    // 动态设置图片宽度
    setHeightSize: function () {
      // console.log(window.innerWidth);
      let width = document.documentElement.clientWidth;
      // console.log(width);
      this.imgHeight = (722 / 1365) * width;
      // let hight = document.documentElement.clientHeight;
      // console.log(hight);
      // this.imgHeight
    },
    getBodyWidth() {
      window.onresize = () => {
        return () => {
          window.fullwidth = document.documentElement.clientWidth;
          this.fullwidth = window.fullwidth;
        };
      };
    },
  },
  mounted() {
    this.getBodyWidth();
    this.setHeightSize();
    window.onresize = () => {
      this.setHeightSize();
    };
  },
};
</script>

<style lang="scss" scoped>
// .registerinput{
//   margin-left: 50px;;
// }
.loginContainer {
  // background: url(../../../static/img/bg2.jpg);
  // background-repeat: no-repeat;
  // background-position: center;
  height: 100%;
  .header-top {
    width: 100%;
    height: 90px;
    z-index: 99999;
    background: url(../../assets/img/top2.png);
    background-repeat: repeat-x;
    background-position: center;
    position: absolute;
    left: 0;
    top: 0;
    .header-flex {
      display: flex;
      justify-content: right;
      align-items: center;
      padding-top: 20px;
      margin-left: 40px;
      // margin-top: 10px;
      color: white;
      .header-logo {
        img {
          height: 60px;
          width: 60px;
        }
      }
      .header-text {
        margin-left: 10px;
        // margin-top: 10px;
        .top-c {
          font-size: 32px;
        }
        .top-e {
          font-size: 14px;
        }
      }
      .top-login {
        margin-left: 56%;
        font-size: 18px;
      }
    }
  }
  .bottom {
    position: relative;
    // top: -80px;
    left: 0px;
    height: 100vh;
    // margin-top: -80px;
    // z-index: -1;
    // width: 100%;
    img {
      width: 100vw;
      height: 100vh;
      object-fit: cover;
    }
    // .el-carousel__item h3 {
    //   color: #475669;
    //   font-size: 18px;
    //   opacity: 0.75;
    //   line-height: 300px;
    //   margin: 0;
    // }
    // .el-carousel__item:nth-child(2n) {
    //   background-color: #99a9bf;
    // }

    // .el-carousel__item:nth-child(2n + 1) {
    //   background-color: #d3dce6;
    // }
    .loginBox {
      z-index: 9999999;
      height: 50%;
      width: 500px;
      background: url(../../../static/img/bg4.png);
      border-radius: 3px; //圆角边框
      //居中显示
      position: absolute;
      left: 50%;
      top: 50%;
      //位移到正中间
      transform: translate(-50%, -50%);
    }
    //10/26
    .registerBox {
      z-index: 9999999;
      height: 50%;
      width: 500px;
      background: url(../../../static/img/bg4.png);
      border-radius: 3px; //圆角边框
      //居中显示
      position: absolute;
      left: 50%;
      top: 50%;
      //位移到正中间
      transform: translate(-50%, -50%);
    }
    .loginx {
      position: absolute;
      left: 93%;
      top: 5%;
    }
    .loginTitle h2 {
      position: absolute;
      font-size: 30px;
      left: 25%;
      top: 20%;
      color: white;
    }
    //10/26
    .registerTitle {
      position: absolute;
      font-size: 30px;
      left: 36%;
      top: 19%;
      color: white;
    }
    .loginForm {
      position: absolute;
      top: 35%;
      width: 100%;
      padding: 0px 90px;
      box-sizing: border-box;
      opacity: 1;
      .loginBtu {
        display: flex;
        justify-content: flex-end;
      }
    }
    .registerForm {
      position: absolute;
      top: 35%;
      width: 100%;
      padding: 0px 90px;
      box-sizing: border-box;
      opacity: 1;
      .loginBtu {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
<style scoped>
.el-input__inner {
  margin-bottom: 0px !important;
}
.el-input--prefix .el-input__inner {
  padding-left: 15px;
}
</style>

<style scoped>
.el-carousel__arrow {
  height: 100px;
  width: 100px;
  /* background-color:white; */
  /* background: white; */
  opacity: 1;
}
.el-carousel__arrow:focus {
  /* 点击后边框会消失 */
  outline: none;
}
.el-form {
  position: absolute;
  z-index: 3;
}
.el-message {
  position: absolute;
  z-index: 9999999999999999 !important;
}
.loginContainer .bottom[data-v-08b4fdc3] {
  position: relative;
  /* top: -50px; */
  left: 0px;
}
::-webkit-scrollbar {
  width: 0 !important;
}
::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}
</style>
