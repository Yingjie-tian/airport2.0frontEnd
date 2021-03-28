<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
                >{{ subItem.title }}</el-menu-item
              >
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [{
          icon: "el-icon-s-data",
          index: "1",
          title: "训练数据",
          subs: [
            {
              index: "flightData",
              title: "航班数据",
            },
            {
              index: "gateData",
              title: "机位数据",
            },
          ],
        },
        {
          icon: "el-icon-setting",
          index: "2",
          title: "规则库",
          subs: [
            {
              index: "limitOfPushback",
              title: "同区域滑入推出限制",
            },
            {
              index: "LimitOfAircraft_type",
              title: "机位机型限制",
            },
            {
              index: "LimitOfairline",
              title: "航司机位限制",
            },
            {
              index: "LimitOfbridge",
              title: "航司靠桥率限制",
            },
            {
              index: "timeParameter",
              title: "时间参数配置",
            },
            {
              index: "flightPriority",
              title: "航班任务优先级配置",
            },
            // {
            //   index: "parkinggatePriority",
            //   title: "机位资源优先级配置",
            // },
          ],
        },
        {
          icon: "el-icon-edit-outline",
          index: "gateAssignments",
          title: "机位分配",
        },
        {
          icon: "el-icon-tickets",
          index: "3",
          title: "分配结果评价",
          subs: [
            {
              index: "resultDiagnios",
              title: "结果诊断",
            },
            {
              index: "statistics",
              title: "统计数据",
            },
          ],
        },
        {
          icon: "el-icon-setting",
          index: "uesrsManage",
          title: "用户管理",
        }
        ],

         // 角色和用户名---登录后获取
      rolen: window.sessionStorage.rolen,
      username: window.sessionStorage.usernamen
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  created() {
     // this.$store.commit("set_role", rolen);
    //从store中拿出set_role
    //调用接口  传参为  role的值，拿到菜单列表，赋值给 items
    //  this.getMenu()
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    if(this.rolen !== 'admin'){
      this.items =  [{
          icon: "el-icon-s-data",
          index: "1",
          title: "训练数据",
          subs: [
            {
              index: "flightData",
              title: "航班数据",
            },
            {
              index: "gateData",
              title: "机位数据",
            },
          ],
        },
        {
          icon: "el-icon-setting",
          index: "2",
          title: "规则库",
          subs: [
            {
              index: "limitOfPushback",
              title: "同区域滑入推出限制",
            },
            {
              index: "LimitOfAircraft_type",
              title: "机位机型限制",
            },
            {
              index: "LimitOfairline",
              title: "航司机位限制",
            },
            {
              index: "LimitOfbridge",
              title: "航司靠桥率限制",
            },
            {
              index: "timeParameter",
              title: "时间参数配置",
            },
            {
              index: "flightPriority",
              title: "航班任务优先级配置",
            },
            // {
            //   index: "parkinggatePriority",
            //   title: "机位资源优先级配置",
            // },
          ],
        },
        {
          icon: "el-icon-edit-outline",
          index: "gateAssignments",
          title: "机位分配",
        },
        {
          icon: "el-icon-tickets",
          index: "3",
          title: "分配结果评价",
          subs: [
            {
              index: "resultDiagnios",
              title: "结果诊断",
            },
            {
              index: "statistics",
              title: "统计数据",
            },
          ],
        }
        ]
    };

    bus.$on("collapse", (msg) => {
      this.collapse = msg;
      bus.$emit("collapse-content", msg);
    });
  },
  methods:{
    getMenu(){
        var role = 'admin'
        this.$axios({
        method: "get",
        // 跨域调用
        url: "http://localhost:8866/user/getMenuList?role="+role,
        headers: {
          token: window.sessionStorage.token,
          "Content-type": "x-www-form-urlencoded;charset=UTF-8",
          "Content-type": "application/json",
        },
      }).then((res) => {
        this.items = res.data.data;
      })},
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
